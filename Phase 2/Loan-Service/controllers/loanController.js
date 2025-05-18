import axios from 'axios';
import circuitBreaker from 'opossum';
import Loan from '../models/Loan.js';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8081';
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:8082';

// Circuit breaker options
const breakerOptions = {
  timeout: 5000, // 5s timeout
  errorThresholdPercentage: 50,
  resetTimeout: 30000, // Retry after 30s
};

// Circuit breakers for HTTP calls
const userServiceBreaker = new circuitBreaker(
  async (url) => (await axios.get(url)).data,
  breakerOptions
);
const bookServiceBreaker = new circuitBreaker(
  async (url) => (await axios.get(url)).data,
  breakerOptions
);
const bookAvailabilityBreaker = new circuitBreaker(
  async (url, data) => (await axios.patch(url, data)).data,
  breakerOptions
);

class LoanController {
  static async createLoan(req, res) {
    try {
      const { user_id, book_id, due_date } = req.body;
      if (!user_id || !book_id || !due_date) {
        return res.status(400).json({ message: 'user_id, book_id, and due_date are required' });
      }

      // Validate user
      try {
        await userServiceBreaker.fire(`${USER_SERVICE_URL}/api/users/${user_id}`);
      } catch (error) {
        if (error.response?.status === 404) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(503).json({ message: 'User Service unavailable' });
      }

      // Validate book
      let book;
      try {
        book = await bookServiceBreaker.fire(`${BOOK_SERVICE_URL}/api/books/${book_id}`);
        if (book.available_copies <= 0) {
          return res.status(400).json({ message: 'No available copies' });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(503).json({ message: 'Book Service unavailable' });
      }

      // Update book availability
      try {
        await bookAvailabilityBreaker.fire(`${BOOK_SERVICE_URL}/api/books/${book_id}/availability`, {
          operation: 'decrement',
        });
      } catch (error) {
        return res.status(503).json({ message: 'Book Service unavailable' });
      }

      // Create loan
      const loan = await Loan.create({
        user_id,
        book_id,
        due_date: new Date(due_date),
        status: 'ACTIVE',
      });

      res.status(201).json({
        id: loan._id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        status: loan.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async returnLoan(req, res) {
    try {
      const { loan_id } = req.body;
      if (!loan_id) {
        return res.status(400).json({ message: 'loan_id is required' });
      }

      const loan = await Loan.findById(loan_id);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      if (loan.status === 'RETURNED') {
        return res.status(400).json({ message: 'Loan already returned' });
      }

      // Increment book availability
      try {
        await bookAvailabilityBreaker.fire(`${BOOK_SERVICE_URL}/api/books/${loan.book_id}/availability`, {
          operation: 'increment',
        });
      } catch (error) {
        return res.status(503).json({ message: 'Book Service unavailable' });
      }

      // Update loan
      loan.status = 'RETURNED';
      loan.return_date = new Date();
      await loan.save();

      res.status(200).json({
        id: loan._id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        status: loan.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getLoansByUser(req, res) {
    try {
      const { user_id } = req.params;

      // Validate user
      let user;
      try {
        user = await userServiceBreaker.fire(`${USER_SERVICE_URL}/api/users/${user_id}`);
      } catch (error) {
        if (error.response?.status === 404) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(503).json({ message: 'User Service unavailable' });
      }

      const loans = await Loan.find({ user_id });
      const loanResponses = await Promise.all(
        loans.map(async (loan) => {
          try {
            const book = await bookServiceBreaker.fire(`${BOOK_SERVICE_URL}/api/books/${loan.book_id}`);
            return {
              id: loan._id,
              book: {
                id: book.id,
                title: book.title,
                author: book.author,
              },
              issue_date: loan.issue_date,
              due_date: loan.due_date,
              return_date: loan.return_date,
              status: loan.status,
            };
          } catch (error) {
            return null; // Skip failed book fetches
          }
        })
      );

      res.status(200).json({
        loans: loanResponses.filter((loan) => loan !== null),
        total: loanResponses.length,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getLoan(req, res) {
    try {
      const loan = await Loan.findById(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      // Fetch user and book
      let user, book;
      try {
        user = await userServiceBreaker.fire(`${USER_SERVICE_URL}/api/users/${loan.user_id}`);
      } catch (error) {
        return res.status(503).json({ message: 'User Service unavailable' });
      }
      try {
        book = await bookServiceBreaker.fire(`${BOOK_SERVICE_URL}/api/books/${loan.book_id}`);
      } catch (error) {
        return res.status(503).json({ message: 'Book Service unavailable' });
      }

      res.status(200).json({
        id: loan._id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
        },
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        status: loan.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default LoanController;
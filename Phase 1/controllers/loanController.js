import Loan from '../models/Loan.js';
// import User from '../models/User.js';
// import Book from '../models/Book.js';
import BookController from './bookController.js';
import UserController from './userController.js';

class LoanController {
  static async createLoan(req, res) {
    try {
      const { user_id, book_id, due_date } = req.body;

      const user = await UserController.findUserById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const book = await BookController.isBookAvailable(book_id);
     if (!book) {
  return res.status(400).json({ message: 'Book not available' });
}


      // Create loan
      const loan = await Loan.create({
        user_id,
        book_id,
        issue_date: new Date(),
        due_date: new Date(due_date),
        status: 'ACTIVE',
      });

      // Decrement book copies
      await BookController.decrementBookCopies(book_id);

      res.status(201).json({ message: 'Loan created successfully', loan });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getLoan(req, res) {
    try {
      const loan = await Loan.findById(req.params.id)
        .populate('user_id', 'name email')
        .populate('book_id', 'title author');
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      res.status(200).json({ message: 'Loan fetched successfully', loan });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async returnLoan(req, res) {
    try {
      const loan = await Loan.findById(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      if (loan.status === 'RETURNED') {
        return res.status(400).json({ message: 'Book already returned' });
      }
      loan.status = 'RETURNED';
      loan.return_date = new Date();
      await loan.save();
      await BookController.incrementBookCopies(loan.book_id);
      res.status(200).json({ message: 'Book returned successfully', loan });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getLoansByUser(req, res) {
    try {
      const loans = await Loan.find({ user_id: req.params.user_id }).populate('book_id', 'title author');
      const loanResponse = loans.map(loan => ({
        id: loan._id,
        book: {
          id: loan.book_id._id,
          title: loan.book_id.title,
          author: loan.book_id.author,
        },
        issue_date: loan.issue_date.toISOString(),
        due_date: loan.due_date.toISOString(),
        return_date: loan.return_date ? loan.return_date.toISOString() : null,
        status: loan.status,
      }));
      res.status(200).json({ message: 'Loans fetched successfully', loans: loanResponse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getOverdueLoans(req, res) {
    try {
      const today = new Date();
      const overdueLoans = await Loan.find({
        due_date: { $lt: today },
        status: 'ACTIVE',
      })
        .populate('user_id', 'name email')
        .populate('book_id', 'title author');
      const overdueResponse = overdueLoans.map(loan => ({
        id: loan._id,
        user: {
          id: loan.user_id._id,
          name: loan.user_id.name,
          email: loan.user_id.email,
        },
        book: {
          id: loan.book_id._id,
          title: loan.book_id.title,
          author: loan.book_id.author,
        },
        issue_date: loan.issue_date.toISOString(),
        due_date: loan.due_date.toISOString(),
        days_overdue: Math.floor((today - loan.due_date) / (1000 * 60 * 60 * 24)),
      }));
      res.status(200).json({ message: 'Overdue loans fetched successfully', loans: overdueResponse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async extendLoan(req, res) {
    try {
      const { extension_days } = req.body;
      const loan = await Loan.findById(req.params.id);
      if (!loan || loan.status === 'RETURNED') {
        return res.status(404).json({ message: 'Loan not found or already returned' });
      }
      const original_due_date = new Date(loan.due_date);
      const extended_due_date = new Date(loan.due_date);
      extended_due_date.setDate(extended_due_date.getDate() + parseInt(extension_days));
      loan.due_date = extended_due_date;
      loan.extensions_count = (loan.extensions_count || 0) + 1;
      await loan.save();
      const extendedLoanResponse = {
        id: loan._id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        issue_date: loan.issue_date.toISOString(),
        original_due_date: original_due_date.toISOString(),
        extended_due_date: loan.due_date.toISOString(),
        status: loan.status,
        extensions_count: loan.extensions_count,
      };
      res.status(200).json({ message: 'Loan extended successfully', loan: extendedLoanResponse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default LoanController;
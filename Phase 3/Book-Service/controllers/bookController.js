import Book from '../models/Book.js';

class BookController {
  static async addBook(req, res) {
    try {
      const { title, author, isbn, copies } = req.body;
      if (!title || !author || !isbn || !copies) {
        return res.status(400).json({ message: 'Title, author, isbn, and copies are required' });
      }
      const book = await Book.create({
        title,
        author,
        isbn,
        copies,
        available_copies: copies,
      });
      res.status(201).json({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        copies: book.copies,
        available_copies: book.available_copies,
        created_at: book.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async searchBooks(req, res) {
    try {
      const query = req.query.search || '';
      const books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
        ],
      });
      res.status(200).json({
        books: books.map((book) => ({
          id: book._id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          copies: book.copies,
          available_copies: book.available_copies,
        })),
        total: books.length,
        page: 1,
        per_page: 10,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getBook(req, res) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        copies: book.copies,
        available_copies: book.available_copies,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async updateBook(req, res) {
    try {
      const { title, author, isbn, copies } = req.body;
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { title, author, isbn, copies, available_copies: copies || book.available_copies, updatedAt: new Date() },
        { new: true }
      );
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        copies: book.copies,
        available_copies: book.available_copies,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async updateAvailability(req, res) {
    try {
      const { available_copies, operation } = req.body;
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if (operation === 'increment') {
        book.available_copies = Math.min(book.copies, book.available_copies + 1);
      } else if (operation === 'decrement') {
        if (book.available_copies <= 0) {
          return res.status(400).json({ message: 'No available copies' });
        }
        book.available_copies -= 1;
      } else {
        book.available_copies = available_copies;
      }
      book.updatedAt = new Date();
      await book.save();
      res.status(200).json({
        id: book._id,
        available_copies: book.available_copies,
        updated_at: book.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async deleteBook(req, res) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default BookController;
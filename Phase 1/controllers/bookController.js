import Book from '../models/Book.js';

class BookController {
  static async addBook(req, res) {
    try {
      const { title, author, isbn, copies, genre } = req.body;
      const book = await Book.create({
        title,
        author,
        isbn,
        available_copies: copies,
        copies,
        genre,
      });
      res.status(201).json({ message: 'Book added successfully', book });
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
      res.status(200).json({ message: 'Book fetched successfully', book });
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
          { genre: { $regex: query, $options: 'i' } },
        ],
      });
      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found' });
      }
      res.status(200).json({ message: 'Books fetched successfully', books });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async updateBook(req, res) {
    try {
      const { title, author, isbn, copies, available_copies, genre } = req.body;
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { title, author, isbn, copies, available_copies, genre },
        { new: true }
      );
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book updated successfully', book });
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
      res.status(204).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async checkBookAvailability(req, res) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book || book.available_copies <= 0) {
        return res.status(404).json({ message: 'Book not available', isAvailable: false });
      }
      res.status(200).json({ message: 'Book is available', isAvailable: true, book });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getBookCount(req, res) {
    try {
      const count = await Book.countDocuments();
      res.status(200).json({ message: 'Book count fetched successfully', count });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getAvailableBookCount(req, res) {
    try {
      const count = await Book.countDocuments({ available_copies: { $gt: 0 } });
      res.status(200).json({ message: 'Available book count fetched successfully', count });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async decrementBookCopies(book_id) {
    const book = await Book.findById(book_id);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.available_copies > 0) {
      book.available_copies -= 1;
      await book.save();
    } else {
      throw new Error('No available copies');
    }
  }

  static async incrementBookCopies(book_id) {
    const book = await Book.findById(book_id);
    if (!book) {
      throw new Error('Book not found');
    }
    book.available_copies += 1;
    await book.save();
  }
}

export default BookController;
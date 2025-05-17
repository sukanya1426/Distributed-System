import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    isbn: String,
    copies: Number,
    available_copies: Number,
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
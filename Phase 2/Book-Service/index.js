import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/books.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Book Service connected to book_db'))
  .catch((err) => console.error('Book Service DB connection error:', err));

app.use('/api/books', userRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Book Service running on port ${PORT}`));
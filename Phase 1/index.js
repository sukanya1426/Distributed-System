import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';
import loanRoutes from './routes/loans.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    'mongodb+srv://bsse1426:jOdzdaRqkRtv52r2@cluster0.iirkblb.mongodb.net/Node-Api?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
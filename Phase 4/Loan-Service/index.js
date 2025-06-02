import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/loan.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Loan Service connected to user_db'))
  .catch((err) => console.error('Loan Service DB connection error:', err));

app.use('/api/loan', userRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Loan Service running on port ${PORT}`));
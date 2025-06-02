import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('User Service connected to user_db'))
  .catch((err) => console.error('User Service DB connection error:', err));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
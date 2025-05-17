import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ['student', 'faculty'], required: true },
    active: { type: Boolean, default: true }, // Added for activeUsers
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
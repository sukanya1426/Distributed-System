import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    issue_date: { type: Date, default: Date.now },
    due_date: Date,
    return_date: Date,
    status: { type: String, enum: ['ACTIVE', 'RETURNED'], default: 'ACTIVE' },
    extensions_count: { type: Number, default: 0 }, // Added for extendLoan
  },
  { timestamps: true }
);

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
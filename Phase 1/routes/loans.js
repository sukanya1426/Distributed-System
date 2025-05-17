import express from 'express';
import LoanController from '../controllers/loanController.js';

const loanRouter = express.Router();

loanRouter.post('/', LoanController.createLoan);
loanRouter.get('/by-id/:id', LoanController.getLoan);
loanRouter.put('/:id/return', LoanController.returnLoan);
loanRouter.get('/overdue', LoanController.getOverdueLoans);
loanRouter.get('/user/:user_id', LoanController.getLoansByUser);
loanRouter.put('/:id/extend', LoanController.extendLoan);

export default loanRouter;
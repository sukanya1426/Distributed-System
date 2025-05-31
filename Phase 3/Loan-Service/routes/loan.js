import express from 'express';
import LoanController from '../controllers/loanController.js';

const loanRouter = express.Router();

loanRouter.post('/', LoanController.createLoan);
loanRouter.post('/returns', LoanController.returnLoan);
loanRouter.get('/user/:user_id', LoanController.getLoansByUser);
loanRouter.get('/:id', LoanController.getLoan);

export default loanRouter;
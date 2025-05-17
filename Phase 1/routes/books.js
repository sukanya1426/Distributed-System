import express from 'express';
import BookController from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.post('/', BookController.addBook);
bookRouter.get('/', BookController.searchBooks);
bookRouter.get('/:id', BookController.getBook);
bookRouter.put('/:id', BookController.updateBook);
bookRouter.delete('/:id', BookController.deleteBook);
bookRouter.get('/:id/availability', BookController.checkBookAvailability);
bookRouter.get('/count/total', BookController.getBookCount);
bookRouter.get('/count/available', BookController.getAvailableBookCount);

export default bookRouter;
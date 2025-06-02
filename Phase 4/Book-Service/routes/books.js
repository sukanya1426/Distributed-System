import express from 'express';
import BookController from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.post('/', BookController.addBook);
bookRouter.get('/', BookController.searchBooks);
bookRouter.get('/:id', BookController.getBook);
bookRouter.put('/:id', BookController.updateBook);
bookRouter.patch('/:id/availability', BookController.updateAvailability);
bookRouter.delete('/:id', BookController.deleteBook);

export default bookRouter;
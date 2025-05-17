import express from 'express';
import UserController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/', UserController.createUser);
userRouter.get('/:id', UserController.getUser);
userRouter.get('/active', UserController.activeUsers);

export default userRouter;
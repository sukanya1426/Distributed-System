import express from 'express';
import UserController from '../controllers/userController.js';

const userRouter = express.Router();

// Add this to handle GET /api/users (e.g., list all users)
userRouter.get('/', (req, res) => {
    res.status(200).json({ message: "User Service is running", users: [] }); // Placeholder response
    // Replace with UserController.getAllUsers if implemented
});

userRouter.post('/', UserController.createUser);
userRouter.get('/:id', UserController.getUser);
userRouter.get('/active', UserController.activeUsers);

export default userRouter;
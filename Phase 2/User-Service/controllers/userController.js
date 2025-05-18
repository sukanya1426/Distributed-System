import User from '../models/User.js';

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, role } = req.body;
      if (!name || !email || !role) {
        return res.status(400).json({ message: 'Name, email, and role are required' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const user = await User.create({
        name,
        email,
        role,
        active: true,
      });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async activeUsers(req, res) {
    try {
      const users = await User.find({ active: true });
      if (users.length === 0) {
        return res.status(404).json({ message: 'No active users found' });
      }
      res.status(200).json({ message: 'Active users fetched successfully', users });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default UserController;
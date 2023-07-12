import { RequestHandler } from 'express';
import { UserService } from './user.service';

const createNewUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;
    const result = await UserService.createUser(user);
    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      body: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createNewUser,
};
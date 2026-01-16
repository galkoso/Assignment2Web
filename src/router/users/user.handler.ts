import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from './user.model';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, displayName, bio } = req.body ?? {};

    if (!username || !email) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'username and email are required' });
      return;
    }

    const user = await User.create({
      username: String(username).trim(),
      email: String(email).trim(),
      displayName: displayName ? String(displayName).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
    });

    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', data: user });
  } catch (_error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to create user' });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ data: users });
  } catch (_error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    user
      ? res.status(StatusCodes.OK).json({ data: user })
      : res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
  } catch (_error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { username, email, displayName, bio } = req.body ?? {};

    if (!username || !email) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'username and email are required' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: String(username).trim(),
        email: String(email).trim(),
        displayName: displayName ? String(displayName).trim() : undefined,
        bio: bio ? String(bio).trim() : undefined,
      },
      { new: true, runValidators: true }
    );

    user
      ? res.status(StatusCodes.OK).json({ message: 'User updated successfully', data: user })
      : res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
  } catch (_error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    user
      ? res.status(StatusCodes.NO_CONTENT).send()
      : res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
  } catch (_error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId' });
  }
};


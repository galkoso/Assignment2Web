import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { User } from './user.model';
import { signAccessToken, signRefreshToken } from '../auth/auth.utils';
import { logInIfUser } from './user.service';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, displayName, bio, password } = req.body ?? {};

    if (!username || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'username, email and password are required' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: String(username).trim(),
      email: String(email).trim(),
      password: hashedPassword,
      displayName: displayName ? String(displayName).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
    });

    const accessToken = signAccessToken({ username });
    const refreshToken = signRefreshToken({ username });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', data: user, token: accessToken });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to create user' });
  }
};

export const logInUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const { username, password } = request.body;

    const userId = await logInIfUser(username, password);

    if (!userId) {
      response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Username or password is incorrect' });
      return;
    }

    const accessToken = signAccessToken({ username });
    const refreshToken = signRefreshToken({ username });

    response.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    response.status(StatusCodes.OK).send(accessToken);
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Login failed' });
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
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { username, email, displayName, bio } = body;

    if (!username || !email) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'username and email are required' });
      return;
    }
    const update: Record<string, unknown> = {
      username: String(username).trim(),
      email: String(email).trim(),
      displayName: displayName ? String(displayName).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
    };

    const user = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    res.status(StatusCodes.OK).json({ message: 'User updated successfully', data: user });
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


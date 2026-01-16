import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './user.handler';

const router = Router();

router.post('/', createUser);
router.get('/', authMiddleware(), getAllUsers);
router.get('/:userId', authMiddleware(), getUserById);
router.put('/:userId', authMiddleware(), updateUser);
router.delete('/:userId', authMiddleware(), deleteUser);

export default router;


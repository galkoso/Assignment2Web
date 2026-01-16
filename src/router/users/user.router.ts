import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './user.handler';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;


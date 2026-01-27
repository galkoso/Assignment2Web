import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { createUser, deleteUser, getAllUsers, getUserById, logInUser, updateUser } from './user.handler';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a user
 *     description: Creates a new user account.
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post('/', createUser);
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user and returns a JWT token.
 *     tags:
 *       - Users
 */
router.post('/login', logInUser);
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns the list of all users (requires JWT in Authorization header).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 */
router.get('/', authMiddleware(), getAllUsers);
/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by id
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Not found
 */
router.get('/:userId', authMiddleware(), getUserById);
/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: Update user by id
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Not found
 */
router.put('/:userId', authMiddleware(), updateUser);
/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user by id
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Not found
 */
router.delete('/:userId', authMiddleware(), deleteUser);

export default router;


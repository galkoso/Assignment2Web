import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import {
    createComment,
    getCommentById,
    getCommentsByPostId,
    updateComment,
    deleteComment
} from './comment.handler';

const router = Router();

/**
 * @openapi
 * /api/comments:
 *   post:
 *     summary: Create a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Missing/invalid token
 */
router.post('/', authMiddleware(), createComment);
/**
 * @openapi
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 */
router.get('/post/:postId', authMiddleware(), getCommentsByPostId);
/**
 * @openapi
 * /api/comments/{id}:
 *   get:
 *     summary: Get comment by id
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.get('/:id', authMiddleware(), getCommentById);
/**
 * @openapi
 * /api/comments/{id}:
 *   put:
 *     summary: Update comment by id
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.put('/:id', authMiddleware(), updateComment);
/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete comment by id
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.delete('/:id', authMiddleware(), deleteComment);

export default router;

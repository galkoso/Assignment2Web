import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { addPost, getAllPosts, getPostById, updatePost } from './post.handler';

const router = Router();

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     tags:
 *       - Posts
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
router.post('/', authMiddleware(), addPost);
/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 */
router.get('/', authMiddleware(), getAllPosts);
/**
 * @openapi
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post by id
 *     tags:
 *       - Posts
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
 *       404:
 *         description: Not found
 */
router.get('/:postId', authMiddleware(), getPostById);
/**
 * @openapi
 * /api/posts/{postId}:
 *   put:
 *     summary: Update post by id
 *     tags:
 *       - Posts
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Missing/invalid token
 *       404:
 *         description: Not found
 */
router.put('/:postId', authMiddleware(), updatePost);

export default router;

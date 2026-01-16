import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { addPost, getAllPosts, getPostById, updatePost } from './post.handler';

const router = Router();

router.post('/', authMiddleware(), addPost);
router.get('/', authMiddleware(), getAllPosts);
router.get('/:postId', authMiddleware(), getPostById);
router.put('/:postId', authMiddleware(), updatePost);

export default router;

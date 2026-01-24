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

router.post('/', authMiddleware(), createComment);
router.get('/post/:postId', authMiddleware(), getCommentsByPostId);
router.get('/:id', authMiddleware(), getCommentById);
router.put('/:id', authMiddleware(), updateComment);
router.delete('/:id', authMiddleware(), deleteComment);

export default router;

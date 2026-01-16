import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { Post } from './post.model';
import { IPost } from './post.schema';
import { User } from '../users/user.model';

export const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, userId, publishDate } = req.body;

        if (!title || !content || !userId) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'title, content, and userId are required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(String(userId))) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
            return;
        }

        const newPost: IPost = { title, content, userId, publishDate };
        const post = await Post.create(newPost);

        res.status(StatusCodes.CREATED).json({ message: 'Post created successfully', data: post });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create post' });
    };
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.query;
        if (userId && !mongoose.Types.ObjectId.isValid(String(userId))) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId' });
            return;
        }
        const filter = userId ? { userId } : {};
        const posts = await Post.find(filter).sort({ publishDate: -1 });

        res.status(StatusCodes.OK).json({ data: posts });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch posts' });
    };
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
            return;
        };

        res.status(StatusCodes.OK).json({ post });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch post' });
    };
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { title, content, userId, publishDate } = req.body;
        
        if (!title || !content || !userId || !publishDate) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'title, content, userId, and publishDate are required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(String(userId))) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid userId' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
            return;
        }
        
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, userId, publishDate },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
            return;
        };

        res.status(StatusCodes.OK).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update post' });
    };
};

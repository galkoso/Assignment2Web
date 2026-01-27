import { Types } from 'mongoose';

export const mockUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    displayName: 'Test User',
    bio: 'Hello world'
};

export const mockPost = {
    title: 'Test Post',
    content: 'Test content',
    publishDate: new Date('2024-01-15')
};

export const mockPostData = {
    title: 'Test Post',
    content: 'This is a test post content',
    publishDate: new Date('2024-01-15')
};

export const mockPostDataWithoutPublishDate = {
    title: 'Test Post',
    content: 'This is a test post content',
};

export const mockPostWithoutTitle = {
    content: 'This is a test post content',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithoutContent = {
    title: 'Test Post',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithoutUserId = {
    title: 'Test Post',
    content: 'This is a test post content',
    publishDate: new Date('2024-01-15')
};

export const mockPostOriginal = {
    title: 'Original Title',
    content: 'Original content',
    publishDate: new Date('2024-01-15')
};

export const mockPostUpdated = {
    title: 'Updated Title',
    content: 'Updated content',
    publishDate: new Date('2024-01-20')
};

export const mockPostUpdatedPartial = {
    title: 'Updated Title',
    content: 'Updated content',
    publishDate: new Date('2024-01-15')
};

export const mockPostUpdatedTitleOnly = {
    title: 'Updated Title'
};

export const mockPostComplete = {
    title: 'Complete Post',
    content: 'Complete content',
    publishDate: new Date('2024-01-15')
};

export const mockPostByJohn = {
    title: 'Post by John',
    content: 'Content by John',
    publishDate: new Date('2024-01-15')
};

export const mockPostByJane = {
    title: 'Post by Jane',
    content: 'Content by Jane',
    publishDate: new Date('2024-01-16')
};

export const mockPostAnotherByJohn = {
    title: 'Another Post by John',
    content: 'Another content by John',
    publishDate: new Date('2024-01-17')
};

export const mockPostOlderByJohn = {
    title: 'Older Post by John',
    content: 'Older content',
    publishDate: new Date('2024-01-10')
};

export const mockPostNewerByJohn = {
    title: 'Newer Post by John',
    content: 'Newer content',
    publishDate: new Date('2024-01-20')
};

export const mockPostWithSpaces = {
    title: 'Post by Author with Spaces',
    content: 'Content',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithId = {
    _id: new Types.ObjectId(),
    ...mockPost
};

export const mockPostMultiple = [
    {
        title: 'Post 1',
        content: 'Content 1',
        publishDate: new Date('2024-01-15')
    },
    {
        title: 'Post 2',
        content: 'Content 2',
        publishDate: new Date('2024-01-16')
    }
];

export const mockPostOlder = {
    title: 'Older Post',
    content: 'Older content',
    publishDate: new Date('2024-01-10')
};

export const mockPostNewer = {
    title: 'Newer Post',
    content: 'Newer content',
    publishDate: new Date('2024-01-20')
};

export const mockComment = {
    postId: new Types.ObjectId(),
    content: 'This is a test comment'
};

export const mockCommentWithId = {
    _id: new Types.ObjectId(),
    ...mockComment
};

export const mockCommentData = {
    postId: new Types.ObjectId().toString(),
    content: 'This is a test comment'
};

export const mockCommentOriginal = {
    postId: new Types.ObjectId(),
    content: 'Original content'
};

export const mockCommentUpdated = {
    content: 'Updated content'
};

export const mockCommentUpdatedWithSpaces = {
    content: '  Updated content with spaces  '
};

export const mockCommentMultiple = [
    {
        postId: new Types.ObjectId(),
        content: 'First comment'
    },
    {
        postId: new Types.ObjectId(),
        content: 'Second comment'
    }
];

export const mockCommentOlder = {
    postId: new Types.ObjectId(),
    content: 'Older comment',
    createdAt: new Date('2024-01-10')
};

export const mockCommentNewer = {
    postId: new Types.ObjectId(),
    content: 'Newer comment',
    createdAt: new Date('2024-01-20')
};

export const mockCommentForPost1 = {
    postId: new Types.ObjectId(),
    content: 'Comment for post 1'
};

export const mockCommentForPost2 = {
    postId: new Types.ObjectId(),
    content: 'Comment for post 2'
};

export const mockCommentToDelete = {
    postId: new Types.ObjectId(),
    content: 'Comment to delete'
};

export const mockComment1 = {
    postId: new Types.ObjectId(),
    content: 'Comment 1'
};

export const mockComment2 = {
    postId: new Types.ObjectId(),
    content: 'Comment 2'
};

export const mockInvalidPostId = '507f1f77bcf86cd799439011';
export const mockInvalidCommentId = '507f1f77bcf86cd799439011';

export const mockCommentWithoutOwner = {
    postId: new Types.ObjectId().toString(),
    content: 'This is a test comment'
};

export const mockCommentWithoutPostId = {
    content: 'This is a test comment'
};

export const mockCommentWithoutContent = {
    postId: new Types.ObjectId().toString()
};

export const mockUpdateCommentWithoutContent = {};

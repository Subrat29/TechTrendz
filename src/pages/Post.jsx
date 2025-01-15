import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { CodeBlock } from '@/components';
import { useToast } from "@/hooks/use-toast";
import configservice from '../appwrite/config';
import fileservice from '../appwrite/fileConfig';
import { deletePost as deletePostFromStore } from '../feature/postSlice';
import { deleteImage } from '../feature/imageSlice';

const parseOptions = {
    replace: (node) => {
        if (node.name === 'pre' && node.children && node.children[0].name === 'code') {
            const className = node.children[0].attribs.class || '';
            const language = className.split('-')[1] || 'text';
            const codeContent = node.children[0].children[0].data;
            return <CodeBlock language={language} value={codeContent} />;
        }
    }
};

function Post() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [readingTime, setReadingTime] = useState('');

    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const userData = useSelector((state) => state.auth.userData);
    const allImages = useSelector((state) => state.images.images);
    const allPosts = useSelector((state) => state.posts.posts);

    const isAuthor = useMemo(() =>
        post && userData ? (post.userId === userData.$id) : false,
        [post, userData]
    );

    useEffect(() => {
        if (!allPosts || !slug) return;

        const currentPost = allPosts.find((post) => post.$id === slug);
        if (!currentPost) {
            navigate('/');
            return;
        }

        setPost(currentPost);

        const currentImage = allImages.find((image) => currentPost.image === image.imageId);
        if (currentImage) {
            setImageUrl(currentImage.imageUrl);
        }

        const words = currentPost.content.split(' ').length;
        setReadingTime(`${Math.ceil(words / 200)} min read`);
    }, [allPosts, slug, navigate, allImages]);

    const deletePost = async () => {
        if (post) {
            const status = await configservice.deletePost(slug);
            if (status) {
                if (post.image) {
                    fileservice.deleteImage(post.image);
                    dispatch(deleteImage(post.image));
                }
                dispatch(deletePostFromStore(slug));
                navigate('/');
                toast({
                    title: "Post deleted successfully",
                    duration: 1500,
                });
            }
        }
    };

    if (!post) return null;

    return (
        <article className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <header className="mb-8">
                {/* Meta Information */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.$createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {readingTime}
                        </span>
                    </div>

                    {isAuthor && (
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/edit-post/${post.$id}`)}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {post.title}
                </h1>
                
                {post.subtitle && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        {post.subtitle}
                    </p>
                )}

                {/* Feature Image */}
                {imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
            </header>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {parse(post.content, parseOptions)}
            </div>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={deletePost}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </article>
    );
}

export default Post;
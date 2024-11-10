import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    Edit2,
    Bookmark,
    Share2,
    MessageCircle,
    Heart,
    Trash2,
    ChevronUp,
    Twitter,
    Facebook,
    Linkedin,
    Copy,
} from 'lucide-react';
import { CodeBlock } from '@/components';
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

const sharingPlatforms = [
    { name: 'Twitter', icon: Twitter },
    { name: 'Facebook', icon: Facebook },
    { name: 'LinkedIn', icon: Linkedin },
];

// Extracted reusable component for Author Info
const AuthorInfo = ({ author, createdAt, readingTime, isAuthor }) => (
    <motion.div
        className="flex items-center space-x-4"
        whileHover={{ scale: 1.02 }}
    >
        <div className="relative">
            {/* Avatar Placeholder */}
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 p-0.5">
                <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
                        {author?.[0] || 'A'}
                    </span>
                </div>
            </div>
            {isAuthor && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            )}
        </div>
        <div>
            <h3 className="text-lg font-semibold">{author || 'Anonymous'}</h3>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{readingTime}</span>
                </div>
            </div>
        </div>
    </motion.div>
);

const ShareMenu = ({ isOpen, onClose, onShare, onCopy }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden"
            >
                <div className="p-2 space-y-1">
                    {sharingPlatforms.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => onShare(name)}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <Icon className="w-4 h-4" />
                            <span>{name}</span>
                        </button>
                    ))}
                    <Separator className="my-1" />
                    <button
                        onClick={onCopy}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const EngagementButton = ({ icon: Icon, count, isActive, onClick, tooltip, activeColor = "text-violet-500" }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClick}
                    className={`flex items-center space-x-1 ${isActive ? activeColor : 'text-gray-500'}`}
                >
                    <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                    {count !== undefined && <span className="font-medium">{count}</span>}
                </motion.button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const Post = () => {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [readingTime, setReadingTime] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

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

    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        setScrollProgress(progress);
        setShowScrollToTop(scrolled > 300);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!allPosts || !slug) return;

        const currentPost = allPosts.find((post) => post.$id === slug);
        if (!currentPost) {
            navigate('/');
            return;
        }

        setPost(currentPost);
        setLikeCount(Math.floor(Math.random() * 100) + 1);

        const currentImage = allImages.find((image) => currentPost.image === image.imageId);
        if (currentImage) {
            setImageUrl(currentImage.imageUrl);
        }

        const words = currentPost.content.split(' ').length;
        setReadingTime(`${Math.ceil(words / 200)} min read`);
    }, [allPosts, slug, navigate, allImages]);

    const handleLike = useCallback(() => {
        setIsLiked(prev => !prev);
        setLikeCount(prev => prev + (isLiked ? -1 : 1));
        toast({
            title: isLiked ? "Removed from likes" : "Added to likes",
            duration: 1500,
        });
    }, [isLiked, toast]);

    const handleBookmark = useCallback(() => {
        setIsBookmarked(prev => !prev);
        toast({
            title: isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks",
            duration: 1500,
        });
    }, [isBookmarked, toast]);

    const handleShare = useCallback((platform) => {
        toast({
            title: `Shared on ${platform}`,
            duration: 1500,
        });
        setShowShareMenu(false);
    }, [toast]);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link copied to clipboard",
            duration: 1500,
        });
        setShowShareMenu(false);
    }, [toast]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const deletePost = async () => {
        console.log('deletePost');
        if (post) {
            const status = await configservice.deletePost(slug);
            if (status) {
                if (post.image) {
                    fileservice.deleteImage(post.image);
                    dispatch(deleteImage(post.image));
                }
                dispatch(deletePostFromStore(slug));
                navigate('/');
            }
        }
    };

    if (!post) return null;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-violet-500 origin-left z-50"
                style={{ scaleX: scrollProgress / 100 }}
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Author Info & Edit, Delete buttons */}
                    <div className="flex items-center justify-between">
                        <AuthorInfo
                            author={post.author}
                            createdAt={post.$createdAt}
                            readingTime={readingTime}
                            isAuthor={isAuthor}
                        />

                        {isAuthor && (
                            <div className="flex items-center space-x-2">
                                <EngagementButton
                                    icon={Edit2}
                                    onClick={() => { navigate(`/edit-post/${post.$id}`) }}
                                    tooltip="Edit post"
                                    activeColor="text-yellow-500"
                                />
                                <EngagementButton
                                    icon={Trash2}
                                    onClick={() => setShowDeleteDialog(true)}
                                    tooltip="Delete post"
                                    activeColor="text-red-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4">
                        <motion.h1
                            className="text-5xl font-bold tracking-tight bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {post.title}
                        </motion.h1>
                        {post.subtitle && (
                            <motion.p
                                className="text-xl text-gray-600 dark:text-gray-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {post.subtitle}
                            </motion.p>
                        )}
                    </div>

                    {/* Feature Image */}
                    {imageUrl && (
                        <motion.div
                            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                                opacity: isImageLoaded ? 1 : 0,
                                scale: isImageLoaded ? 1 : 0.95
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={imageUrl}
                                alt={post.title}
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                                onLoad={() => setIsImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                    )}

                    {/* Engagement Bar */}
                    <motion.div
                        className="sticky top-4 z-40 flex items-center justify-between py-3 px-6 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center space-x-4">
                            <EngagementButton
                                icon={Heart}
                                count={likeCount}
                                isActive={isLiked}
                                onClick={handleLike}
                                tooltip={`${isLiked ? 'Unlike' : 'Like'} this post`}
                                activeColor="text-pink-500"
                            />
                            <EngagementButton
                                icon={MessageCircle}
                                count={12}
                                onClick={() => {/* Handle comments */ }}
                                tooltip="View comments"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <EngagementButton
                                icon={Bookmark}
                                isActive={isBookmarked}
                                onClick={handleBookmark}
                                tooltip={`${isBookmarked ? 'Remove from' : 'Add to'} bookmarks`}
                            />
                            <div className="relative">
                                <EngagementButton
                                    icon={Share2}
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    tooltip="Share this post"
                                />
                                <ShareMenu
                                    isOpen={showShareMenu}
                                    onClose={() => setShowShareMenu(false)}
                                    onShare={handleShare}
                                    onCopy={copyToClipboard}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Post Content */}
                    <motion.div
                        className="prose dark:prose-dark max-w-none [&>*]:break-words [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_img]:max-w-full [&_img]:h-auto [&_p]:whitespace-pre-wrap [&_code]:whitespace-pre-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="w-full">
                            {parse(post.content, parseOptions)}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-2 bg-slate-800 text-white rounded-full shadow-lg"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Delete Post Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                deletePost();
                                setShowDeleteDialog(false);
                                navigate('/');
                                toast({
                                    title: "Post deleted successfully",
                                    description: "Your post has been permanently removed.",
                                    duration: 3000,
                                });
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Post;

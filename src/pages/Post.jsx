import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import parse, { domToReact } from 'html-react-parser';
import { Button, Container, CodeBlock } from '../components/index';
import configservice from '../appwrite/config';
import fileservice from '../appwrite/fileConfig';
import { deletePost as deletePostFromStore } from '../feature/postSlice';
import { deleteImage } from '../feature/imageSlice';

function Post() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? (post.userId === userData.$id) : false;
    const dispatch = useDispatch();
    const allImages = useSelector((state) => state.images.images);
    const allPosts = useSelector((state) => state.posts.posts);

    useEffect(() => {
        if (allPosts && slug) {
            const currentPost = allPosts.find((post) => post.$id === slug);
            if (currentPost) {
                setPost(currentPost);
                const currentImage = allImages.find((image) => currentPost.image === image.imageId);
                if (currentImage) {
                    setImageUrl(currentImage.imageUrl);
                }
            }
        } else {
            navigate('/');
        }
    }, [allPosts, slug, navigate]);

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
            }
        }
    };

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

    return post ? (
        <div className="min-h-screen py-8">
            {/* <Container> */}
                <div className="w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-4xl font-bold text-center mb-4">{post.title}</h1>
                        {isAuthor && (
                            <div className="flex justify-end mb-4">
                                <Link to={`/`}>
                                    <Button bgColor="bg-green-500" className="mr-3">
                                        Save
                                    </Button>
                                </Link>
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-yellow-500" className="mr-3">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-500" onClick={deletePost}>
                                    Delete
                                </Button>
                            </div>
                        )}
                        {imageUrl && (
                            <div className="flex justify-center mb-4">
                                <img
                                    src={imageUrl}
                                    alt={post.title}
                                    className="rounded-lg w-full max-w-md object-cover"
                                />
                            </div>
                        )}
                        <div className="max-w-none">
                            <div className="prose prose-lg max-w-none">
                                {parse(post.content, parseOptions)}
                            </div>
                        </div>
                    </div>
                </div>
            {/* </Container> */}
        </div>
    ) : null;
}

export default Post;

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
        <div className="py-8">
            <Container>
                <div className="flex justify-center mb-6 relative p-2">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
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
                </div>
                <div className="flex justify-center mb-4 relative p-2">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="rounded-xl"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center ">
                    {parse(post.content, parseOptions)}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post;

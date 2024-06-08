import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Container } from '../components/index'
import { useDispatch, useSelector } from 'react-redux'
import configservice from '../appwrite/config'
import fileservice from '../appwrite/fileConfig'
import parse from "html-react-parser";
import { deletePost as deletePostFromStore } from '../feature/postSlice'
import { deleteImage } from '../feature/imageSlice'
// import 'prismjs/themes/prism-okaidia.css';



function Post() {
    const [post, setPost] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const isAuthor = post && userData ? (post.userId === userData.$id) : false
    const dispatch = useDispatch()
    const allImages = useSelector((state) => state.images.images)
    const allPosts = useSelector((state) => state.posts.posts)
    const isLightTheme = true;

    useEffect(() => {
        if (allPosts && slug) {
            const currentPost = allPosts.find((post) => post.$id === slug);
            if (currentPost) {
                setPost(currentPost);
                const currentImage = allImages.find((image) => currentPost.image === image.imageId);
                if (currentImage) {
                    setImageUrl(currentImage.imageUrl)
                }
                // fetchImageUrl(currentPost.image)
            }
        } else {
            navigate('/');
        }
    }, [allPosts, slug, navigate]);

    // useEffect(() => {
    //     if (isLightTheme) {
    //         Prism.highlightAll();
    //     } else {
    //         Prism.highlightAll({ theme: 'prism-okaidia' });
    //     }
    // }, [post, isLightTheme]);

    // const fetchImageUrl = async (image) => {
    //     const props = [
    //         600,                // width, will be resized using this value.
    //         300,                // height, ignored when 0
    //         'center',           // crop center
    //         '100',               // slight compression
    //         1,                  // border width
    //         '000000',           // border color
    //         1,                 // border radius
    //         1,                  // full opacity
    //         0,                  // no rotation
    //         '000000',           // background color
    //         'webp'               // output jpg format
    //     ]
    //     const url = await fileservice.getImagePreview(image, props)
    //     setImageUrl(url)
    // }

    const deletePost = async () => {
        if (post) {
            const status = await configservice.deletePost(slug)
            if (status) {
                if (post.image) {
                    fileservice.deleteImage(post.image)
                    dispatch(deleteImage(post.image))
                }
                dispatch(deletePostFromStore(slug))
                navigate('/')
            }
        }
    }

    return post ? (
        <div className="py-8">
            <Container>
                {/* <div className="flex justify-center w-full mb-6"> */}
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

                <div className="flex justify-center ">
                    {parse(post.content)}
                </div>
                <div className="flex justify-center ">
                {/* {highlightedCode} */}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post

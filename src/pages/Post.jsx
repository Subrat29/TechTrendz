import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Container } from '../components/index'
import { useDispatch, useSelector } from 'react-redux'
import configservice from '../appwrite/config'
import fileservice from '../appwrite/fileConfig'
import parse from "html-react-parser";
import { deletePost } from '../feature/postSlice'

function Post() {
    const [post, setPost] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const isAuthor = post && userData ? (post.userId === userData.$id) : false
    const dispatch = useDispatch()

    console.log("SLUG: ", slug);

    const allPosts = useSelector((state) => state.posts.posts)
    useEffect(() => {
        if (allPosts && slug) {
            const currentPost = allPosts.find((post) => post.$id === slug);
            if (currentPost) {
                setPost(currentPost);
                fetchImageUrl(currentPost.image)
            }
        } else {
            navigate('/');
        }
    }, [allPosts, slug, navigate]);

    // useEffect(() => {
    //     if (slug) {
    //         configservice.getPost(slug).then((post) => {
    //             if (post) {
    //                 setPost(post)
    //                 fetchImageUrl(post.image)
    //             }
    //             else {
    //                 navigate('/')
    //             }
    //         })
    //     }
    //     else {
    //         navigate('/')
    //     }
    // }, [slug, navigate])

    const fetchImageUrl = async (image) => {
        const props = [
            600,                // width, will be resized using this value.
            300,                // height, ignored when 0
            'center',           // crop center
            '100',               // slight compression
            1,                  // border width
            '000000',           // border color
            1,                 // border radius
            1,                  // full opacity
            0,                  // no rotation
            '000000',           // background color
            'webp'               // output jpg format
        ]
        const url = await fileservice.getImagePreview(image, props)
        setImageUrl(url)
    }

    const deletePost = () => {
        if (post) {
            configservice.deletePost(slug).then((status) => {
                if (status) {
                    fileservice.deleteImage(post.image)
                    dispatch(deletePost(slug))
                    navigate('/')
                }
            })
        }
    }

    return post ? (
        <div className="py-8">
            <Container>
                <div className="flex justify-center mb-4 relative p-2">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="rounded-xl"
                        />
                    )}

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
                <div className="flex justify-center w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="flex justify-center browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post

import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Container } from '../components/index'
import { useSelector } from 'react-redux'
import configservice from '../appwrite/config'
import fileservice from '../appwrite/fileConfig'
import parse from "html-react-parser";

function Post() {
    const [post, setPost] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const isAuthor = post && userData ? (post.userId === userData.$id) : false

    
    useEffect(() => {
        if (slug) {
            configservice.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                    fetchImageUrl(post.image)
                }
                else {
                    navigate('/')
                }
            })
        }
        else {
            navigate('/')
        }
    }, [slug, navigate])

    const fetchImageUrl = async (image) => {
        const url = await fileservice.getImagePreview(image)
        setImageUrl(url)
    }

    const deletePost = () => {
        if (post) {
            configservice.deletePost(slug).then((status) => {  //replace: slug to post.$id
                if (status) {
                    fileservice.deleteImage(post.image)
                    navigate('/')
                }
            })
        }
    }

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
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
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post

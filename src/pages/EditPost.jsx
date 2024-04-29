import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components/index'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    const allPosts = useSelector((state) => state?.posts?.posts)
    useEffect(() => {
        if (allPosts && slug) {
            const filteredPost = allPosts.find((post) => post?.$id === slug);
            if (filteredPost) {
                setPost(filteredPost);
            }
        } else {
            navigate('/');
        }
    }, [allPosts, slug, navigate]);

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost

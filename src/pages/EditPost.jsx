import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components/index'
import configservice from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    console.log('EditPost/slug: ', slug);
    console.log('EditPost/post: ', post);

    useEffect(() => {
        if (slug) {
            configservice.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        }
        else {
            navigate('/')
        }
    }, [slug, navigate])

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost

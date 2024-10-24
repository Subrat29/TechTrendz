import React from 'react'
import { Container, PostForm } from '../components/index'

function AddPost() {
    return (
        <div className='py-8 min-h-screen'>
            <div className='w-full max-w-7xl mx-auto px-4'>
                <PostForm />
            </div>
        </div>
    )
}

export default AddPost

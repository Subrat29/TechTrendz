import React, { useEffect, useState } from 'react'
import fileservice from "../appwrite/fileConfig"
import { Link } from 'react-router-dom'

function PostCard({ post }) {
    const { $id, title, image, userId, $updatedAt } = post;
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        const fetchImageUrl = async () => {
            const url = await fileservice.getImagePreview(image)
            setImageUrl(url)
        }
        fetchImageUrl()
    }, [image])

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4'>
                <div className='w-full justify-center mb-4'>
                    {imageUrl && (
                        <img src={imageUrl} alt={title} className='rounded-xl' />
                    )}
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
                <p>Author: {userId}</p>
                <p>Last Update: {$updatedAt}</p>
            </div>
        </Link>
    )
}

export default PostCard

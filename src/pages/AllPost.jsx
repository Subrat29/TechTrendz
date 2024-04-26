import React, { useEffect, useState } from 'react'
import { Container, PostCard2 } from '../components/index'
import configservice from '../appwrite/config'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'

function AllPost() {
    const { $id } = useSelector((state) => state.auth.userData)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        configservice.getPosts([Query.equal("userId", `${$id}`)]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                You have no post to see.
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            {posts.map((post) => (
                <div key={post.$id} className='p-2'>
                    <PostCard2 post={post} />
                </div>
            ))}
        </div>
    )
}

export default AllPost

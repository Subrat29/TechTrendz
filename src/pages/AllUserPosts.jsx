import React, { useMemo, useEffect, useState } from 'react'
import { Container, PostCard2 } from '../components/index'
import { useSelector } from 'react-redux'

function AllUserPosts() {
    const userData = useSelector((state) => state?.auth?.userData) || null
    const allPosts = useSelector((state) => state?.posts?.posts) || null
    const [posts, setPosts] = useState([])
    const [id, setId] = useState(null)

    useEffect(() => {
        if (userData) {
            setId(userData.$id)
        }
    }, [userData, id])


    useMemo(() => {
        if (id && allPosts) {
            const userPosts = allPosts?.filter((post) => (post?.userId === id))
            setPosts(userPosts)
        }
    }, [allPosts, id, userData]);

    if (posts?.length === 0) {
        return (
            <div className="w-full min-h-screen py-8 mt-4 text-center">
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
        <div className="w-full min-h-screen py-8">
            <Container>
                <div className="grid grid-cols-1 gap-4">
                    {posts?.map((post) => (
                        <PostCard2 key={post?.$id} post={post} />
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllUserPosts

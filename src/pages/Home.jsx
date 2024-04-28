import React from 'react'
import { Container, PostCard2 } from '../components/index'
import { useSelector } from 'react-redux'

function Home() {
    const allPosts = useSelector((state) => state?.posts?.posts)

    if (allPosts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                No Posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            {allPosts.map((post) => (
                <div key={post.$id} className='p-2'>
                    <PostCard2 post={post} />
                </div>
            ))}
        </div>
    )
}

export default Home

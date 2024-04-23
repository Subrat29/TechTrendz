import React, { useEffect, useState } from 'react'
import { Container, PostCard2 } from '../components/index'
import configservice from '../appwrite/config'

function AllPost() {

    const [posts, setPosts] = useState([])
    useEffect(() => {
        configservice.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return (
        <div className='w-full py-8'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2'>
                        <PostCard2 post={post} />
                    </div>
                ))}
        </div>

        // <div className='w-full py-8'>
        //     <Container>
        //         <div className='flex flex-wrap'>
        //             {posts.map((post) => (
        //                 <div key={post.$id} className='p-2 w-1/4'>
        //                     <PostCard post={post} />
        //                 </div>
        //             ))}
        //         </div>
        //     </Container>
        // </div>
    )
}

export default AllPost

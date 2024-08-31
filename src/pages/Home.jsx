import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from '../components/Container';
import PostCard2 from '../components/PostCard2';

function Home() {
    const allPosts = useSelector((state) => state?.posts?.posts);
    const [posts, setPosts] = useState([]);

    useMemo(() => {
        if (allPosts) {
            setPosts(allPosts);
        }
    }, [allPosts]);

    if (posts?.length === 0) {
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
        );
    }

    return (
        <div className="w-full py-8">
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

export default Home;

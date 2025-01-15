import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, PostCard } from '../components/index'

function Home() {
    const allPosts = useSelector((state) => state?.posts?.posts) || null;
    const [posts, setPosts] = useState([]);

    useMemo(() => {
        if (allPosts) {
            setPosts(allPosts);
        }
    }, [allPosts]);


    if (posts.length === 0) {
        return (
            <div className="w-full min-h-screen py-8 mt-4 flex items-center justify-center">
                <Container>
                    <div className="flex flex-col items-center text-gray-700">
                        <div className="mb-4 animate-pulse">
                            {/* SVG Illustration */}
                            <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4V20H20V8L16 4H4Z" fill="#E5E7EB" />
                                <path d="M16 4V8H20" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 13H7" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M17 17H7" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold hover:text-gray-500 transition duration-200 ease-in-out">
                            No posts to display
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Looks like you haven’t created any posts yet.
                        </p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-8">
            <Container>
                <div className="grid grid-cols-1 gap-4">
                    {posts?.map((post) => (
                        <PostCard key={post?.$id} post={post} />
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;

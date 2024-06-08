import React, { useEffect, useState } from 'react'
import authservice from './appwrite/auth'
import configservice from './appwrite/config'
import { Query } from 'appwrite'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './feature/authSlice'
import { addPost } from './feature/postSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components/index'
import { addImage } from './feature/imageSlice'
import fileservice from './appwrite/fileConfig'
// import 'prismjs/themes/prism.css';


function App() {
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const dispatch = useDispatch()
  const allPosts = useSelector((state) => state?.posts?.posts) || []

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await authservice.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log("App.jsx/getCurrentUser :: error :: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (allPosts.length > 0) {
        setPostsLoading(false);
        return;
      }
      try {
        const posts = await configservice.getPosts([Query.equal("status", "active")])
        if (posts?.documents) {
          const allPosts = posts.documents
          for (const post of allPosts) {
            dispatch(addPost(post))
            if (post.image) {
              const imageUrl = await fetchImageUrl(post.image)
              dispatch(addImage({ imageId: post.image, imageUrl: imageUrl.toString() }));
            }
          }
        }
      } catch (error) {
        console.log("App.jsx/getPosts :: error :: ", error);
      } finally {
        setPostsLoading(false);
      }
    }

    fetchPosts()
  }, [dispatch, allPosts.length])

  const fetchImageUrl = async (image) => {
    const props = [
      600,
      300,
      'center',
      '100',
      1,
      '000000',
      1,
      1,
      0,
      '000000',
      'webp'
    ];
    const url = await fileservice.getImagePreview(image, props)
    return url
  };

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between' >
      <div className='w-full block'>
        <Header />
        <main>
          {postsLoading ? (
            <div className='text-5xl flex items-center justify-center w-full'>Loading posts...</div>
          ) : (
            <Outlet />
          )}
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <h2 className='text-5xl flex items-center justify-center w-full'>Loading...</h2>
      </div>
    </div>
  )
}

export default App

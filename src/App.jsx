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

// Import the ThemeProvider
import { ThemeProvider } from './components/theme/theme-provider'

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

  // Custom Loading Spinner component with darker theme
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  )

  return !loading ? (
    // Wrapping the entire component tree with ThemeProvider
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='min-h-screen flex flex-wrap content-between' >
        <div className='w-full block'>
          <Header />
          <main>
            {postsLoading ? (
              <div className="flex items-center justify-center h-full min-h-[50vh]">
                <LoadingSpinner />
              </div>
            ) : (
              <Outlet />
            )}
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <LoadingSpinner />
    </div>
  )
}

export default App

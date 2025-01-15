import React, { useEffect, useState } from 'react'
import authservice from './appwrite/auth'
import configservice from './appwrite/config'
import fileservice from './appwrite/fileConfig'
import { Query } from 'appwrite'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './feature/authSlice'
import { addPost } from './feature/postSlice'
import { addImage } from './feature/imageSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components/index'
import { ThemeProvider } from './components/theme/theme-provider'

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-gray-400 text-sm">Loading...</p>
  </div>
)

function App() {
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const dispatch = useDispatch()
  const allPosts = useSelector((state) => state?.posts?.posts) || []

  const fetchImageUrl = async (image) => {
    const props = [600, 300, 'center', '100', 1, '000000', 1, 1, 0, '000000', 'webp']
    return await fileservice.getImagePreview(image, props)
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await authservice.getCurrentUser()
        userData ? dispatch(login({ userData })) : dispatch(logout())
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCurrentUser()
  }, [dispatch])

  useEffect(() => {
    const fetchPosts = async () => {
      if (allPosts.length > 0) {
        setPostsLoading(false)
        return
      }

      try {
        const posts = await configservice.getPosts([Query.equal("status", "active")])
        if (posts?.documents) {
          for (const post of posts.documents) {
            dispatch(addPost(post))
            if (post.image) {
              const imageUrl = await fetchImageUrl(post.image)
              dispatch(addImage({ imageId: post.image, imageUrl: imageUrl.toString() }))
            }
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setPostsLoading(false)
      }
    }
    fetchPosts()
  }, [dispatch, allPosts.length])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-white">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {postsLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto ">
              <Outlet />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
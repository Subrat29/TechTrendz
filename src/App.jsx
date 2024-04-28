import React, { useEffect, useState } from 'react'
import authservice from './appwrite/auth'
import configservice from './appwrite/config'
import { Query } from 'appwrite'
import { useDispatch } from 'react-redux'
import { login, logout } from './feature/authSlice'
import { addPost } from './feature/postSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components/index'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authservice.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      }).catch((userData) => {
        console.log("App.jsx/getCurrentUser :: error :: ", userData);
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    configservice.getPosts([Query.equal("status", "active")]).then((posts) => {
      if (posts) {
        console.log("post coming from getPost: ", posts.documents);
        var allPosts = posts.documents
        allPosts.map((post) =>
          dispatch(addPost(post))
        )
      }
    }).catch((posts) => {
      console.log("App.jsx/getPosts :: error :: ", posts);
    })
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between' >
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <h1 className='text-5xl flex items-center justify-center w-full'>Loading...</h1>
      </div>
    </div>
  )
}

export default App

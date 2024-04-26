import React, { useEffect, useState } from 'react'
import authservice from './appwrite/auth'
import { useDispatch } from 'react-redux'
import { login, logout } from './feature/authSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components/index'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authservice.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(({ userData }))
        } else {
          dispatch(logout())
        }
      }).catch((userData) => {
        console.log("App.jsx/getCurrentUser :: error :: ", userData);
      }).finally(() => {
        setLoading(false)
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

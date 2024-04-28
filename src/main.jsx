import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AddPost, AllPost, EditPost, Home, Login, Post, Signup } from './pages/index'
import { AuthLayout } from './components/index'
import { ChakraProvider } from '@chakra-ui/react'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>} />
      <Route path='/signup' element={
        <AuthLayout authentication={false}>
          <Signup />
        </AuthLayout>
      } />
      <Route path='/allposts' element={
        <AuthLayout authentication>
          <AllPost />
        </AuthLayout>
      } />
      <Route path='/addpost' element={
        <AuthLayout authentication>
          < AddPost />
        </AuthLayout>
      } />
      <Route path='/edit-post/:slug' element={
        <AuthLayout authentication>
          < EditPost />
        </AuthLayout>
      } />
      <Route path='/post/:slug' element={
        <Post />
      } />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </Provider>
)

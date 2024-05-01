import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../feature/authSlice'
import postSlice from '../feature/postSlice'
import imageSlice from '../feature/imageSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postSlice,
        images: imageSlice
    }
})
export default store
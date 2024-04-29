import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    loading: true,
    error: null,
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.loading = false
            state.posts.push(action.payload);
        },
        updatePost: (state, action) => {
            const updatedPost = action.payload
            const index = state.posts.findIndex(post => post.$id === updatedPost.$id);
            if (index !== -1) {
                state.posts[index] = updatedPost;
            }
        },
        deletePost: (state, action) => {
            const postId = action.payload.id;
            state.posts = state.posts.filter(post => post.id !== postId);
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { addPost, updatePost, deletePost, setError } = postSlice.actions
export default postSlice.reducer

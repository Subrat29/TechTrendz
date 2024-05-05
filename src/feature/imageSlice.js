import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    images: [
        // {
        //     imageId: 'n/a',
        //     imageUrl: 'n/a'
        // }
    ]
}

const imageSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        addImage: (state, action) => {
            const newImage = { imageId: action.payload.imageId, imageUrl: action.payload.imageUrl }
            state.images.push(newImage)
        },
        deleteImage: (state, action) => {
            const deleteImageId = action.payload
            const updatedImages = state.images.filter((image) => image.imageId !== deleteImageId)
            state.images = updatedImages
        }
    }
})

export const { addImage, deleteImage } = imageSlice.actions
export default imageSlice.reducer
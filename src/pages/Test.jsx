// import React, { useCallback, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Button, Input, RTE, Select } from "..";
// import configservice from '../../appwrite/config';
// import fileservice from '../../appwrite/fileConfig';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { addPost, updatePost } from '../../feature/postSlice';
// import { addImage, deleteImage } from '../../feature/imageSlice';

// function PostForm({ post }) {
//     const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
//         defaultValues: {
//             title: post?.title || "",
//             slug: post?.$id || "",
//             content: post?.content || "No content",
//             status: post?.status || "active",
//         }
//     });

//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.auth.userData);
//     const [imageUrl, setImageUrl] = useState(null);
//     const dispatch = useDispatch();

//     const submit = async (data) => {
//         // update post
//         if (post) {
//             console.log("Update Post");
//             const newImage = data.image[0] ? await fileservice.uploadImage(data.image[0]) : null;
//             if (newImage) {
//                 const newImageUrl = await fetchImageUrl(newImage.$id);
//                 if (post.image) {
//                     fileservice.deleteImage(post.image);
//                     dispatch(deleteImage(post.image));
//                 }
//                 dispatch(addImage({ imageId: newImage.$id, imageUrl: newImageUrl.toString() }));
//             }

//             const finalImage = newImage ? newImage.$id : post.image;
//             const dbPost = await configservice.updatePost(post.$id, {
//                 ...data,
//                 image: finalImage
//             });
//             if (dbPost) {
//                 dispatch(updatePost(dbPost));
//                 navigate(`/post/${dbPost.$id}`);
//             }
//         } else {
//             // create post
//             console.log("Create Post");
//             const newImage = data.image[0] ? await fileservice.uploadImage(data.image[0]) : null;
//             const newImageId = newImage?.$id || null;
//             if (newImageId) {
//                 const newImageUrl = await fetchImageUrl(newImageId);
//                 dispatch(addImage({ imageId: newImageId, imageUrl: newImageUrl.toString() }));
//             }
//             data.image = newImageId;
//             const dbPost = await configservice.createPost({
//                 ...data,
//                 userId: userData.$id ? userData.$id : null
//             });
//             if (dbPost) {
//                 dispatch(addPost(dbPost));
//                 navigate(`/post/${dbPost.$id}`);
//             }
//         }
//     };

//     const slugTransform = useCallback((value) => {
//         if (value && typeof value === 'string') {
//             const slug = value.toLowerCase().replace(/ /g, '-');
//             setValue('slug', slug);
//             return slug;
//         }
//         return '';
//     });

//     React.useEffect(() => {
//         const subscription = watch((value, { name }) => {
//             if (name === 'title') {
//                 setValue('slug', slugTransform(value.title, { shouldValidate: true }));
//             }
//         });
//         return () => {
//             subscription.unsubscribe();
//         };
//     }, [watch, slugTransform, setValue]);

//     const fetchImageUrl = async (image) => {
//         const props = [
//             600,
//             300,
//             'center',
//             '100',
//             1,
//             '000000',
//             1,
//             1,
//             0,
//             '000000',
//             'webp'
//         ];
//         const url = await fileservice.getImagePreview(image, props);
//         setImageUrl(url);
//         return url;
//     };

//     if (post && post.image) {
//         fetchImageUrl(post.image);
//     }

//     return (
//         <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
//             <div className="w-full lg:w-2/3 px-2 mb-4">
//                 <Input
//                     label="Title :"
//                     placeholder="Enter the title"
//                     className="mb-4"
//                     {...register("title", { required: true })}
//                 />
//                 <Input
//                     label="Slug :"
//                     placeholder="Generated slug"
//                     className="mb-4"
//                     {...register("slug", { required: true })}
//                     onInput={(e) => {
//                         setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
//                     }}
//                 />
//                 <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
//             </div>
//             <div className="w-full lg:w-1/3 px-2 mb-4">
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Image :</label>
//                     <Input
//                         type="file"
//                         className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//                         accept="image/png, image/jpg, image/jpeg, image/gif"
//                         {...register("image", { required: false })}
//                     />
//                 </div>
//                 {post && (
//                     <div className="w-full mb-4">
//                         <img
//                             src={imageUrl || 'n/a'}
//                             alt={post.title}
//                             className="rounded-lg w-full h-auto"
//                         />
//                     </div>
//                 )}
//                 <Select
//                     options={["active", "inactive"]}
//                     label="Status :"
//                     className="mb-4"
//                     {...register("status", { required: true })}
//                 />
//                 <Button
//                     type="submit"
//                     className={`w-full py-2 ${post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg`}
//                 >
//                     {post ? "Update Post" : "Publish Post"}
//                 </Button>
//             </div>
//         </form>
//     );
// }

// export default PostForm;

import React from 'react'

export default function Test() {
  return (
    <div>Test</div>
  )
}

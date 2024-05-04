// import React, { useEffect, useState } from 'react'
// import authservice from './appwrite/auth'
// import configservice from './appwrite/config'
// import { Query } from 'appwrite'
// import { useDispatch } from 'react-redux'
// import { login, logout } from './feature/authSlice'
// import { addPost } from './feature/postSlice'
// import { Outlet } from 'react-router-dom'
// import { Header, Footer } from './components/index'
// import { addImage } from './feature/imageSlice'
// import fileservice from './appwrite/fileConfig'

// function App() {
//   const [loading, setLoading] = useState(true)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     authservice.getCurrentUser()
//       .then((userData) => {
//         if (userData) {
//           dispatch(login({ userData }))
//         } else {
//           dispatch(logout())
//         }
//       }).catch((error) => {
//         console.log("App.jsx/getCurrentUser :: error :: ", error);
//       }).finally(() => {
//         setLoading(false)
//       })
//   }, [])

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const posts = await configservice.getPosts([Query.equal("status", "active")]);
//         if (posts && posts.documents) {
//           const allPosts = posts.documents;
//           for (const post of allPosts) {
//             const imageUrl = await fetchImageUrl(post.image);
//             dispatch(addPost(post));
//             // Inside your fetchPosts useEffect
//             dispatch(addImage({ imageId: post.image, imageUrl: imageUrl.toString() }));

//           }
//         }
//       } catch (error) {
//         console.log("App.jsx/getPosts :: error :: ", error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const fetchImageUrl = async (image) => {
//     const props = [
//       600,
//       300,
//       'center',
//       '100',
//       1,
//       '000000',
//       1,
//       1,
//       0,
//       '000000',
//       'webp'
//     ];
//     const url = await fileservice.getImagePreview(image, props);
//     return url; // Return the URL directly
//   };

//   return !loading ? (
//     <div className='min-h-screen flex flex-wrap content-between'>
//       <div className='w-full block'>
//         <Header />
//         <main>
//           <Outlet />
//         </main>
//         <Footer />
//       </div>
//     </div>
//   ) : (
//     <div className='min-h-screen flex flex-wrap content-between'>
//       <div className='w-full block'>
//         <h1 className='text-5xl flex items-center justify-center w-full'>Loading...</h1>
//       </div>
//     </div>
//   );
// }

// export default App;

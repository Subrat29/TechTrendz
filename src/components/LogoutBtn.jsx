import React from 'react'
import authService from '../appwrite/auth'
import { logout } from '../feature/authSlice'
import { useDispatch } from 'react-redux'

function LogoutBtn() {
    const dispatch = useDispatch()
    const onclickHandler = () => {
        authService.logOut()
            .then(() => { dispatch(logout()) })
            .catch((error) => { console.log("components/LogoutBtn/error : ", error); })
    }
    return (
        <button
            className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
            onClick={onclickHandler}
        >Logout</button>
    )
}

export default LogoutBtn

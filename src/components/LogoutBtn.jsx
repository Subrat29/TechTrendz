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
            onClick={onclickHandler}
        >
            Logout
        </button>
    )
}

export default LogoutBtn

import React from 'react'
import authService from '../appwrite/auth'
import { logout } from '../feature/authSlice'
import { useDispatch } from 'react-redux'
import { Button } from '../components/index'

function LogoutBtn({ className }) {
    const dispatch = useDispatch()
    const onclickHandler = () => {
        authService.logOut()
            .then(() => { dispatch(logout()) })
            .catch((error) => { console.log("components/LogoutBtn/error : ", error); })
    }
    return (
        <Button
            onClick={onclickHandler}
            variant='destructive'
            className={className}
        >
            Logout
        </Button>
    )
}

export default LogoutBtn

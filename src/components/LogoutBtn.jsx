import React from 'react'
import authService from '../appwrite/auth'
import { logout } from '../feature/authSlice'
import { useDispatch } from 'react-redux'
import { Button } from '@chakra-ui/react';

function LogoutBtn() {
    const dispatch = useDispatch()
    const onclickHandler = () => {
        authService.logOut()
            .then(() => { dispatch(logout()) })
            .catch((error) => { console.log("components/LogoutBtn/error : ", error); })
    }
    return (
        <Button
            variant='ghost'
            onClick={onclickHandler}
            mx={2}
        >
            Logout
        </Button>
    )
}

export default LogoutBtn

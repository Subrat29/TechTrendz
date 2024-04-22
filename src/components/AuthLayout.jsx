import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({ authentication = true, children }) {
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    useEffect(() => {
        if (authentication && authStatus !== authentication)
            navigate('/login')
        else if (!authentication && authStatus !== authentication)
            navigate('/')
        setLoader(false)
    }, [authentication, authStatus, navigate])

    return loader ? <div>AuthLayout Loading...</div> : <div>{children}</div>
}

export default AuthLayout

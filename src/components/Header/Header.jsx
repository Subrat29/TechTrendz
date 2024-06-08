import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Logo, LogoutBtn } from '../index'

function Header() {
    const authStatus = useSelector((state) => state.auth.status) || false
    const authUserData = useSelector((state) => state.auth.userData) || {}
    const [user, setUser] = useState('Guest')
    const navigate = useNavigate()
    
    console.log("Header/authstatus: ", authStatus)

    useEffect(() => {
        if (authStatus && authUserData?.name) {
            setUser(authUserData.name)
        }
        else {
            setUser('Guest')
        }
    }, [authUserData, authStatus])

    const navItems = [
        {
            name: 'Home',
            url: '/',
            active: true
        },
        {
            name: 'Login',
            url: '/login',
            active: !authStatus
        },
        {
            name: 'Signup',
            url: '/signup',
            active: !authStatus
        },
        {
            name: 'Your Posts',
            url: '/alluserposts',
            active: authStatus
        },
        {
            name: 'Write',
            url: '/addpost',
            active: authStatus
        }
    ]
    return (
        <header className='py-3'>
            <Container>
                <nav className='flex'>
                    <div className='mr-4'>
                        <Link to='/'>
                            <Logo width='70px' />
                        </Link>
                    </div>
                    <ul className='flex ml-auto'>
                        {navItems.map((item) => item.active ? (
                            <li key={item.name}>
                                <button
                                    className='inline-bock px-6 py-2 duration-200'
                                    onClick={() => navigate(item.url)}
                                >{item.name}</button>
                            </li>
                        ) : (null))}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                    <div className="bg-blue-500 rounded p-1 shadow-md">
                        <span className="text-white text-lg font-semibold">User: {user}</span>
                    </div>
                </nav>
            </Container>
        </header>
    )
}

export default Header

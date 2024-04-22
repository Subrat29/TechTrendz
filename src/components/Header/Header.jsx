import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Logo, LogoutBtn } from '../index'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const authUserData = useSelector((state) => state.auth.userData)
    const userName = authUserData?.name || 'N/A'
    const navigate = useNavigate()
    console.log("Header/authstatus: ", authStatus)
    // console.log("Header/authUserData: ", authUserData)

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
            name: 'AllPosts',
            url: '/allposts',
            active: authStatus
        },
        {
            name: 'AddPost',
            url: '/addpost',
            active: authStatus
        }
    ]
    return (
        <header className='py-3 shadow bg-gray-500'>
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
                                    onClick={() => navigate(item.url)}
                                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
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
                        <span className="text-white text-lg font-semibold">User: {userName}</span>
                    </div>
                </nav>
            </Container>
        </header>
    )
}

export default Header

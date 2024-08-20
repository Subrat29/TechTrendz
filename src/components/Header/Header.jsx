import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';

function Header() {
    const authStatus = useSelector((state) => state.auth.status) || false;
    const authUserData = useSelector((state) => state.auth.userData) || {};
    const [user, setUser] = useState('Guest');
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isLargerThan768, setIsLargerThan768] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsLargerThan768(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (authStatus && authUserData?.name) {
            setUser(authUserData.name);
        } else {
            setUser('Guest');
        }
    }, [authUserData, authStatus]);

    const navItems = [
        { name: 'Home', url: '/', active: true },
        { name: 'Login', url: '/login', active: !authStatus },
        { name: 'Signup', url: '/signup', active: !authStatus },
        { name: 'Your Posts', url: '/alluserposts', active: authStatus },
        { name: 'Write', url: '/addpost', active: authStatus }
    ];

    const toggleDrawer = () => setIsOpen(!isOpen);

    return (
        <header className='py-3 bg-white dark:bg-gray-800'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center'>
                    <div>
                        <Link to='/'>
                            <img src='/logo.png' alt='Logo' className='w-16' />
                        </Link>
                    </div>
                    <button
                        onClick={() => document.documentElement.classList.toggle('dark')}
                        className='p-2 bg-gray-200 rounded-full dark:bg-gray-600'
                    >
                        {document.documentElement.classList.contains('dark') ? '🌞' : '🌙'}
                    </button>
                    {isLargerThan768 ? (
                        <nav className='flex items-center'>
                            {navItems.map((item) => item.active && (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.url)}
                                    className='mx-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                    {item.name}
                                </button>
                            ))}
                            {authStatus && (
                                <button
                                    onClick={() => navigate('/logout')}
                                    className='mx-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                    Logout
                                </button>
                            )}
                        </nav>
                    ) : (
                        <>
                            <Button
                                onClick={toggleDrawer}
                                // className='p-2 bg-gray-200 rounded-full dark:bg-gray-600'
                                variant='destructive'
                            >
                                Shadcn
                            </Button>
                            {isOpen && (
                                <div className='fixed inset-0 z-50'>
                                    <div className='fixed inset-0 bg-black opacity-50' onClick={toggleDrawer}></div>
                                    <div className='fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 p-4'>
                                        <button
                                            onClick={toggleDrawer}
                                            className='text-gray-700 dark:text-gray-200'
                                        >
                                            ✖
                                        </button>
                                        <div className='mt-4'>
                                            {navItems.map((item) => item.active && (
                                                <button
                                                    key={item.name}
                                                    onClick={() => {
                                                        navigate(item.url);
                                                        toggleDrawer();
                                                    }}
                                                    className='block w-full text-left py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                            {authStatus && (
                                                <button
                                                    onClick={() => {
                                                        navigate('/logout');
                                                        toggleDrawer();
                                                    }}
                                                    className='block w-full text-left py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                                >
                                                    Logout
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Logo,
    Button,
    ModeToggle,
    LogoutBtn,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/index";

function Header() {
    const authStatus = useSelector((state) => state.auth.status) || false;
    const authUserData = useSelector((state) => state.auth.userData) || {};
    const [user, setUser] = useState('Guest');
    const navigate = useNavigate();

    useEffect(() => {
        setUser(authStatus && authUserData?.name ? authUserData.name : 'Guest');
    }, [authUserData, authStatus]);

    const navItems = [
        { name: 'Home', url: '/', active: true },
        { name: 'Login', url: '/login', active: !authStatus },
        { name: 'Signup', url: '/signup', active: !authStatus },
        { name: 'Your Posts', url: '/alluserposts', active: authStatus },
        { name: 'Write', url: '/addpost', active: authStatus },
    ];

    return (
        <header className='py-3 bg-neutral-50 border-b dark:bg-neutral-900'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center'>
                    {/* Logo */}
                    <Link to='/'>
                        <Logo />
                    </Link>

                    {/* Large Screen Navigation */}
                    <nav className='hidden md:flex items-center space-x-4'>
                        {navItems.map((item) => item.active && (
                            <Button
                                key={item.name}
                                onClick={() => navigate(item.url)}
                                variant='outline'
                                className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800" // Added padding, font size, and hover effect
                            >
                                {item.name}
                            </Button>
                        ))}
                        {authStatus && (
                            <LogoutBtn
                                className="px-4 py-2 rounded-md text-sm font-medium"
                            />
                        )}
                        {/* Added margin for better alignment */}
                        <div className="ml-4">
                            <ModeToggle />
                        </div>
                    </nav>

                    {/* Mobile View Navigation */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant='outline' className="px-2 py-1 text-lg font-bold">
                                    ☰
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader className='border-b'>
                                    <SheetTitle>techTrenz</SheetTitle>
                                    <SheetDescription>
                                        {/* Explore the available options below. */}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className='mt-4'>
                                    {navItems.map((item) => item.active && (
                                        <Button
                                            key={item.name}
                                            onClick={() => {
                                                navigate(item.url);
                                            }}
                                            variant='outline'
                                            className="block w-full text-centers px-4 py-2 mt-2 text-sm font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md" // Improved mobile button layout
                                        >
                                            {item.name}
                                        </Button>
                                    ))}
                                    {authStatus && (
                                        <LogoutBtn
                                            className="block w-full text-center px-4 py-2 mt-2 text-sm font-medium" // Improved mobile button layout
                                        />
                                    )}
                                    <div className="mt-3 text-center">
                                        <ModeToggle />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

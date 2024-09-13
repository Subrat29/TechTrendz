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
        <header className="py-3 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700  transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/">
                        <Logo className="w-32 h-auto" /> {/* Adjusted size for slate theme */}
                    </Link>

                    {/* Large Screen Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => item.active && (
                            <Button
                                key={item.name}
                                onClick={() => navigate(item.url)}
                                variant="ghost"
                                className="px-4 py-2 text-sm font-semibold rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                {item.name}
                            </Button>
                        ))}
                        {authStatus && (
                            <LogoutBtn className="px-4 py-2 rounded-md text-sm font-semibold text-gray-900 dark:text-gray-200" />
                        )}
                        {/* Dark/Light Mode Toggle */}
                        <div className="ml-4">
                            <ModeToggle />
                        </div>
                    </nav>

                    {/* Mobile View Navigation */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="px-3 py-1 text-lg font-semibold"
                                >
                                    ☰
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader className="border-b border-gray-300 dark:border-gray-700">
                                    <SheetTitle>TechTrendz</SheetTitle>
                                    <SheetDescription>
                                        {/* Explore the available options below. */}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-4">
                                    {navItems.map((item) => item.active && (
                                        <Button
                                            key={item.name}
                                            onClick={() => {
                                                navigate(item.url);
                                            }}
                                            variant="ghost"
                                            className="block w-full text-center px-4 py-2 mt-2 text-sm font-semibold text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                                        >
                                            {item.name}
                                        </Button>
                                    ))}
                                    {authStatus && (
                                        <LogoutBtn className="block w-full text-center px-4 py-2 mt-2 text-sm font-semibold" />
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

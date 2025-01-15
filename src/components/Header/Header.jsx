import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    ModeToggle,
    LogoutBtn,
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/index";

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Write', url: '/addpost', protected: true },
        { name: 'Posts', url: '/alluserposts', protected: true },
        { name: 'Login', url: '/login', guest: true },
    ];

    const filteredNavItems = navItems.filter(item => 
        (item.protected && authStatus) || 
        (item.guest && !authStatus) || 
        (!item.protected && !item.guest)
    );

    return (
        <header className="py-2 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <Link to="/" className="text-lg font-semibold">
                        TechTrendz
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {filteredNavItems.map(item => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.url)}
                                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {item.name}
                            </button>
                        ))}
                        {authStatus && (
                            <LogoutBtn className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                        )}
                        <ModeToggle />
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ModeToggle />
                        <Sheet>
                            <SheetTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <nav className="flex flex-col space-y-2 mt-6">
                                    {filteredNavItems.map(item => (
                                        <SheetClose asChild key={item.name}>
                                            <button
                                                onClick={() => navigate(item.url)}
                                                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </button>
                                        </SheetClose>
                                    ))}
                                    {authStatus && (
                                        <SheetClose asChild>
                                            <LogoutBtn className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                                        </SheetClose>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
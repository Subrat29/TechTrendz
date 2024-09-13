import React from 'react';
import { Link } from 'react-router-dom';
import { Logo, Button } from '../index';

function Footer() {
    return (
        <section className="relative overflow-hidden py-12 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-t transition-colors duration-300">
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Logo and Copyright */}
                    <div className="flex flex-col justify-between">
                        <div className="mb-4">
                            <Logo width="120px" /> {/* Adjusted size */}
                        </div>
                        <div>
                            <p className="text-sm">
                                &copy; 2024 Techtrendz. All Rights Reserved.
                            </p>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Company
                        </h3>
                        <ul>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Features
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Pricing
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Affiliate Program
                                </Link>
                            </li>
                            <li>
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Press Kit
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Support
                        </h3>
                        <ul>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Account
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Help
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Customer Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legals */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Legals
                        </h3>
                        <ul>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link className="text-base font-medium hover:text-indigo-600 dark:hover:text-indigo-400" to="/">
                                    Licensing
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Back to Top Button */}
                <div className="mt-12 text-center">
                    <Button className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-2 transition-all duration-300">
                        <a href="#top" className="scroll-smooth">Back to Top</a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default Footer;

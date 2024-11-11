import React from 'react';
import { Link } from 'react-router-dom';
import { Logo, Button } from '../index';

function Footer() {
    return (
        <section className="relative overflow-hidden py-12 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-t transition-colors duration-300">
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

                    {/* Company Section */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Company
                        </h3>
                        <ul>
                            {["Features", "Pricing", "Affiliate Program", "Press Kit"].map((item, index) => (
                                <li key={index} className="mb-4 last:mb-0">
                                    <Link className="text-base font-medium hover:text-gray-600 dark:hover:text-gray-200" to="/">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Support
                        </h3>
                        <ul>
                            {["Account", "Help", "Contact Us", "Customer Support"].map((item, index) => (
                                <li key={index} className="mb-4 last:mb-0">
                                    <Link className="text-base font-medium hover:text-gray-600 dark:hover:text-gray-200" to="/">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legals Section */}
                    <div>
                        <h3 className="tracking-wide mb-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Legals
                        </h3>
                        <ul>
                            {["Terms & Conditions", "Privacy Policy", "Licensing"].map((item, index) => (
                                <li key={index} className="mb-4 last:mb-0">
                                    <Link className="text-base font-medium hover:text-gray-600 dark:hover:text-gray-200" to="/">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Back to Top Button */}
                <div className="mt-12 text-center">
                    <Button className="rounded-full bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 px-6 py-2 transition-all duration-300">
                        <a href="#top" className="scroll-smooth">Back to Top</a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default Footer;

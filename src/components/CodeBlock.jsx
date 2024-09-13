import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme, Button } from '@/components/index';

const CodeBlock = ({ language, value }) => {
    const [copy, setCopy] = useState(false);
    const { theme } = useTheme(); // Detect the current theme mode (light/dark)

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopy(true);
        setTimeout(() => setCopy(false), 2000);
    };

    return (
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow">
            {/* Header with Copy Button */}
            <div className="flex justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-xs items-center">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Example code</p>
                <Button
                    variant="outline"
                    className="text-xs px-2 py-1"
                    onClick={handleCopy}
                >
                    {copy ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <span className='w-5 mr-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" /><path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /></svg>
                            </span>
                            Copy code
                        </>
                    )}
                </Button>
            </div>

            {/* Code Display Area */}
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={'jsx'}
                    // language={language || 'jsx'}
                    style={theme === 'dark' ? tomorrow : coy} // Automatically switch theme based on mode
                    customStyle={{
                        backgroundColor: 'transparent', // Use Tailwind classes for background
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;

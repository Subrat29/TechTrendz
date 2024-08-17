import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia, coy, solarizedlight, tomorrow, twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {
    const [copy, setCopy] = useState(false);

    return (
        <div className='w-full max-w-3xl bg-[#2d3139] rounded-md overflow-hidden border'>
            <div className='flex justify-between px-4 py-2 bg-indigo-800 text-white text-xs items-center'>
                <p className='text-sm'>Example code</p>
                {copy ? (
                    <button className='py-1 inline-flex items-center gap-1 text-green-500'>
                        <span className='w-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M464 128L240 384l-96-96M144 384l-96-96M368 128L232 284" /></svg>
                        </span>
                        Copied!
                    </button>
                ) : (
                    <button
                        className='py-1 inline-flex items-center gap-1'
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                            setCopy(true);
                            setTimeout(() => setCopy(false), 2000);
                        }}
                    >
                        <span className='w-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" /><path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /></svg>
                        </span>
                        Copy code
                    </button>
                )}
            </div>
            <div className='overflow-x-auto'>
                <SyntaxHighlighter
                    // language={language || 'jsx'}
                    language='jsx'
                    style={tomorrow}
                    customStyle={{
                        padding: '20px',
                        minWidth: '100%',
                        whiteSpace: 'pre-wrap', // Ensure long lines wrap
                    }}
                    wrapLongLines={false} // Disable automatic wrapping for horizontal scroll
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;

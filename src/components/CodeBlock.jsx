import React, { useCallback, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/index';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ language = 'jsx', value }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = useCallback(() => {
    if (!value) return;
    
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [value]);

  return (
    <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Copy Button - Positioned absolutely for cleaner layout */}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-md 
                 bg-neutral-100 dark:bg-neutral-800 
                 hover:bg-neutral-200 dark:hover:bg-neutral-700
                 transition-colors duration-200
                 flex items-center gap-2 text-sm"
        aria-label={isCopied ? 'Copied!' : 'Copy code'}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isCopied ? 'Copied!' : 'Copy'}
        </span>
      </button>

      {/* Code Display */}
      <SyntaxHighlighter
        language={'jsx'}
        style={theme === 'light' ? oneLight : tomorrow}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: 'transparent',
          fontSize: '0.9rem',
        }}
        codeTagProps={{
          className: 'font-mono'
        }}
      >
        {value || ''}
      </SyntaxHighlighter>
    </div>
  );
};

export default React.memo(CodeBlock);
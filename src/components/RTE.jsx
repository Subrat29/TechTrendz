import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/components/theme/theme-provider';

export default function RTE({ name, control, label, defaultValue = "" }) {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Update the theme based on user or system preference
    if (theme === 'system') {
      setIsDarkMode(systemPrefersDark);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  // Force reinitialization of TinyMCE when isDarkMode changes by using a key
  const editorKey = isDarkMode ? 'dark' : 'light';

  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1 text-foreground'>{label}</label>}

      <Controller
        name={name || 'content'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            key={editorKey} // Changing the key will force re-rendering
            apiKey='e02s66dtd3f57qr56ln0qphcsdu5ntodllze5vw0a9tjt4tc'
            value={value || defaultValue}
            init={{
              height: 500,
              menubar: true,
              skin: isDarkMode ? 'oxide-dark' : 'oxide',
              content_css: isDarkMode ? 'dark' : 'default',
              plugins: [
                'image',
                'advlist',
                'autolink',
                'lists',
                'link',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
                'codesample'
              ],
              toolbar:
                'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | codesample | help',
              codesample_languages: [
                { text: 'JavaScript', value: 'javascript' },
                { text: 'HTML/XML', value: 'markup' },
                { text: 'CSS', value: 'css' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
              ],
              setup: (editor) => {
                editor.on('init', () => {
                  editor.setContent(value || defaultValue);
                });
              }
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}

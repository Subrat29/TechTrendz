import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';


export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey='e02s66dtd3f57qr56ln0qphcsdu5ntodllze5vw0a9tjt4tc'
                        initialValue={defaultValue}
                        init={{
                            initialValue: defaultValue,
                            height: 500,
                            menubar: true,
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                                "anchor",
                                "codesample"
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | codesample | help",
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
                            ]
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}
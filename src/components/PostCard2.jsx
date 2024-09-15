import React, { useEffect, useMemo, useState } from 'react';
import { Eye, ThumbsUp, Tag } from 'lucide-react';
import fileservice from "../appwrite/fileConfig";
import { Link } from 'react-router-dom';

// Format the date to "Aug 23, 2024"
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const PostCard2 = ({ post }) => {
    const {
        $id,
        title,
        image,
        $createdAt,
        content,
        author,
        views = 34,
        likes = 12,
        tags = ['Node.js', 'React', 'Html', 'Css']
    } = post;

    const [imageUrl, setImageUrl] = useState(null);
    const [authorDetails, setAuthorDetails] = useState(null);

    const props = useMemo(() => [
        ,                // width, reduced to fit better
        ,                // further reduced height for better balance with text
        'center',           // crop center
        '85',               // moderate compression
        0,                  // no border width
        '000000',           // border color (not used)
        0,                  // no border radius (for a clean fit)
        1,                  // full opacity
        0,                  // no rotation
        'FFFFFF',           // background color, should match your card's background
        'webp'              // output format
    ], []);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await fileservice.getImagePreview(image, props);
                setImageUrl(url);
            } catch (err) {
                console.error('Error fetching image:', err);
            }
        };
        if (image) fetchImageUrl();
    }, [image, props]);

    const formattedDate = useMemo(() => formatDate($createdAt), [$createdAt]);

    return (
        <div className="flex flex-col sm:flex-row items-start p-4 space-y-4 sm:space-y-0 sm:space-x-4 border-b md:border md:rounded-lg overflow-hidden">
            {/* Content */}
            <div className="flex-grow space-y-2">
                {/* Author and Date */}
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                            className="w-full h-full rounded-full"
                            src="https://github.com/shadcn.png"
                            alt="Author"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{authorDetails ? authorDetails.name : 'Unknown Author'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">{formattedDate}</p>
                    </div>
                </div>

                {/* Title and Description */}
                <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 justify-between">
                    <Link to={`/post/${$id}`}>
                        {/* Title and Description */}
                        <div className="flex flex-col gap-1">
                            <div>
                                <h1 className="font-heading text-base sm:text-xl font-semibold sm:font-bold text-slate-700 dark:text-slate-200 hn-break-words cursor-pointer">
                                    {title}
                                </h1>
                            </div>
                            <div className="hidden md:block">
                                <span className="text-base font-normal text-slate-500 dark:text-slate-400 hn-break-words cursor-pointer md:line-clamp-2">
                                    {/* Render HTML content */}
                                    <span dangerouslySetInnerHTML={{ __html: content.substring(0, 300) }} />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Image */}
                    {imageUrl && (
                        <div className="w-full rounded-xl md:rounded-lg relative cursor-pointer md:basis-[180px] md:h-[108px] md:shrink-0">
                            <Link to={`/post/${$id}`}>
                                <div className="h-40 w-64 sm:w-full sm:h-full">
                                    <img
                                        className="block w-full h-full object-cover overflow-hidden rounded-xl md:rounded-lg focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 focus:dark:ring-offset-slate-800"
                                        src={imageUrl}
                                        alt={title}
                                    />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                <section className="flex flex-col gap-5">
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between text-slate-600 dark:text-slate-300 text-sm'>

                        {/* Views and Likes */}
                        <div className="flex flex-row items-center gap-2 mb-2 sm:mb-0">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <p className="text-sm text-gray-500">{views} reads</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                <p className="text-sm text-gray-500">{likes} likes</p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1">
                            {tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm border rounded-md px-2 py-1"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default React.memo(PostCard2);

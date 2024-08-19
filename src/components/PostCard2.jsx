import React, { useEffect, useState } from 'react';
import fileservice from "../appwrite/fileConfig";
import { Link } from 'react-router-dom';

function PostCard2({ post }) {
    const { $id, title, image } = post;
    const [imageUrl, setImageUrl] = useState(null);

    const props = [
        200,                // width, will be resized using this value.
        200,                // height, ignored when 0
        'center',           // crop center
        '100',              // slight compression
        1,                  // border width
        '000000',           // border color
        1,                  // border radius
        1,                  // full opacity
        0,                  // no rotation
        '000000',           // background color
        'webp'              // output jpg format
    ];

    useEffect(() => {
        const fetchImageUrl = async () => {
            const url = await fileservice.getImagePreview(image, props);
            setImageUrl(url);
        };
        fetchImageUrl();
    }, [image]);

    return (
        <div className="flex justify-center">
            <Link to={`/post/${$id}`} className="w-full sm:flex sm:items-center sm:border sm:rounded-lg sm:overflow-hidden">
                <div className="flex flex-col justify-between p-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="py-2 text-gray-600">
                        Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.
                    </p>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-blue-600">Read more →</h3>
                    </div>
                </div>
                {imageUrl && (
                    <img
                        className="object-cover w-full h-48 sm:w-48 rounded-lg m-1"
                        src={imageUrl}
                        alt={title}
                    />
                )}
            </Link>
        </div>
    );
}

export default PostCard2;

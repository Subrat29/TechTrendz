import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import fileservice from "../appwrite/fileConfig";

const PostCard = ({ post }) => {
  const {
    $id,
    title = 'Untitled Post',
    image,
    $createdAt = new Date().toISOString(),
    content = '',
  } = post || {};

  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  // Load image when post changes
  useEffect(() => {
    const loadImage = async () => {
      try {
        if (!image) {
          setImageError(true);
          return;
        }

        // Handle direct URLs or fileservice images
        const url = image.startsWith('http') 
          ? image 
          : await fileservice.getImagePreview(image);
          
        setImageUrl(url);
        setImageError(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setImageError(true);
      }
    };
    
    loadImage();
  }, [image]);

  // Format date once when post changes
  const formattedDate = useMemo(() => {
    try {
      return new Date($createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }, [$createdAt]);

  // Sanitize content once when post changes
  const sanitizedContent = useMemo(() => {
    try {
      return content
        .replace(/<[^>]*>/g, '')
        .substring(0, 200);
    } catch {
      return '';
    }
  }, [content]);

  const ImageComponent = () => {
    if (imageError || !imageUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Date Section */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{formattedDate}</span>
        </div>

        {/* Content Section */}
        <Link 
          to={$id ? `/post/${$id}` : '#'} 
          className="group block"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {sanitizedContent}
                {content.length > 200 && '...'}
              </p>
            </div>

            <div className="relative h-40 md:h-32 rounded-lg overflow-hidden">
              <ImageComponent />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default React.memo(PostCard);
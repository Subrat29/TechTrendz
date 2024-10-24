import React, { useEffect, useMemo, useState } from 'react';
import { Eye, ThumbsUp, Calendar, User, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from 'prop-types'; // Added PropTypes import
import fileservice from "../appwrite/fileConfig";


const PostCard = ({ post }) => {
  const {
    $id,
    title = 'Untitled Post',
    image,
    $createdAt = new Date().toISOString(),
    content = '',
    author,
    views = 0,
    likes = 0,
    tags = []
  } = post || {};

  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formattedDate = useMemo(() => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date($createdAt).toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid Date';
    }
  }, [$createdAt]);

  const sanitizedContent = useMemo(() => {
    try {
      return content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .substring(0, 200);
    } catch (error) {
      return '';
    }
  }, [content]);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        if (!image) {
          setImageError(true);
          return;
        }

        // Direct image URL if it's already a full URL
        if (image.startsWith('http')) {
          setImageUrl(image);
        } else {
          // If using fileservice
          const url = await fileservice.getImagePreview(image); // Changed to getFilePreview
          setImageUrl(url);
        }
        setImageError(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [image]);

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

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4 sm:p-6">
        {/* Author and Date Section */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage 
                src={author?.avatar || "https://github.com/shadcn.png"} 
                alt={author?.name || 'Author'}
              />
              <AvatarFallback>
                <User className="h-6 w-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {author?.name || 'Anonymous'}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3 shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <Link 
          to={`/post/${$id}`} 
          className="group block"
          onClick={(e) => {
            if (!$id) {
              e.preventDefault();
              console.error('Post ID is missing');
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 md:gap-6">
            <div className="space-y-3 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 break-words">
                {sanitizedContent && (
                  <span 
                    dangerouslySetInnerHTML={{ 
                      __html: sanitizedContent + (content.length > 200 ? '...' : '') 
                    }} 
                  />
                )}
              </p>
            </div>

            <div className="relative h-40 sm:h-32 rounded-lg overflow-hidden">
              <ImageComponent />
            </div>
          </div>
        </Link>

        {/* Footer Section */}
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{views.toLocaleString()} reads</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{likes.toLocaleString()} likes</span>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="hover:bg-secondary/80 cursor-pointer truncate max-w-[150px]"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge variant="secondary">
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(PostCard);
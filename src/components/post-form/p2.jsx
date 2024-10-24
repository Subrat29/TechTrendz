import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImagePlus, Loader2 } from "lucide-react";

const PostForm = ({ post, onSubmit, isLoading = false }) => {
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || null);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.$id || '');
  const [status, setStatus] = useState(post?.status || 'active');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(null);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string') {
      return value.toLowerCase().replace(/ /g, '-');
    }
    return '';
  }, []);

  useEffect(() => {
    setSlug(slugTransform(title));
  }, [title, slugTransform]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, slug, status, content, image });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title and Slug Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="post-url-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Featured Image</Label>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              {imagePreview && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Status and Content Section */}
          <div className="space-y-4">
            <div className="w-[240px]">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="min-h-[300px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {post ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                post ? 'Update Post' : 'Publish Post'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning for Unsaved Changes */}
      {(title || content || image) && (
        <Alert>
          <AlertDescription>
            Don't forget to save your changes before leaving this page.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default PostForm;
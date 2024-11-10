import React, { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import configservice from '../../appwrite/config';
import fileservice from '../../appwrite/fileConfig';
import { addPost, updatePost } from '../../feature/postSlice';
import { addImage, deleteImage } from '../../feature/imageSlice';
import { RTE } from "..";

const PostForm = ({ post }) => {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [imageUrl, setImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();


    // Watch for file input changes
    const watchImage = watch("image");

    // Handle file preview
    useEffect(() => {
        if (watchImage && watchImage[0]) {
            const file = watchImage[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [watchImage]);

    const submit = async (data) => {
        setIsLoading(true);
        try {
            if (post) {
                const newImage = data.image[0] ? await fileservice.uploadImage(data.image[0]) : null;
                if (newImage) {
                    const newImageUrl = await fetchImageUrl(newImage.$id);
                    if (post.image) {
                        fileservice.deleteImage(post.image);
                        dispatch(deleteImage(post.image));
                    }
                    dispatch(addImage({ imageId: newImage.$id, imageUrl: newImageUrl.toString() }));
                }

                const finalImage = newImage ? newImage.$id : post.image;
                const dbPost = await configservice.updatePost(post.$id, {
                    ...data,
                    image: finalImage
                });
                if (dbPost) {
                    dispatch(updatePost(dbPost));
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const newImage = data.image[0] ? await fileservice.uploadImage(data.image[0]) : null;
                const newImageId = newImage?.$id || null;
                if (newImageId) {
                    const newImageUrl = await fetchImageUrl(newImageId);
                    dispatch(addImage({ imageId: newImageId, imageUrl: newImageUrl.toString() }));
                }
                data.image = newImageId;
                const dbPost = await configservice.createPost({
                    ...data,
                    userId: userData.$id ? userData.$id : null
                });
                if (dbPost) {
                    dispatch(addPost(dbPost));
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            const slug = value.toLowerCase().replace(/ /g, '-');
            setValue('slug', slug);
            return slug;
        }
        return '';
    }, [setValue]);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title, { shouldValidate: true }));
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue]);

    const fetchImageUrl = async (image) => {
        const props = [
            600,
            300,
            'center',
            '100',
            1,
            '000000',
            1,
            1,
            0,
            '000000',
            'webp'
        ];
        const url = await fileservice.getImagePreview(image, props);
        setImageUrl(url);
        return url;
    };

    useEffect(() => {
        if (post && post.image) {
            fetchImageUrl(post.image);
        }
    }, [post]);

    return (
        <form onSubmit={handleSubmit(submit)} className="max-w-4xl mx-auto p-4 space-y-8">
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
                                {...register("title", { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                placeholder="post-url-slug"
                                {...register("slug", { required: true })}
                                onInput={(e) => {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }}
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
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpg, image/jpeg, image/gif"
                                            {...register("image", { required: false })}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/* Show preview for new uploads or existing image */}
                            {(previewUrl || imageUrl) && (
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={previewUrl || imageUrl}
                                        alt={post?.title || "Preview"}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Status Section */}
                    <div className="w-[240px]">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            defaultValue={getValues("status")}
                            onValueChange={(value) => setValue("status", value)}
                        >
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

                    {/* Content Section */}
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <RTE
                            name="content"
                            control={control}
                            defaultValue={getValues("content")}
                        />
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
            {watch("title") || watch("content") || watch("image") ? (
                <Alert>
                    <AlertDescription>
                        Don't forget to save your changes before leaving this page.
                    </AlertDescription>
                </Alert>
            ) : null}
        </form>
    );
};

export default PostForm;
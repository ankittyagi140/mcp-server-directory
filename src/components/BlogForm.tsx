"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateBlogSlug } from "@/lib/supabase";
import { BookOpen, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { StorageError } from "@supabase/storage-js";

// Define form schema
const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters").max(200, "Excerpt must be less than 200 characters"),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type FormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  editMode?: boolean;
  blogId?: number;
  defaultValues?: Partial<FormValues> & { 
    featured_image?: string | null;
    slug?: string;
  };
}

export default function BlogForm({ editMode = false, blogId, defaultValues }: BlogFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(defaultValues?.featured_image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      content: defaultValues?.content || "",
      excerpt: defaultValues?.excerpt || "",
      tags: defaultValues?.tags ? Array.isArray(defaultValues.tags) ? defaultValues.tags.join(", ") : defaultValues.tags : "",
      status: defaultValues?.status || "draft",
    }
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSubmitError("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Image file size must be less than 5MB");
        return;
      }
      
      setFeaturedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setFeaturedImage(null);
    
    // If we're in edit mode and there was an existing image, we need to mark it for deletion
    if (previewImage && previewImage === defaultValues?.featured_image) {
      // Store info that we need to remove the existing image on submission
    }
    
    setPreviewImage(null);
  };
  
  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        console.error('Error uploading image:', JSON.stringify(error));
        
        if ((error as StorageError).message?.includes('Bucket not found') || 
            (error as StorageError).message?.includes('Bucket not found')) {
          setSubmitError("Storage bucket 'blog-images' not found. Please create this bucket in your Supabase project.");
        } else if ((error as StorageError).message?.includes('Permission denied') || 
                  (error as StorageError).message?.includes('Permission denied')) {
          setSubmitError("Permission denied. Make sure you have admin rights and proper storage policies.");
        } else {
          setSubmitError(`Upload failed: ${error.message || 'Unknown error'}`);
        }
        setIsUploading(false);
        return null;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      setUploadProgress(100);
      setIsUploading(false);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setSubmitError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUploading(false);
      return null;
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    // Check if user is authenticated and is admin
    if (!user || user.role !== 'admin') {
      setSubmitError("You don't have permission to publish blog posts");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    let imageUrl = defaultValues?.featured_image || null;
    
    try {
      // Upload image if a new one was selected
      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage);
        if (!imageUrl && data.status === 'published') {
          setSubmitError("Failed to upload image. Post not published.");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Transform tags to array
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];
      
      // Generate slug from title
      const slug = defaultValues?.slug || generateBlogSlug(data.title);
      
      // Prepare blog post data
      const blogPostData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        tags: tagsArray,
        status: data.status,
        featured_image: imageUrl,
        slug,
        author_id: user.id,
        author_name: user.email?.split('@')[0] || 'Admin',
      };
      
      if (editMode && blogId) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...blogPostData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', blogId);
        
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogPostData]);
        
        if (error) throw error;
      }
      
      setSubmitSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/blog');
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting blog post:', error);
      setSubmitError("Failed to save blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
          Blog post {editMode ? "updated" : "created"} successfully!
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Your blog post title"
          disabled={isSubmitting}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="excerpt"
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="A brief summary of your post (shown in previews)"
          disabled={isSubmitting}
          {...register("excerpt")}
        />
        {errors.excerpt && (
          <p className="text-xs text-red-500">{errors.excerpt.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          rows={12}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Your blog post content in HTML format"
          disabled={isSubmitting}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Content supports HTML formatting for rich text.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Featured Image
        </label>
        
        <div className="flex flex-col space-y-4">
          {/* Image preview */}
          {previewImage && (
            <div className="relative h-40 w-full overflow-hidden rounded-md border">
              <Image 
                src={previewImage} 
                alt="Featured image preview" 
                width={800}
                height={400}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-gray-700 hover:bg-white"
                title="Remove image"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Image upload button */}
          {!previewImage && (
            <div className="flex w-full items-center justify-center">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 py-6 px-4 text-center transition hover:bg-gray-100">
                <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Click to upload</span>
                <span className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting || isUploading}
                />
              </label>
            </div>
          )}
          
          {/* Upload progress */}
          {isUploading && (
            <div className="w-full">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-xs text-gray-500">Uploading image... {uploadProgress}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="MCP, Tutorial, Guide (comma separated)"
          disabled={isSubmitting}
          {...register("tags")}
        />
        <p className="text-xs text-muted-foreground">
          Enter comma-separated tags (e.g., &quot;Tutorial, MCP, Advanced&quot;)
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          {...register("status")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Publishing..."}
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              {editMode ? "Update Post" : "Publish Post"}
            </>
          )}
        </button>
      </div>
    </form>
  );
} 
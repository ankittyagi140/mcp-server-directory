"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PlusCircle } from "lucide-react";

const serverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  endpoint_url: z.string().url("Must be a valid URL"),
  tags: z.string().min(1, "At least one tag is required"),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_email: z.string().email("Must be a valid email"),
  features: z.string(),
});

type FormValues = z.infer<typeof serverSchema>;

export default function SubmitForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  
  // Check if Supabase is configured on mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || supabaseUrl === 'your-supabase-url' || 
        !supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
      setIsSupabaseConfigured(false);
      setSubmitError("Supabase is not properly configured. Please update your environment variables.");
    }
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
      endpoint_url: "",
      tags: "",
      logo_url: "",
      github_url: "",
      contact_email: "",
      features: "",
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    // Check if user is authenticated
    if (!user) {
      setSubmitError("You must be signed in to submit a server");
      router.push("/login?redirect=/submit");
      return;
    }    
    // Prevent form submission if Supabase isn't configured
    if (!isSupabaseConfigured) {
      setSubmitError("Cannot submit form: Supabase is not configured correctly.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const transformedData = {
        name: data.name.trim(),
        description: data.description.trim(),
        endpoint_url: data.endpoint_url.trim(),
        logo_url: data.logo_url ? data.logo_url.trim() : null,
        github_url: data.github_url ? data.github_url.trim() : null,
        contact_email: data.contact_email.trim(),
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        features: data.features ? data.features.split("\n").map(feature => feature.trim()).filter(Boolean) : [],
        status: "pending", // Explicit status to match RLS policy
        user_id: user.id, // Associate submission with the authenticated user
      };
      const { error: initialError } = await supabase
        .from("servers")
        .insert(transformedData);
      
      if (initialError) {
        console.error("Initial insert error:", initialError);
        
        // If failed, try with RPC as a backup approach
       
        const { error: rpcError } = await supabase.rpc('insert_server_with_user', {
          server_data: JSON.stringify(transformedData)
        });
        
        if (rpcError) {
          console.error("RPC insert error:", rpcError);
          throw rpcError;
        }
      }
      
      setSubmitSuccess(true);
      reset();
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push("/submit/success");
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting server:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <p className="text-sm font-medium">
            Thank you for your submission! Your server has been submitted for review.
          </p>
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Server Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="My MCP Server"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="A detailed description of your MCP server..."
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="endpoint_url" className="text-sm font-medium">
          Endpoint URL <span className="text-red-500">*</span>
        </label>
        <input
          id="endpoint_url"
          type="url"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="https://myserver.example.com"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("endpoint_url")}
        />
        {errors.endpoint_url && (
          <p className="text-xs text-red-500">{errors.endpoint_url.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags <span className="text-red-500">*</span>
        </label>
        <input
          id="tags"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Claude, GPT-4, Open Source (comma separated)"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("tags")}
        />
        {errors.tags && (
          <p className="text-xs text-red-500">{errors.tags.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter comma-separated tags (e.g., &quot;Claude, Open Source, RAG&quot;)
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="features" className="text-sm font-medium">
          Features
        </label>
        <textarea
          id="features"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="File attachments
Streaming
Embeddings
Function calling"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("features")}
        />
        <p className="text-xs text-muted-foreground">
          Enter each feature on a new line
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="logo_url" className="text-sm font-medium">
          Logo URL (optional)
        </label>
        <input
          id="logo_url"
          type="url"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="https://example.com/logo.png"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("logo_url")}
        />
        {errors.logo_url && (
          <p className="text-xs text-red-500">{errors.logo_url.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="github_url" className="text-sm font-medium">
          GitHub URL (optional)
        </label>
        <input
          id="github_url"
          type="url"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="https://github.com/username/repo"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("github_url")}
        />
        {errors.github_url && (
          <p className="text-xs text-red-500">{errors.github_url.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="contact_email" className="text-sm font-medium">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="contact@example.com"
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("contact_email")}
        />
        {errors.contact_email && (
          <p className="text-xs text-red-500">{errors.contact_email.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="inline-flex w-full h-12 items-center justify-center rounded-full bg-green-600 px-8 text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:scale-105 transform duration-200 disabled:opacity-50 disabled:pointer-events-none"
        disabled={!isSupabaseConfigured || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <PlusCircle className="mr-2 h-5 w-5" />
            Submit Server
          </>
        )}
      </button>
    </form>
  );
} 
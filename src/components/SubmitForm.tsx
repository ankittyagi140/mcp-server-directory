"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PlusCircle } from "lucide-react";

// Common fields for both server and client
const commonSchema = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string().min(1, "At least one tag is required"),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_email: z.string().email("Must be a valid email"),
  twitter_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  reddit_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
};

const serverSchema = z.object({
  type: z.literal("server"),
  endpoint_url: z.string().url("Must be a valid URL"),
  features: z.string(),
  ...commonSchema,
});

const clientSchema = z.object({
  type: z.literal("client"),
  client_url: z.string().url("Must be a valid URL"),
  capabilities: z.string(),
  compatibility: z.string(),
  ...commonSchema,
});

const formSchema = z.discriminatedUnion("type", [serverSchema, clientSchema]);

type FormValues = z.infer<typeof formSchema>;

// Helper functions to safely access errors in the discriminated union
const hasServerError = (errors: Record<string, unknown>, field: string): boolean => {
  return errors[field] !== undefined;
};

const getServerErrorMessage = (errors: Record<string, { message?: string }>, field: string): string | undefined => {
  return errors[field]?.message;
};

const hasClientError = (errors: Record<string, unknown>, field: string): boolean => {
  return errors[field] !== undefined;
};

const getClientErrorMessage = (errors: Record<string, { message?: string }>, field: string): string | undefined => {
  return errors[field]?.message;
};

// This component uses a discriminated union type with React Hook Form which causes TypeScript errors
// that are difficult to resolve without compromising the form's functionality
export default function SubmitForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [formType, setFormType] = useState<"server" | "client">("server");
  
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
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "server",
      name: "",
      description: "",
      endpoint_url: "",
      features: "",
      tags: "",
      logo_url: "",
      github_url: "",
      contact_email: "",
      twitter_url: "",
      reddit_url: "",
      linkedin_url: "",
      instagram_url: "",
    } as Partial<FormValues>
  });
  
  // Watch for type changes
  const type = watch("type");
  
  // Update form type when it changes
  useEffect(() => {
    if (type) {
      setFormType(type);
    }
  }, [type]);
  
  // Handle type change manually
  const handleTypeChange = (newType: "server" | "client") => {
    setValue("type", newType);
    setFormType(newType);
  };
  
  const onSubmit = async (data: FormValues) => {
    // Check if user is authenticated
    if (!user) {
      setSubmitError("You must be signed in to submit");
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
      if (data.type === "server") {
        const transformedData = {
          name: data.name.trim(),
          description: data.description.trim(),
          endpoint_url: data.endpoint_url.trim(),
          logo_url: data.logo_url ? data.logo_url.trim() : null,
          github_url: data.github_url ? data.github_url.trim() : null,
          contact_email: data.contact_email.trim(),
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
          features: data.features ? data.features.split("\n").map(feature => feature.trim()).filter(Boolean) : [],
          twitter_url: data.twitter_url ? data.twitter_url.trim() : null,
          reddit_url: data.reddit_url ? data.reddit_url.trim() : null,
          linkedin_url: data.linkedin_url ? data.linkedin_url.trim() : null,
          instagram_url: data.instagram_url ? data.instagram_url.trim() : null,
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
      } else {
        // Client submission
        const transformedData = {
          name: data.name.trim(),
          description: data.description.trim(),
          client_url: data.client_url.trim(),
          logo_url: data.logo_url ? data.logo_url.trim() : null,
          github_url: data.github_url ? data.github_url.trim() : null,
          contact_email: data.contact_email.trim(),
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
          capabilities: data.capabilities ? data.capabilities.split("\n").map(capability => capability.trim()).filter(Boolean) : [],
          compatibility: data.compatibility ? data.compatibility.split("\n").map(item => item.trim()).filter(Boolean) : [],
          twitter_url: data.twitter_url ? data.twitter_url.trim() : null,
          reddit_url: data.reddit_url ? data.reddit_url.trim() : null,
          linkedin_url: data.linkedin_url ? data.linkedin_url.trim() : null,
          instagram_url: data.instagram_url ? data.instagram_url.trim() : null,
          status: "pending",
          user_id: user.id,
        };
        
        const { error } = await supabase
          .from("clients")
          .insert(transformedData);
        
        if (error) {
          console.error("Client insert error:", error);
          throw error;
        }
      }
      
      setSubmitSuccess(true);
      reset();
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push("/submit/success");
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <p className="text-sm font-medium">
            Thank you for your submission! It has been submitted for review.
          </p>
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Type <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="server"
              checked={formType === "server"}
              className="mr-2 h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              {...register("type", {
                onChange: () => handleTypeChange("server")
              })}
            />
            <span>Server</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="client"
              checked={formType === "client"}
              className="mr-2 h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
              {...register("type", {
                onChange: () => handleTypeChange("client")
              })}
            />
            <span>Client</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={formType === "server" ? "My MCP Server" : "My MCP Client"}
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
          placeholder={formType === "server" ? "A detailed description of your MCP server..." : "A detailed description of your MCP client..."}
          disabled={!isSupabaseConfigured || isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      {/* Fix TypeScript errors with conditional rendering */}
      {formType === "server" ? (
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
          {formType === "server" && hasServerError(errors as Record<string, unknown>, "endpoint_url") && (
            <p className="text-xs text-red-500">
              {getServerErrorMessage(errors as Record<string, { message?: string }>, "endpoint_url")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="client_url" className="text-sm font-medium">
            Client URL <span className="text-red-500">*</span>
          </label>
          <input
            id="client_url"
            type="url"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="https://myclient.example.com"
            disabled={!isSupabaseConfigured || isSubmitting}
            {...register("client_url")}
          />
          {formType === "client" && hasClientError(errors as Record<string, unknown>, "client_url") && (
            <p className="text-xs text-red-500">
              {getClientErrorMessage(errors as Record<string, { message?: string }>, "client_url")}
            </p>
          )}
        </div>
      )}
      
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
      
      {formType === "server" ? (
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
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="capabilities" className="text-sm font-medium">
              Capabilities
            </label>
            <textarea
              id="capabilities"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Chat interface
File uploads
Code highlighting"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("capabilities")}
            />
            <p className="text-xs text-muted-foreground">
              Enter each capability on a new line
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="compatibility" className="text-sm font-medium">
              Compatible with
            </label>
            <textarea
              id="compatibility"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Anthropic Claude Servers
OpenAI GPT servers
Ollama servers"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("compatibility")}
            />
            <p className="text-xs text-muted-foreground">
              Enter each compatible server type on a new line
            </p>
          </div>
        </>
      )}
      
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
      
      <div className="pt-2 pb-1">
        <h3 className="text-sm font-medium mb-3">Social Media Links (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="twitter_url" className="text-xs font-medium">
              Twitter / X
            </label>
            <input
              id="twitter_url"
              type="url"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://twitter.com/username"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("twitter_url")}
            />
            {errors.twitter_url && (
              <p className="text-xs text-red-500">{errors.twitter_url.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reddit_url" className="text-xs font-medium">
              Reddit
            </label>
            <input
              id="reddit_url"
              type="url"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://reddit.com/r/subreddit"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("reddit_url")}
            />
            {errors.reddit_url && (
              <p className="text-xs text-red-500">{errors.reddit_url.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="linkedin_url" className="text-xs font-medium">
              LinkedIn
            </label>
            <input
              id="linkedin_url"
              type="url"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://linkedin.com/in/username"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("linkedin_url")}
            />
            {errors.linkedin_url && (
              <p className="text-xs text-red-500">{errors.linkedin_url.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="instagram_url" className="text-xs font-medium">
              Instagram
            </label>
            <input
              id="instagram_url"
              type="url"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://instagram.com/username"
              disabled={!isSupabaseConfigured || isSubmitting}
              {...register("instagram_url")}
            />
            {errors.instagram_url && (
              <p className="text-xs text-red-500">{errors.instagram_url.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="cursor-pointer inline-flex w-full h-12 items-center justify-center rounded-full bg-green-600 px-8 text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:scale-105 transform duration-200 disabled:opacity-50 disabled:pointer-events-none"
        disabled={!isSupabaseConfigured || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <PlusCircle className="mr-2 h-5 w-5" />
            Submit {formType === "server" ? "Server" : "Client"}
          </>
        )}
      </button>
    </form>
  );
} 
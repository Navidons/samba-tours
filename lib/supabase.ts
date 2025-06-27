import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

// Use environment variables or fallback to hardcoded values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://enyqdavivjqrlflubutr.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVueXFkYXZpdmpxcmxmbHVidXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDkwNDcsImV4cCI6MjA2NjEyNTA0N30.CuqFTmvMY5qx3FNRJhqp-qHXkkGZBg11pTjGqjbdc3E"

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  })
  }
  return supabaseClient;
}

export function createServerClient(): SupabaseClient {
  // For server-side operations, we don't persist the session in the same way
  // as client-side, but rather use it for direct database queries.
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export async function uploadImageToSupabase(file: File, bucketName: string, path: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, { cacheControl: '3600', upsert: true });

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Memoized client for server-side or client-side use
// export const supabase = createClient()

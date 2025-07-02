import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

// Use environment variables or fallback to hardcoded values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixlosyntdfezomjbjbsn.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bG9zeW50ZGZlem9tamJqYnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjYzMTgsImV4cCI6MjA2Njc0MjMxOH0.uCUSLMKqYLCtnFXEJKyUKdwTTX2ssJXvMkQt-XExLxo"
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bG9zeW50ZGZlem9tamJqYnNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE2NjMxOCwiZXhwIjoyMDY2NzQyMzE4fQ.JybUJqdRJzShvviud2q57IqI9uSDESokCmX_E2q8JyA"

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Add a check for the service role key
if (!supabaseServiceRoleKey) {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Admin client functions might not work correctly.")
}

let supabaseClient: SupabaseClient | null = null;

// Create admin client for elevated operations
const adminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseClient;
}

export function createAdminClient(): SupabaseClient {
  // For server-side operations requiring elevated privileges
  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Cannot create admin client.")
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false, // Sessions are not persisted for admin client
    },
  });
}

export function createServerClient(): SupabaseClient {
  // For server-side operations, we don't persist the session in the same way
  // as client-side, but rather use it for direct database queries.
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export async function uploadImageToSupabase(file: File, bucketName: string, path: string): Promise<string | null> {
  try {
    const supabase = createClient();
    
    console.log("Starting upload to bucket:", bucketName, "path:", path, "file size:", file.size);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, { cacheControl: '3600', upsert: true });

    if (error) {
      console.error("Error uploading image:", {
        message: error.message,
        name: error.name,
        bucket: bucketName,
        path: path,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      });
      
      // Also log the raw error object
      console.error("Raw error object:", error);
      console.error("Error stringified:", JSON.stringify(error, null, 2));
      
      return null;
    }

    console.log("Upload successful, data:", data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    console.log("Public URL generated:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Unexpected error in uploadImageToSupabase:", {
      error: err,
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
      errorStack: err instanceof Error ? err.stack : undefined,
      bucket: bucketName,
      path: path,
      fileSize: file?.size,
      fileName: file?.name,
      fileType: file?.type
    });
    return null;
  }
}

export async function testStorageAccess(bucketName: string): Promise<{ exists: boolean; error?: any }> {
  try {
    const supabase = createClient();
    
    // Try to list files in the bucket to test access
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
    
    if (error) {
      console.error("Storage access test failed:", error);
      return { exists: false, error };
    }
    
    console.log("Storage bucket access test successful:", { bucket: bucketName, data });
    return { exists: true };
  } catch (err) {
    console.error("Unexpected error testing storage access:", err);
    return { exists: false, error: err };
  }
}

export async function listStorageBuckets(): Promise<string[]> {
  try {
    const supabase = createClient();
    
    // Note: This might not work with the anon key, but worth trying
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Failed to list storage buckets:", error);
      return [];
    }
    
    const bucketNames = data?.map(bucket => bucket.name) || [];
    console.log("Available storage buckets:", bucketNames);
    return bucketNames;
  } catch (err) {
    console.error("Error listing storage buckets:", err);
    return [];
  }
}

export async function ensureGalleryBucket(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // First, try to list buckets to see if gallery exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Failed to list buckets:", listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'gallery');
    console.log("Gallery bucket exists:", bucketExists);
    
    if (!bucketExists) {
      console.log("Gallery bucket does not exist, attempting to create...");
      
      // Try to create the bucket
      const { data: createData, error: createError } = await supabase.storage.createBucket('gallery', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error("Failed to create gallery bucket:", createError);
        return false;
      }
      
      console.log("Gallery bucket created successfully:", createData);
      return true;
    }
    
    return true;
  } catch (err) {
    console.error("Error ensuring gallery bucket:", err);
    return false;
  }
}

// Function to check if user has admin role
export async function isUserAdmin(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    // Check if user has admin role in their JWT
    const isAdmin = user.app_metadata?.role === 'admin' || 
                   user.app_metadata?.is_admin === true ||
                   user.role === 'admin'

    return isAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Function to get admin client for elevated operations
export function getAdminClient(): SupabaseClient {
  return adminClient
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function syncUserProfile(userId: string, email: string) {
  // Ensure every user has a profile in Supabase (defaulting to 'customer')
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: email,
        role: "customer", // Default role for all new sign-ups
      },
      { onConflict: "id", ignoreDuplicates: true },
    )
    .select("role")
    .single();

  if (error) {
    console.error("Error syncing profile to Supabase:", error);
    return null;
  }

  return data?.role;
}

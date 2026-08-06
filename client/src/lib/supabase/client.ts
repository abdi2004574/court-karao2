import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://sftvbbyaogevppfgtpdb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdHZiYnlhb2dldnBwZmd0cGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTE1OTEsImV4cCI6MjEwMDc4NzU5MX0.mwKjjZECYJ1ETEC0bgBBRKk6F4GPJKKfSh-6L9jHpBQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connectivity", () => {
  it("initializes supabase client with provided URL and key", () => {
    const url = "https://sftvbbyaogevppfgtpdb.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdHZiYnlhb2dldnBwZmd0cGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTE1OTEsImV4cCI6MjEwMDc4NzU5MX0.mwKjjZECYJ1ETEC0bgBBRKk6F4GPJKKfSh-6L9jHpBQ";
    const supabase = createClient(url, key);
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});

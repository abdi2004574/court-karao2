import { supabase } from "./client";

export async function uploadImageToSupabase(file: File, bucket: "avatars" | "venue-images", folderId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folderId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    // Fallback to object URL for demo/guest mode if bucket isn't provisioned yet
    return URL.createObjectURL(file);
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

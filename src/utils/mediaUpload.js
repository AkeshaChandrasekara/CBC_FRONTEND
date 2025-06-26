import { createClient } from "@supabase/supabase-js";

const key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocnhucGppcHJ6bHRrcHBlZ3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTQ3NTcsImV4cCI6MjA2NjMzMDc1N30.RTKy9gU7uiEodV1CKIgeJnKBQcbNpg0jdsOD-xYwlNY`

const url = "https://xhrxnpjiprzltkppegwt.supabase.co"


const supabase = createClient(url, key);

export default function uploadMediaToSupabase(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("File not added");
    }
    let fileName = file.name;
    const extension = fileName.split(".")[fileName.split(".").length - 1];

    const timestamp = new Date().getTime();

    fileName = timestamp +file.name+ "." + extension;

    supabase.storage.from("images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    }).then(()=>{
      const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
      resolve(publicUrl);
    }).catch((err)=>{
      reject(err);
    });
  });
}
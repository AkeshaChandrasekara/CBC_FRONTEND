import { createClient } from "@supabase/supabase-js"
import { useState } from "react"


export default function FileUploadTest() {
    const [file, setFile] = useState(null)
    
    async function handleUpload() {
        if (file == null) {
            alert("Please Select File")
            return
        }

        const fileName = file.name
        const extension = file.name.split(".").pop()
        if (extension != "jpg" && extension != "png" && extension != "jpeg") {
            alert("Please Select Image File")
            return
        }

        const supabase = createClient(url, key)
        
        try {
            // Upload the file
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("images")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                })

            if (uploadError) {
                alert(uploadError.message)
                return
            }

            // Get public URL (this is synchronous, no .then needed)
            const { data: { publicUrl } } = supabase.storage
                .from("images")
                .getPublicUrl(fileName)

            console.log("Public URL:", publicUrl)
            alert(`File uploaded successfully! URL: ${publicUrl}`)
            
        } catch (error) {
            console.error("Error uploading file:", error)
            alert("An error occurred while uploading the file")
        }
    }
    
    return (
        <div>
            <h1>File Upload Test</h1>
            <input 
                type="file" 
                onChange={(e) => {
                    setFile(e.target.files[0])
                }} 
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}
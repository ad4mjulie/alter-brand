export async function uploadToCloudinary(file: File): Promise<{ success: true; url: string } | { success: false; error: string }> {
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            return { success: false, error: 'Cloudinary configuration missing' };
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error?.message || 'Upload failed' };
        }

        const data = await response.json();
        return { success: true, url: data.secure_url };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error during upload' };
    }
}

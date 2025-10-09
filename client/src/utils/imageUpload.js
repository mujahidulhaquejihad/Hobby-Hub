// 1. ADD THE NEW checkImage FUNCTION
export const checkImage = (file) => {
    let err = "";
    if (!file) return err = "File does not exist.";

    // Check file size (must be less than 5mb)
    if (file.size > 1024 * 1024 * 5) {
        err = "Image size must be less than 5 mb.";
    }

    // Check file type (must be an image or video)
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'video/mp4') {
        err = "File format is incorrect.";
    }

    return err;
};

export const imageUpload = async (images) => {
    let imgArr = [];
    for (const item of images) {
        const formData = new FormData();

        if (item.camera) {
            formData.append("file", item.camera);
        } else {
            formData.append("file", item);
        }

        // --- IMPORTANT: REPLACE THESE PLACEHOLDERS ---
        formData.append("upload_preset", "HobbyHub");
        formData.append("cloud_name", "dnyhlbssi"); 
        // -----------------------------------------

        const res = await fetch("https://api.cloudinary.com/v1_1/dnyhlbssi/image/upload", { // 3. ALSO REPLACE CLOUD NAME IN THIS URL
            method: "POST",
            body: formData
        });

        const data = await res.json();
        imgArr.push({ public_id: data.public_id, url: data.secure_url });
    }
    return imgArr;
};


/**
 * Image upload: uses your own backend by default (no Cloudinary).
 * Optional: set REACT_APP_CLOUDINARY_CLOUD_NAME + REACT_APP_CLOUDINARY_UPLOAD_PRESET to use Cloudinary instead.
 */

import { uploadFileAPI } from "./fetchData";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "UniBook";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exist.");

  if (file.size > 1024 * 1024 * 5) {
    err = "Image size must be less than 5 MB.";
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    err = "Use JPEG, PNG, WebP, GIF, or MP4.";
  }

  return err;
};

/** Upload images. Uses server by default; pass token. Set Cloudinary env vars to use Cloudinary instead. */
export const imageUpload = async (images, token) => {
  if (!images || (Array.isArray(images) && images.length === 0)) {
    return [];
  }

  const list = Array.isArray(images) ? images : [images];

  if (CLOUD_NAME) {
    return uploadToCloudinary(list);
  }

  if (!token) {
    throw new Error("You must be logged in to upload images.");
  }
  return uploadToServer(list, token);
};

async function uploadToServer(list, token) {
  const imgArr = [];
  for (const item of list) {
    const file = item.camera ? dataURLtoFile(item.camera) : item;
    const data = await uploadFileAPI(file, token);
    if (!data.url) {
      throw new Error(data.msg || "Upload failed.");
    }
    imgArr.push({ public_id: data.public_id || data.url, url: data.url });
  }
  return imgArr;
}

function dataURLtoFile(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], "camera.png", { type: mime });
}

async function uploadToCloudinary(list) {
  const imgArr = [];
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  for (const item of list) {
    const formData = new FormData();
    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }
    formData.append("upload_preset", UPLOAD_PRESET);

    let res;
    try {
      res = await fetch(uploadUrl, { method: "POST", body: formData });
    } catch (e) {
      throw new Error("Network error. Check your connection and try again.");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error?.message || (typeof data.error === "string" ? data.error : null) || `Upload failed (${res.status}).`;
      throw new Error(msg);
    }
    if (data.error || !data.secure_url) {
      throw new Error(data.error?.message || "Cloudinary upload failed.");
    }
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
}

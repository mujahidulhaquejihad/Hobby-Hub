import axios from 'axios';

// Use explicit backend URL so API requests always hit the server (avoids 404 from proxy issues).
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_BASE
});

export const getDataAPI = async (url, token) => {
    const res = await axiosInstance.get(url, {
        headers: { Authorization: token }
    });
    return res;
}

export const postDataAPI = async (url, post, token) => {
    const res = await axiosInstance.post(url, post, {
        headers: { Authorization: token }
    });
    return res;
}

export const putDataAPI = async (url, post, token) => {
    const res = await axiosInstance.put(url, post, {
        headers: { Authorization: token }
    });
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const res = await axiosInstance.patch(url, post, {
        headers: { Authorization: token }
    });
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axiosInstance.delete(url, {
        headers: { Authorization: token }
    });
    return res;
}

/** Upload a single file to our backend (no Cloudinary). Returns { public_id, url }. */
export const uploadFileAPI = async (file, token) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("upload", formData, {
        headers: { Authorization: token },
    });
    return res.data;
};

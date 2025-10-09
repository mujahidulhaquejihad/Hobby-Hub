import axios from 'axios';

// Create a single, reusable instance of Axios with the base URL of your API.
// This is a modern best practice.
const axiosInstance = axios.create({
    baseURL: '/api'
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

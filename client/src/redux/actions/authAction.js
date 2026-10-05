import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, patchDataAPI } from '../../utils/fetchData'
// 1. Corrected the import to use 'default' export
import valid from '../../utils/valid'

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await postDataAPI('login', data);
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });

        localStorage.setItem("firstLogin", true);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || "Login failed. Check your connection and try again."
            }
        });
    }
};

// 2. Added the missing 'adminLogin' function
export const adminLogin = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        // This assumes you have a specific endpoint for admin login
        const res = await postDataAPI('admin/login', data);
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });
        localStorage.setItem("firstLogin", true);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || "Admin login failed. Check your connection and try again."
            }
        });
    }
};

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        try {
            const res = await postDataAPI('refresh_token');
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            });
            dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: err.response?.data?.msg || err.message || "Session expired. Please sign in again."
                }
            });
        }
    }
};

export const register = (data) => async (dispatch) => {
    const check = valid(data);
    if (check.errLength > 0)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg });

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await postDataAPI('register', data);
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });
        localStorage.setItem("firstLogin", true);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || "Registration failed. Check your connection and try again."
            }
        });
    }
};

// 3. Added the missing 'changePassword' function
export const changePassword = ({ oldPassword, newPassword, auth }) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await postDataAPI('changePassword', { oldPassword, newPassword }, auth.token);

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || "Something went wrong."
            }
        });
    }
};

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin');
        await postDataAPI('logout');
        window.location.href = "/";
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || "Logout failed."
            }
        });
    }
};

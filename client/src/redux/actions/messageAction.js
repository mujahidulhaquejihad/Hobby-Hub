import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI } from '../../utils/fetchData';

export const MESSAGE_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    UPDATE_MESSAGE: 'UPDATE_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
};

// This is the corrected 'addUser' action. It now uses getState.
export const addUser = ({ user }) => async (dispatch, getState) => {
    const { message } = getState();
    
    // Check if the user is already in the conversation list before adding them.
    if (message.users.every(item => item._id !== user._id)) {
        dispatch({ type: MESSAGE_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    }
};

export const addMessage = ({ msg, auth }) => async (dispatch) => {
    dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg });

    try {
        const res = await postDataAPI('message', msg, auth.token);
        if (res?.data?.message) {
            dispatch({ type: MESSAGE_TYPES.UPDATE_MESSAGE, payload: { optimistic: msg, saved: res.data.message } });
        }
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || 'Failed to send message' }
        });
    }
};

export const getConversations = ({ auth, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token);
        
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArr.push({ ...cv, text: item.text, media: item.media });
                }
            });
        });

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATIONS,
            payload: { newArr, result: res.data.result }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

export const getMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        dispatch({
            type: MESSAGE_TYPES.GET_MESSAGES,
            payload: { messages: res.data.messages, result: res.data.result, page }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};


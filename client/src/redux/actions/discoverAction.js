import { GLOBALTYPES } from './globalTypes';
import { getDataAPI } from '../../utils/fetchData';

export const DISCOVER_TYPES = {
    LOADING: 'LOADING_DISCOVER',
    GET_POSTS: 'GET_DISCOVER_POSTS',
    UPDATE_POSTS: 'UPDATE_DISCOVER_POSTS',
};

/**
 * Fetches the initial set of posts for the Discover feed.
 * @param {string} token - The user's authentication token.
 */
export const getDiscoverPosts = (token) => async (dispatch) => {
    try {
        dispatch({ type: DISCOVER_TYPES.LOADING, payload: true });

        // This API call will fetch the first page of posts
        const res = await getDataAPI('post_discover', token);
        
        dispatch({ type: DISCOVER_TYPES.GET_POSTS, payload: res.data });

        dispatch({ type: DISCOVER_TYPES.LOADING, payload: false });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};
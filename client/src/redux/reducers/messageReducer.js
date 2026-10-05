import { MESSAGE_TYPES } from '../actions/messageAction';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    resultData: 0,
    firstLoad: false,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.ADD_USER:
            if (state.users.every(item => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users],
                };
            }
            return state;
        case MESSAGE_TYPES.ADD_MESSAGE:
            return {
                ...state,
                data: [...state.data, action.payload],
                users: state.users.map(user =>
                    user._id === action.payload.recipient || user._id === action.payload.sender
                        ? { ...user, text: action.payload.text, media: action.payload.media, createdAt: action.payload.createdAt }
                        : user
                ),
            };
        case MESSAGE_TYPES.UPDATE_MESSAGE: {
            const { optimistic, saved } = action.payload;
            const created = new Date(optimistic.createdAt).getTime();
            const data = state.data.map(m => {
                if (m._id === saved._id) return saved;
                if (!m._id && m.sender === optimistic.sender && m.recipient === optimistic.recipient) {
                    const t = new Date(m.createdAt).getTime();
                    if (Math.abs(t - created) < 3000) return saved;
                }
                return m;
            });
            return {
                ...state,
                data,
                users: state.users.map(user =>
                    user._id === saved.recipient || user._id === saved.sender
                        ? { ...user, text: saved.text, media: saved.media, createdAt: saved.createdAt }
                        : user
                ),
            };
        }
        case MESSAGE_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArr,
                resultUsers: action.payload.result,
                firstLoad: true,
            };
        case MESSAGE_TYPES.GET_MESSAGES: {
            const { messages, result, page = 1 } = action.payload;
            const reversed = [...(messages || [])].reverse();
            return {
                ...state,
                data: page > 1 ? [...reversed, ...state.data] : reversed,
                resultData: result ?? 0,
            };
        }
        default:
            return state;
    }
}

export default messageReducer;


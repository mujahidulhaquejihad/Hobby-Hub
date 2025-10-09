import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';

// 1. Import from the new, correct package name
import { composeWithDevTools } from '@redux-devtools/extension';

// The store setup remains the same, but now uses the correct imports
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

const DataProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DataProvider;
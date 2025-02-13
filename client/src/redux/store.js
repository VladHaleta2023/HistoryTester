import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice.js';
import testerReducer from './reducers/testerSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        tester: testerReducer
    }
});

export default store;
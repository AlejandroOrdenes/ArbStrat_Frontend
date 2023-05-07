import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { authReducer } from './reducers';

const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;


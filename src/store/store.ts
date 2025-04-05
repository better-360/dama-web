import { configureStore } from '@reduxjs/toolkit';
import userSlice  from './slices/userSlice';
import applicatorSlice from './slices/applicatorSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    applicator: applicatorSlice,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
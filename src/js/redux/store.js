import { configureStore } from '@reduxjs/toolkit'
import hangmanSlice from './reducers/hangmanSlice';

const store = configureStore({
  reducer: {
    hangman: hangmanSlice
  },
});

export default store;
import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    winCount: 0, 
    totalGames: 0
};

export const hangmanSlice = createSlice({
  name: 'hangman',
  initialState,
  reducers: {
    update: (state, action) => {
        state = {
            ...state,
            winCount: state.winCount + action.winCount, 
            totalGames: state.totalGames + action.totalGames
        };
    },
  },
})

// Action creators are generated for each case reducer function
export const { update } = hangmanSlice.actions;

export const hangmanState = state => state.hangman;

export default hangmanSlice.reducer;
import {
    createSlice,
    PayloadAction,
  } from '@reduxjs/toolkit';
  import type { RootState } from '../store';
  
  // declaring the types for our state
  export type messageState = {
    isToastLocked: boolean,
    reservationMsgs: any[],
  };
  
  const initialState: messageState = {
    isToastLocked: false,
    reservationMsgs: [],
  };
  
  export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
      setIsToastLocked: (state, action: PayloadAction<boolean>) => {
        state.isToastLocked = action.payload;
      },
      addReservationMsg: (state, action: PayloadAction<any>) => {
        state.reservationMsgs = [...state.reservationMsgs, action.payload];
      },
      removeReservationMsg: (state, action: PayloadAction<any>) => {
      }
    },
  });
  
  export const {
    setIsToastLocked,
    addReservationMsg,
    removeReservationMsg,
  } = messageSlice.actions;
  
  
  export const getIsToastLocked = (state: RootState) => state.message.isToastLocked;
  export const getReservationMsgs = (state: RootState) => state.message.reservationMsgs;
  
  export default messageSlice.reducer;
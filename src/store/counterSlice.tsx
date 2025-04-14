import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface UserState {
  name: string;
  totalUsers: number;
  availableUsers: number;
}

const initialState: UserState = {
  name: '',
  totalUsers: 0,
  availableUsers: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJoindedUser: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setTotalUsers: (state, action: PayloadAction<number>) => {
      state.totalUsers = action.payload;
    },
    setAvailableUsers: (state, action: PayloadAction<number>) => {
      state.availableUsers = action.payload;
    },
  },
});

export const { setJoindedUser, setTotalUsers, setAvailableUsers } = userSlice.actions;

export const joinedUser = (state: RootState) => state.user.name;
export const totalUsers = (state: RootState) => state.user.totalUsers;
export const availableUsers = (state: RootState) => state.user.availableUsers;

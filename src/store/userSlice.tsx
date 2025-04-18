import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface IUserState {
  name: string;
  totalUsers: number;
  availableUsers: number;
  wsLoader: boolean;
}

const initialState: IUserState = {
  name: '',
  totalUsers: 0,
  availableUsers: 0,
  wsLoader: true,
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
    setWSLoader: (state, action: PayloadAction<boolean>) => {
      state.wsLoader = action.payload;
    }
  },
});

export const { setJoindedUser, setTotalUsers, setAvailableUsers, setWSLoader } = userSlice.actions;

export const joinedUser = (state: RootState) => state.user.name;
export const totalUsers = (state: RootState) => state.user.totalUsers;
export const availableUsers = (state: RootState) => state.user.availableUsers;
export const wsGlobalLoader = (state: RootState) => state.user.wsLoader;

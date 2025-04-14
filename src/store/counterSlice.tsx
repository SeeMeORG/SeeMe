import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
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

export const { setName, setTotalUsers, setAvailableUsers } = userSlice.actions;
export default userSlice.reducer;

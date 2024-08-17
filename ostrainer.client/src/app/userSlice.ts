import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './types';

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser: (state, action: PayloadAction<User>) => {
    //   state.user = action.payload;
    //   localStorage.setItem('user', JSON.stringify(action.payload));
    // },
    // clearUser: (state) => {
    //   state.user = null;
    //   localStorage.removeItem('user');
    // },
  },
});

export const selectUser = (): User | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString) as User;
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        return null;
      }
    }
    return null;
  };

  export const clearUser = () => {
    localStorage.removeItem('user');
  };

  export const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  }

  export const {  } = userSlice.actions;
export default userSlice.reducer;

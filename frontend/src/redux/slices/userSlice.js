import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  jwtToken: null,
  role: null,
  fullnames: null,
  grade: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {

      state.username = action.payload.username;
      state.jwtToken = action.payload.jwtToken;
      state.role = action.payload.role;
      state.fullnames = action.payload.fullnames;
      state.grade = action.payload.grade;
      state.department = action.payload.department;

      localStorage.setItem('jwtToken', action.payload.jwtToken);
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('fullnames', action.payload.fullnames);
      localStorage.setItem('grade', action.payload.grade);
      localStorage.setItem('department', action.payload.department);
    },
    logout: (state) => {
      state.username = null;
      state.jwtToken = null;
      state.role = null;
      state.fullnames = null;
      state.grade = null;
      state.department = null;

      localStorage.clear();
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

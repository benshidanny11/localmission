import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
});

const jwtToken = localStorage.getItem('jwtToken');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
const fullnames = localStorage.getItem('fullnames');
const grade = localStorage.getItem('grade');
const department = localStorage.getItem('department');

if (jwtToken && username && role && fullnames && grade && department) {
  store.dispatch({
    type: 'user/login',
    payload: { jwtToken, username, role, fullnames, grade, department: department },
  });
}

export default store;

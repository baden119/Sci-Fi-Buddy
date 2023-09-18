import { useReducer, useContext } from 'react';
import AuthContext from './AuthContext';
import authReducer from './AuthReducer';
import axios from 'axios';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  LOGOUT,
} from '../types';

// Create a custom hook to use the auth context
export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  return [state, dispatch];
};

// Login User
export const login = async (dispatch, formData) => {
  try {
    const res = await axios.post('api/users/login', formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message,
    });
  }
};

// Register User
export const register = async (dispatch, formData) => {
  try {
    const res = await axios.post('/api/users', formData);
    console.log(res.data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.message,
    });
  }
};

// Logout User
export const logout = (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Clear Auth Errors
export const clearAuthErrors = (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

const AuthState = (props) => {
  // Get User from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const initialState = {
    user: user ? user : null,
    authError: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state: state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;

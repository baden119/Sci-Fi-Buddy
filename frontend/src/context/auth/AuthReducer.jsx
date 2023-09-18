import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  LOGOUT,
} from '../types';

const AuthReducer = (state, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        authError: action.payload,
      };

    case LOGOUT:
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        authError: null,
      };

    case CLEAR_ERRORS:
      return { ...state, authError: null };

    default:
      return state;
  }
};

export default AuthReducer;

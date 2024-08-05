// actions.js
import axios from "axios";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SELECT_PAIR = 'SELECT_PAIR';

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (token) => ({
  type: LOGIN_SUCCESS,
  payload: token,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post("https://arbstrat.aordenes.com/api/login/", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      dispatch(loginSuccess(token));
    } catch (error) {
      dispatch(loginFailure(error.response.data.message));
    }
  };
};

export const selectPair = (pair) => {
  return {
      type: SELECT_PAIR,
      payload: pair,
  }
};

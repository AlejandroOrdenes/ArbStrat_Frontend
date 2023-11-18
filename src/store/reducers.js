import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,  } from "./actions";
import { SELECT_PAIR } from './actions';

const initialState = {
  selectedPair: null,
  loading: false,
  token: localStorage.getItem("token"),
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, token: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, token: null, error: action.payload };
    case LOGOUT:
      localStorage.removeItem("token");
      return { ...state, token: null };
    default:
      return state;
  }
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
      case SELECT_PAIR:
          return {
              ...state,
              selectedPair: action.payload,
          };
      // ... maneja otras acciones aquí
      default:
          return state;
  }
};

  
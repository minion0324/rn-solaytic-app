import { createAction } from 'redux-actions';

export const FETCH_DATA = 'FETCH_DATA';
export const PERSIST_REHYDRATED = 'PERSIST_REHYDRATED';
export const LOGIN = 'USER/LOGIN';
export const LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS';
export const SET_REMEMBERED_USER = 'USER/SET_REMEMBERED_USER';
export const AUTH_TOKEN = 'USER/AUTH_TOKEN';
export const AUTH_TOKEN_SUCCESS = 'USER/AUTH_TOKEN_SUCCESS';
export const LOGOUT = 'USER/LOGOUT';

export const actionCreators = {
  fetch: createAction(FETCH_DATA),
  login: createAction(LOGIN),
  loginSuccess: createAction(LOGIN_SUCCESS),
  setRememberedUser: createAction(SET_REMEMBERED_USER),
  authToken: createAction(AUTH_TOKEN),
  authTokenSuccess: createAction(AUTH_TOKEN_SUCCESS),
  logout: createAction(LOGOUT),
};

import { createAction } from 'redux-actions';

export const LOGIN = 'USER/LOGIN';
export const LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS';
export const SET_REMEMBERED_USER = 'USER/SET_REMEMBERED_USER';

export const actionCreators = {
  login: createAction(LOGIN),
  loginSuccess: createAction(LOGIN_SUCCESS),
  setRememberedUser: createAction(SET_REMEMBERED_USER),
};

import { createAction } from 'redux-actions';

export const SET_CURRENT_SCREEN_INFO = 'VIEW/SET_CURRENT_SCREEN_INFO';

export const actionCreators = {
  setCurrentScreenInfo: createAction(SET_CURRENT_SCREEN_INFO),
};

import { createAction } from 'redux-actions';

export const SET_CORE_SCREEN_INFO = 'VIEW/SET_CORE_SCREEN_INFO';
export const GET_DRIVER_NOTES = 'VIEW/GET_DRIVER_NOTES';
export const GET_DRIVER_NOTES_SUCCESS = 'VIEW/GET_DRIVER_NOTES_SUCCESS';
export const GET_DRIVER_NOTES_BY_PAGE = 'VIEW/GET_DRIVER_NOTES_BY_PAGE';
export const GET_DRIVER_NOTES_BY_PAGE_SUCCESS = 'VIEW/GET_DRIVER_NOTES_BY_PAGE_SUCCESS';
export const SET_IS_REQUIRED_UPDATE_TAB = 'VIEW/SET_IS_REQUIRED_UPDATE_TAB';

export const actionCreators = {
  setCoreScreenInfo: createAction(SET_CORE_SCREEN_INFO),
  getDriverNotes: createAction(GET_DRIVER_NOTES),
  getDriverNotesSuccess: createAction(GET_DRIVER_NOTES_SUCCESS),
  getDriverNotesByPage: createAction(GET_DRIVER_NOTES_BY_PAGE),
  getDriverNotesByPageSuccess: createAction(GET_DRIVER_NOTES_BY_PAGE_SUCCESS),
  setIsRequiredUpdateTab: createAction(SET_IS_REQUIRED_UPDATE_TAB),
};

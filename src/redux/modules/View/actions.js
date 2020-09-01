import { createAction } from 'redux-actions';

export const SET_CORE_SCREEN_INFO = 'VIEW/SET_CORE_SCREEN_INFO';
export const UPLOAD_PHOTOS = 'VIEW/UPLOAD_PHOTOS';
export const UPLOAD_PHOTOS_SUCCESS = 'VIEW/UPLOAD_PHOTOS_SUCCESS';
export const UPLOAD_SIGN = 'VIEW/UPLOAD_SIGN';
export const UPLOAD_SIGN_SUCCESS = 'VIEW/UPLOAD_SIGN_SUCCESS';
export const INIT_JOB_PHOTOS_AND_SIGN = 'VIEW/INIT_JOB_PHOTOS_AND_SIGN';
export const GET_DRIVER_NOTES = 'VIEW/GET_DRIVER_NOTES';
export const GET_DRIVER_NOTES_SUCCESS = 'VIEW/GET_DRIVER_NOTES_SUCCESS';
export const GET_DRIVER_NOTES_BY_PAGE = 'VIEW/GET_DRIVER_NOTES_BY_PAGE';
export const GET_DRIVER_NOTES_BY_PAGE_SUCCESS = 'VIEW/GET_DRIVER_NOTES_BY_PAGE_SUCCESS';
export const SET_IS_REQUIRED_UPDATE_TAB = 'VIEW/SET_IS_REQUIRED_UPDATE_TAB';

export const actionCreators = {
  setCoreScreenInfo: createAction(SET_CORE_SCREEN_INFO),
  uploadPhotos: createAction(UPLOAD_PHOTOS),
  uploadPhotosSuccess: createAction(UPLOAD_PHOTOS_SUCCESS),
  uploadSign: createAction(UPLOAD_SIGN),
  uploadSignSuccess: createAction(UPLOAD_SIGN_SUCCESS),
  initJobPhotosAndSign: createAction(INIT_JOB_PHOTOS_AND_SIGN),
  getDriverNotes: createAction(GET_DRIVER_NOTES),
  getDriverNotesSuccess: createAction(GET_DRIVER_NOTES_SUCCESS),
  getDriverNotesByPage: createAction(GET_DRIVER_NOTES_BY_PAGE),
  getDriverNotesByPageSuccess: createAction(GET_DRIVER_NOTES_BY_PAGE_SUCCESS),
  setIsRequiredUpdateTab: createAction(SET_IS_REQUIRED_UPDATE_TAB),
};

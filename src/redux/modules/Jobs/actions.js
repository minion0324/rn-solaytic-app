import { createAction } from 'redux-actions';

export const GET_JOBS_SUCCESS = 'JOBS/GET_JOBS_SUCCESS';
export const GET_JOBS_BY_DATE = 'JOBS/GET_JOBS_BY_DATE';
export const GET_JOBS_BY_DATE_SUCCESS = 'JOBS/GET_JOBS_BY_DATE_SUCCESS';
export const GET_JOBS_BY_PAGE = 'JOBS/GET_JOBS_BY_PAGE';
export const GET_JOBS_BY_PAGE_SUCCESS = 'JOBS/GET_JOBS_BY_PAGE_SUCCESS';
export const GET_ALERTS_SUCCESS = 'JOBS/GET_ALERTS_SUCCESS';
export const GET_ALERTS_BY_DATE = 'JOBS/GET_ALERTS_BY_DATE';
export const GET_ALERTS_BY_DATE_SUCCESS = 'JOBS/GET_ALERTS_BY_DATE_SUCCESS';
export const GET_ALERTS_BY_PAGE = 'JOBS/GET_ALERTS_BY_PAGE';
export const GET_ALERTS_BY_PAGE_SUCCESS = 'JOBS/GET_ALERTS_BY_PAGE_SUCCESS';
export const SET_FOCUSED_JOB_ID = 'JOBS/SET_FOCUSED_JOB_ID';
export const ACKNOWLEDGE_JOBS = 'JOBS/ACKNOWLEDGE_JOBS';
export const ACKNOWLEDGE_JOBS_SUCCESS = 'JOBS/ACKNOWLEDGE_JOBS_SUCCESS';

export const actionCreators = {
  getJobsSuccess: createAction(GET_JOBS_SUCCESS),
  getJobsByDate: createAction(GET_JOBS_BY_DATE),
  getJobsByDateSuccess: createAction(GET_JOBS_BY_DATE_SUCCESS),
  getJobsByPage: createAction(GET_JOBS_BY_PAGE),
  getJobsByPageSuccess: createAction(GET_JOBS_BY_PAGE_SUCCESS),
  getAlertsSuccess: createAction(GET_ALERTS_SUCCESS),
  getAlertsByDate: createAction(GET_ALERTS_BY_DATE),
  getAlertsByDateSuccess: createAction(GET_ALERTS_BY_DATE_SUCCESS),
  getAlertsByPage: createAction(GET_ALERTS_BY_PAGE),
  getAlertsByPageSuccess: createAction(GET_ALERTS_BY_PAGE_SUCCESS),
  setFocusedJobId: createAction(SET_FOCUSED_JOB_ID),
  acknowledgeJobs: createAction(ACKNOWLEDGE_JOBS),
  acknowledgeJobsSuccess: createAction(ACKNOWLEDGE_JOBS_SUCCESS),
};

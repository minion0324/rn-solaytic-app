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
export const START_JOBS = 'JOBS/START_JOBS';
export const START_JOBS_SUCCESS = 'JOBS/START_JOBS_SUCCESS';
export const EXCHANGE_JOBS = 'JOBS/EXCHANGE_JOBS';
export const EXCHANGE_JOBS_SUCCESS = 'JOBS/EXCHANGE_JOBS_SUCCESS';
export const COMPLETE_JOBS = 'JOBS/COMPLETE_JOBS';
export const COMPLETE_JOBS_SUCCESS = 'JOBS/COMPLETE_JOBS_SUCCESS';
export const FAIL_JOBS = 'JOBS/FAIL_JOBS';
export const FAIL_JOBS_SUCCESS = 'JOBS/FAIL_JOBS_SUCCESS';

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
  startJobs: createAction(START_JOBS),
  startJobsSuccess: createAction(START_JOBS_SUCCESS),
  exchangeJobs: createAction(EXCHANGE_JOBS),
  exchangeJobsSuccess: createAction(EXCHANGE_JOBS_SUCCESS),
  completeJobs: createAction(COMPLETE_JOBS),
  completeJobsSuccess: createAction(COMPLETE_JOBS_SUCCESS),
  failJobs: createAction(FAIL_JOBS),
  failJobsSuccess: createAction(FAIL_JOBS_SUCCESS),
};

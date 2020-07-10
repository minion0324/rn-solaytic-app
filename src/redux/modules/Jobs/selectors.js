import { createSelector } from 'reselect';

const getJobsStore = state => state.Jobs;

const getAllJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.allJobs || [];
  },
);

const getCountOfJobs = createSelector(
  getAllJobs,
  (allJobs) => {
    return allJobs.length;
  },
);

const getPageOfJobs = createSelector(
  getCountOfJobs,
  (countOfJobs) => {
    return Math.floor(countOfJobs / 10 + 1);
  },
);

const getDateForJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.dateForJobs;
  },
);

const getAllAlerts = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.allAlerts || [];
  },
);

const getCountOfAlerts = createSelector(
  getAllAlerts,
  (allAlerts) => {
    return allAlerts.length;
  },
);

const getPageOfAlerts = createSelector(
  getCountOfAlerts,
  (countOfAlerts) => {
    return Math.floor(countOfAlerts / 10 + 1);
  },
);

const getDateForAlerts = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.dateForAlerts;
  },
);

const getFocusedJobId = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.focusedJobId;
  },
);

const getFocusedJob = createSelector(
  getFocusedJobId,
  getAllJobs,
  getAllAlerts,
  (focusedJobId, allJobs, allAlerts) => {
    const focusedJob =
      allAlerts.find(item => item.jobId === focusedJobId) || allJobs.find(item => item.jobId === focusedJobId);

    console.log('focusedJob ------');
    console.log(focusedJob);

    return focusedJob;
  },
);

export default {
  getAllJobs,
  getCountOfJobs,
  getPageOfJobs,
  getDateForJobs,
  getAllAlerts,
  getCountOfAlerts,
  getPageOfAlerts,
  getDateForAlerts,
  getFocusedJob,
};

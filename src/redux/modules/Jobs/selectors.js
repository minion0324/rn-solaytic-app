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

const getFocusedJob = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.focusedJob || {};
  },
);

const getFocusedJobId = createSelector(
  getFocusedJob,
  (focusedJob) => {
    return focusedJob.jobId;
  },
);

const getJobStatus = createSelector(
  getFocusedJob,
  (focusedJob) => {
    try {
      return focusedJob.status.jobStatusName || '';
    } catch (error) {
      return '';
    }
  },
);

const getPhotosAndSign = createSelector(
  getFocusedJob,
  (focusedJob) => {
    try {
      const lastAttempt = focusedJob.attempts[focusedJob.attempts.length - 1];

      return {
        photos: lastAttempt.jobPhotos.map((item) => {
          return { uri: item.photoUrl };
        }),
        sign: { uri: lastAttempt.signatureUrl },
        signedUserName: lastAttempt.signedUserName,
        signedUserContact: lastAttempt.signedUserContact,
      };
    } catch (error) {
      return {
        photos: [],
        sign: { uri: null },
        signedUserName: '',
        signedUserContact: '',
      };
    }
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
  getFocusedJobId,
  getJobStatus,
  getPhotosAndSign,
};

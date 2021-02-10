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

const getPhotosAndSigns = createSelector(
  getFocusedJob,
  (focusedJob) => {
    try {
      const lastAttempt = focusedJob.attempts[focusedJob.attempts.length - 1];

      return {
        photos: lastAttempt.jobPhotos.map((item) => {
          return {
            jobStepId: item.jobStepId,
            uri: item.photoUrl,
          };
        }),
        signs: lastAttempt.jobSignatures.map((item) => {
          return {
            jobStepId: item.jobStepId,
            uri: item.jobSignatureUrl,
            signedUserName: item.jobSignedUserName,
            signedUserContact: item.JobSignedUserContact,
          }
        }),
      };
    } catch (error) {
      return { photos: [], signs: [] };
    }
  },
);

const getJobReceiptSetting = createSelector(
  getFocusedJob,
  (focusedJob) => {
    try {
      return focusedJob.receiptSetting.accountDocSettingVariables || [];
    } catch (error) {
      return [];
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
  getPhotosAndSigns,
  getJobReceiptSetting,
};

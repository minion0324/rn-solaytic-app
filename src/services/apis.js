import {
  JOB_DATE,
} from 'src/constants';

import {
  apiCall,
} from './apiInstance';

function apiLogin(userName, password, persistToken) {
  return apiCall('api/mobile/driver/login', 'post', {
    data: {
      userName,
      password,
      persistToken,
    },
  });
};

function apiAuthToken() {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {
    data: {},
  });
};

function apiSetFCMToken(deviceToken) {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {
    data: {
      deviceToken,
    },
  });
}

function apiGetJobs(
  fromDate,
  toDate,
  isAssigned,
  currentPage = 1,
  pageSize = 10,
  sortColumn = JOB_DATE,
  sortDir = 'asc',
  jobTypeFilter = '',
  jobStatusFilter = '',
) {
  return apiCall('api/mobile/driver/jobs', 'get', {
    params: {
      fromDate,
      toDate,
      isAssigned,
      currentPage,
      pageSize,
      sortColumn,
      sortDir,
      jobTypeFilter,
      jobStatusFilter,
    },
  });
};

function apiAcknowledgeJobs(jobIds) {
  return apiCall('api/mobile/driver/jobs/acknowledge', 'post', {
    data: {
      jobIds,
    },
  });
};

function apiStartJobs(jobIds, stepBinUpdate, pricings) {
  return apiCall('api/mobile/driver/jobs/start', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
    },
  });
};

function apiPullJobs(jobIds, stepBinUpdate, pricings) {
  return apiCall('api/mobile/driver/jobs/pull', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
    },
  });
};

function apiExchangeJobs(jobIds, stepBinUpdate, pricings) {
  return apiCall('api/mobile/driver/jobs/exchange', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
    },
  });
};

function apiCompleteJobs(jobIds, stepBinUpdate, pricings, attempt) {
  return apiCall('api/mobile/driver/jobs/Complete', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      attempt,
    },
  });
};

function apiGetDriverNotes(
  searchQuery = '',
  currentPage = 1,
  pageSize = 10,
  sortColumn = '', // 'driverNoteId',
  sortDir = 'asc',
) {
  return apiCall('api/mobile/driver/notes', 'get', {
    params: {
      searchQuery,
      currentPage,
      pageSize,
      sortColumn,
      sortDir,
    },
  });
};

function apiFailJobs(jobIds, attempt) {
  return apiCall('api/mobile/driver/jobs/fail', 'post', {
    data: {
      jobIds,
      attempt,
    },
  });
};

function apiGetJobById(jobId) {
  return apiCall(`api/mobile/driver/jobs/${jobId}`, 'get', {});
};

function apiMarkMessagesAsRead(jobId) {
  return apiCall('api/mobile/driver/jobs/mark-messages-as-read', 'post', {
    data: {
      jobId,
    },
  });
};

function apiAddMessage(jobId, message) {
  return apiCall('api/mobile/driver/jobs/add-message', 'post', {
    data: {
      jobId,
      message,
    },
  });
};

function apiUpdateAmountCollected(jobIds, attempt) {
  return apiCall('api/mobile/driver/jobs/update-amount-collected', 'post', {
    data: {
      jobIds,
      attempt,
    },
  });
};

function apiGetBinNumbers(
  searchQuery,
  currentPage = 1,
  pageSize = 10,
) {
  return apiCall('api/mobile/driver/bin-numbers', 'get', {
    params: {
      searchQuery,
      currentPage,
      pageSize,
    },
  });
};

export {
  apiLogin,
  apiAuthToken,
  apiSetFCMToken,
  apiGetJobs,
  apiAcknowledgeJobs,
  apiStartJobs,
  apiPullJobs,
  apiExchangeJobs,
  apiCompleteJobs,
  apiGetDriverNotes,
  apiFailJobs,
  apiGetJobById,
  apiMarkMessagesAsRead,
  apiAddMessage,
  apiUpdateAmountCollected,
  apiGetBinNumbers,
};

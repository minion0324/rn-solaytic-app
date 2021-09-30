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

function apiSetFCMToken(
  deviceToken,
  deviceType,
  deviceId,
  deviceManufacturer,
  deviceModel,
  appVersion,
) {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {
    data: {
      deviceToken,
      deviceType,
      deviceId,
      deviceManufacturer,
      deviceModel,
      appVersion,
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

function apiStartJobs(
  jobIds,
  stepBinUpdate,
  pricings,
  amountCollected,
  jobPaymentType,
  attempt,
) {
  return apiCall('api/mobile/driver/jobs/start', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      jobPaymentType,
      attempt,
    },
  });
};

function apiPullJobs(
  jobIds,
  stepBinUpdate,
  pricings,
  amountCollected,
  jobPaymentType,
  attempt,
) {
  return apiCall('api/mobile/driver/jobs/pull', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      jobPaymentType,
      attempt,
    },
  });
};

function apiShiftJobs(
  jobIds,
  stepBinUpdate,
  pricings,
  amountCollected,
  jobPaymentType,
  attempt,
) {
  return apiCall('api/mobile/driver/jobs/shift', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      jobPaymentType,
      attempt,
    },
  });
};

function apiExchangeJobs(
  jobIds,
  stepBinUpdate,
  pricings,
  amountCollected,
  jobPaymentType,
  attempt,
) {
  return apiCall('api/mobile/driver/jobs/exchange', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      jobPaymentType,
      attempt,
    },
  });
};

function apiCompleteJobs(
  jobIds,
  stepBinUpdate,
  pricings,
  amountCollected,
  jobPaymentType,
  attempt,
) {
  return apiCall('api/mobile/driver/jobs/Complete', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      jobPaymentType,
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

function apiGetJobDates(
  isAssigned = false,
) {
  return apiCall('api/mobile/driver/job-dates', 'get', {
    params: {
      isAssigned,
    },
  });
};

function apiGetWasteTypes(
  searchQuery = '',
  currentPage = 1,
  binTypeId = '',
  customerSiteId = '',
  pageSize = 9999,
  sortColumn = '',
  sortDir = 'asc',
) {
  return apiCall('api/mobile/driver/wastetype', 'get', {
    params: {
      searchQuery,
      currentPage,
      pageSize,
      sortColumn,
      sortDir,
      binTypeId,
      customerSiteId
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
  apiShiftJobs,
  apiExchangeJobs,
  apiCompleteJobs,
  apiGetDriverNotes,
  apiFailJobs,
  apiGetJobById,
  apiMarkMessagesAsRead,
  apiAddMessage,
  apiGetBinNumbers,
  apiGetJobDates,
  apiGetWasteTypes,
};

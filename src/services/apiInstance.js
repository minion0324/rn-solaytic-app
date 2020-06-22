import axios from 'axios';

const API_BASE_URL = 'https://staging-tms-dispatch.logisfleet.com/';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

function setAuthToken(token) {
  apiInstance.defaults.headers.common.Authorization = token;
};

function removeAuthToken() {
  delete apiInstance.defaults.headers.common.Authorization;
}

async function apiCall(url, method, { data }) {
  try {
    return await apiInstance.request({ url, method, data });
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  setAuthToken,
  removeAuthToken,
  apiCall,
};

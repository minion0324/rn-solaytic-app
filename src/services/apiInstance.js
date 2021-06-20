import axios from 'axios';

import {
  API_BASE_URL,
} from 'src/constants';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-version': '3.2',
  },
  timeout: 12000,
});

function setAuthToken(token) {
  apiInstance.defaults.headers.common.Authorization = token;
};

function removeAuthToken() {
  delete apiInstance.defaults.headers.common.Authorization;
}

async function apiCall(url, method, { data, params }) {
  try {
    return await apiInstance.request({ url, method, data, params });
  } catch (error) {
    console.log(error);
    console.log(error.response);

    return Promise.reject(error);
  }
};

export {
  setAuthToken,
  removeAuthToken,
  apiCall,
};

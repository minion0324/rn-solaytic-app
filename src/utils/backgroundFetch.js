import { Alert } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import RNRestart from 'react-native-restart';

import {
  getTimestamp,
  getUpdatedBinInfo,
  getUpdatedServices,
  addItemToCache,
  removeItemFromCache,
  getCacheItems,
} from 'src/utils';
import {
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
  BACKGROUND_FETCH_KEY,
  API_BASE_URL,
} from 'src/constants';

//
const fetchCompleteJobs = async (token, jobIds, binInfo, services, attempt) => {
  try {
    const stepBinUpdate = getUpdatedBinInfo(binInfo);
    const pricings = getUpdatedServices(services);

    const response = await fetch(
      `${API_BASE_URL}api/mobile/driver/jobs/Complete`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          jobIds, stepBinUpdate, pricings, attempt,
        }),
      }
    );

    const data = await response.json();

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

//
const fetchHandler = async () => {
  console.log('----- fetch handler');

  try {
    const fetches = await getCacheItems(BACKGROUND_FETCH_KEY);

    if (fetches.length === 0) {
      BackgroundFetch.finish(taskId);
    }

    let count = 0;
    await Promise.all(
      fetches.map(async (data) => {
        try {
          const { id, value: { token, fetchData } } = data;

          await fetchCompleteJobs(token, ...fetchData);

          await removeItemFromCache(BACKGROUND_FETCH_KEY, id);

          await addItemToCache(COMPLETE_JOBS_KEY, id, {
            timestamp: getTimestamp(),
            status: JOB_STATUS.COMPLETED,
          });

          count = count + 1;
        } catch (e) {
          //
          console.log('----- e');
          console.log(e);
          console.log(e.response);
        }

        return Promise.resolve();
      })
    );

    if (!count) {
      return;
    }

    Alert.alert(
      'Alert',
      'The background process is completed. ' +
      'You need to restart the app to sync your data. Would you like to restart the app now?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          onPress: () => RNRestart.Restart(),
        },
      ],
      { cancelable: false },
    );
  } catch (err) {
    console.log('----- err');
    console.log(err);
    console.log(err.response);
  }
};

const errorHandler = (error) => {
  console.log('----- error handler');
  console.log(error);
};

//
export const headlessTask = () => {
  BackgroundFetch.registerHeadlessTask(fetchHandler);
};

export const backgroundFetch = async (token, fetchInfo, fetchData) => {
  try {
    await addItemToCache(BACKGROUND_FETCH_KEY, fetchInfo, {
      token,
      fetchData,
    });

    await addItemToCache(COMPLETE_JOBS_KEY, fetchInfo, {
      timestamp: getTimestamp(),
      status: 'Uploading... \n(In Background)',
    });

    const options = {
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    };

    BackgroundFetch.configure(options, fetchHandler, errorHandler);
  } catch (error) {
    //
  }
};

import { Alert, Linking } from 'react-native';
import moment from 'moment';

import {
  APP_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
} from 'src/constants';

async function openUrl(url) {
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert('Warning', 'Something went wrong.');
    return;
  }

  Linking.openURL(url);
}

function delay(milliseconds) {
  return new Promise((rs) => setTimeout(rs, milliseconds));
}

function getDate(date) {
  return moment(date).format(APP_DATE_FORMAT);
};

function getStartDate(date, key, format) {
  return moment(date, format || APP_DATE_FORMAT)
    .startOf(key)
    .format(DEFAULT_DATE_FORMAT);
};

function getEndDate(date, key, format) {
  return moment(date, format || APP_DATE_FORMAT)
    .endOf(key)
    .format(DEFAULT_DATE_FORMAT);
};

export {
  openUrl,
  delay,
  getDate,
  getStartDate,
  getEndDate,
};

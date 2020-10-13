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
};

function delay(milliseconds) {
  return new Promise((rs) => setTimeout(rs, milliseconds));
};

function getTimestamp() {
  return moment().format('x');
};

function getDate(date, format) {
  return moment(date).format(format || APP_DATE_FORMAT);
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

//
function getUpdatedBinInfo(binInfo) {
  return [0, 1].map((index) => {
    const {
      jobStepId, wasteType, binType, binNumber, binWeight,
    } = binInfo[index];

    return {
      jobStepId: jobStepId,
      wasteTypeId: wasteType && wasteType.wasteTypeId,
      binTypeId: binType && binType.binTypeId,
      binNumber: binNumber,
      binWeight: binWeight,
    }
  });
};

function getUpdatedServices(services) {
  return services.reduce((result, item) => {
    if (item.isSelected) {
      result.push({
        ...item,
        quantity: item.quantity || 1,
      })
    }

    return result;
  }, []);
};

export {
  openUrl,
  delay,
  getTimestamp,
  getDate,
  getStartDate,
  getEndDate,

  getUpdatedBinInfo,
  getUpdatedServices,
};

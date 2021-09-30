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

function numberWithCommas(x) {
  if (x) {
      let parts = x.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join('.');
  } else {
      return '0';
  }
}

//
function getUpdatedBinInfo(binInfo) {
  return [0, 1].map((index) => {
    const {
      jobStepId,
      wasteType,
      binType,
      binNumber,
      binWeight,
      wasteTypes,
    } = binInfo[index];

    return {
      jobStepId: jobStepId,
      wasteTypeId: wasteType && wasteType.wasteTypeId,
      binTypeId: binType && binType.binTypeId,
      binNumber: binNumber,
      binWeight: binWeight,
      wasteTypes: wasteTypes,
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

//
function getCustomerSiteAddress(customerSite) {
  if (!customerSite) {
    return '';
  }

  let address = ''

  const {
    siteName, blockNo, street, unitNo, postalCode,
  } = customerSite;

  if (siteName) {
    address = siteName;
  }

  if (blockNo || street || unitNo || postalCode) {
    address += ' (';
  }

  if (blockNo) {
    address += `Block ${blockNo}`;

    if (street || unitNo || postalCode) {
      address += ', ';
    }
  }

  if (street) {
    address += street;

    if (unitNo || postalCode) {
      address += ', ';
    }
  }

  if (unitNo) {
    address += `Unit No. ${unitNo}`;

    if (postalCode) {
      address += ', ';
    }
  }

  if (postalCode) {
    address += `Post Code ${postalCode}`;
  }

  if (blockNo || street || unitNo || postalCode) {
    address += ')';
  }

  return address;
};

export {
  openUrl,
  delay,
  getTimestamp,
  getDate,
  getStartDate,
  getEndDate,
  numberWithCommas,

  getUpdatedBinInfo,
  getUpdatedServices,

  getCustomerSiteAddress,
};

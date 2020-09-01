import { Alert } from 'react-native';

function onError(error) {
  let message = 'Something went wrong.';
  try {
    const responseData = error.response.data;

    if (typeof responseData === 'string') {
      message = responseData;
    }
  } catch (err) {
    //
  }
  Alert.alert('Warning', message);
}

export {
  onError,
};

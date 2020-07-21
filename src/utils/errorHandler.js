import { Alert } from 'react-native';

function onError(error) {
  let message = 'Something went wrong.';
  try {
    message = error.response.data;
  } catch (err) {
    //
  }
  Alert.alert('Warning', message);
}

export {
  onError,
};

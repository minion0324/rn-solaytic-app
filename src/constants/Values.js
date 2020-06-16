import {
  Platform,
  Dimensions,
} from 'react-native';

//
const PLATFORM = Platform.OS;

//
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

//
const COMMON_SIZE = WIDTH * 0.278;
const COMMON_PADDING = WIDTH * 0.028;

export {
  PLATFORM,
  WIDTH,
  HEIGHT,
  COMMON_SIZE,
  COMMON_PADDING,
};

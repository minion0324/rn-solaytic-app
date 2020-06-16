import {
  Platform,
  Dimensions,
} from 'react-native';

//
const PLATFORM = Platform.OS;

//
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

//
const MAIN_PADDING = WIDTH * 0.045;

export {
  PLATFORM,
  WIDTH,
  HEIGHT,
  MAIN_PADDING,
};

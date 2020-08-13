import {
  COLORS,
  SIZE2,
  FONT,
} from 'src/constants';

const TabBarStyle = {
  paddingTop: 0,
  backgroundColor: COLORS.WHITE1,
  elevation: 0,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.WHITE4,
  marginTop: SIZE2,
  marginHorizontal: SIZE2,
};

const TabBarIndicatorStyle = {
  height: 3,
  backgroundColor: COLORS.BLUE1,
};

const TabBarLabelStyle = {
  fontSize: FONT(15),
};

const TabBarActiveColor = COLORS.BLACK2;

const TabBarInactiveColor = COLORS.BLACK2;

export {
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
};

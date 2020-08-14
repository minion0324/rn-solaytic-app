import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE6,
  FONT,
} from 'src/constants';

const TabBarBadge = styled.View`
  width: ${SIZE2}px;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.RED1};
  top: ${SIZE2}px;
  right: ${SIZE6}px;
`;

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
  TabBarBadge,
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
};

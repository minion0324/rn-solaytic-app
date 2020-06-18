import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const DateBar = styled.View`
  width: ${COMMON_SIZE * 2}px;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.WHITE1};
  padding-vertical: 3px;
  margin-top: ${COMMON_PADDING * 2}px;
  margin-bottom: ${COMMON_PADDING}px;
`;

const DateBarText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
  text-transform: uppercase;
`;

export {
  DateBar,
  DateBarText,
};

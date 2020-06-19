import styled from 'styled-components';

import {
  COLORS,
  SIZE40,
  SIZE2,
  SIZE4,
  FONT,
} from 'src/constants';

const DateBar = styled.View`
  width: ${SIZE40}px;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.WHITE1};
  padding-vertical: 3px;
  margin-top: ${SIZE4}px;
  margin-bottom: ${SIZE2}px;
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

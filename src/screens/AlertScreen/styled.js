import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const HelloText = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 500;
  color: ${COLORS.WHITE1};
`;

export {
  HelloText,
};

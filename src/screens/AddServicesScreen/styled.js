import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE6,
  SIZE8,
  FONT,
} from 'src/constants';

const ServiceRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
`;

export {
  ServiceRow,
};
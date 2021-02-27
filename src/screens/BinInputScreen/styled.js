import styled from 'styled-components';

import {
  COLORS,
  FONT,
} from 'src/constants';

const BinInput = styled.TextInput`
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

export {
  BinInput,
};
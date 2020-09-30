import styled from 'styled-components';

import {
  COLORS,
  FONT,
  SIZE2,
} from 'src/constants';

const BinInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

const BinSearch = styled.TouchableOpacity`
  padding-left: ${SIZE2}px;
  padding-vertical: ${SIZE2}px;
`;

export {
  BinInput,
  BinSearch,
};

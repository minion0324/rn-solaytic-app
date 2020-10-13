import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  FONT,
} from 'src/constants';

const BinBorder = styled.View`
  height: 0px;
  border-top-width: 1px;
  border-color: ${COLORS.GRAY2};
`;

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
  BinBorder,
  BinInput,
  BinSearch,
};

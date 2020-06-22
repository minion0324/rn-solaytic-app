import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  FONT,
} from 'src/constants';

const Wrap = styled.View`
  height: ${SIZE8}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.WHITE2};
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  height: ${SIZE2}px;
  border-radius: ${SIZE1}px;
  margin-horizontal: ${SIZE2}px;
  background-color: ${props => props.color};
`;

export {
  Wrap,
  Tab,
};

import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  SIZE10,
  FONT,
} from 'src/constants';

const TabWrap = styled.View`
  height: ${SIZE8}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-vertical: ${SIZE2}px;
`;

const TabItem = styled.TouchableOpacity`
  width: ${SIZE10}px;
  align-items: center;
  border-bottom-width: 3px;
  border-color: ${(props) => (
    props.selected
    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
  )};
  padding-vertical: ${SIZE1}px;
`;

const TabText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  text-transform: uppercase;
`;

export {
  TabWrap,
  TabItem,
  TabText,
};

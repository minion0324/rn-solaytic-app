import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  FONT,
} from 'src/constants';

const Item = styled.View`
  padding: ${SIZE2}px;
  margin-top: 1px;
  margin-horizontal: ${SIZE2}px;
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.WHITE1};
`;

const ItemText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${props => props.color || COLORS.BLACK2};
`;

const StatusWrap = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RetryButton = styled.TouchableOpacity`
  padding: ${SIZE1}px;
  margin-left: ${SIZE2}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${COLORS.GRAY3};
`;

export {
  Item,
  ItemText,
  StatusWrap,
  RetryButton,
};

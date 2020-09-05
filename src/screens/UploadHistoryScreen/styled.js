import styled from 'styled-components';

import {
  COLORS,
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

export {
  Item,
  ItemText,
};

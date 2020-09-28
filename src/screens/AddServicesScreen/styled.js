import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE3,
  SIZE8,
  SIZE12,
  FONT,
} from 'src/constants';

const ServiceItem = styled.View`
  height: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${SIZE3}px;
  background-color: ${COLORS.WHITE1};
`;

const ServiceText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const IconButton = styled.TouchableOpacity`
  padding: ${SIZE1}px;
`;

const QuantityWrap = styled.View`
  width: ${SIZE8}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE3};
  border-radius: ${SIZE1}px;
  margin-horizontal: ${SIZE1}px;
`;

export {
  ServiceItem,
  ServiceText,
  IconButton,
  QuantityWrap,
};

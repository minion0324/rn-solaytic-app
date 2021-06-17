import styled from 'styled-components';

import {
  COLORS,
  SIZE3,
  SIZE12,
  FONT,
} from 'src/constants';

const WasteTypeItem = styled.View`
  height: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${SIZE3}px;
  background-color: ${COLORS.WHITE1};
`;

const WasteTypeText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const WasteTypeGreyText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  font-style: italic
  color: ${COLORS.GRAY1};
`;

export {
  WasteTypeItem,
  WasteTypeText,
  WasteTypeGreyText
};

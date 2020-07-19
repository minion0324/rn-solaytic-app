import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE6,
  SIZE12,
  FONT,
} from 'src/constants';

const ButtonWrap = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${SIZE2}px;
  padding-horizontal: ${SIZE6}px;
  background-color: ${COLORS.WHITE2};
`;

const DriverNoteItem = styled.View`
  height: ${SIZE12}px;
  justify-content: center;
  padding-horizontal: ${SIZE2}px;
`;

const DriverNoteText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

export {
  ButtonWrap,
  DriverNoteItem,
  DriverNoteText,
}

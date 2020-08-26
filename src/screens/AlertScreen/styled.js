import styled from 'styled-components';

import {
  COLORS,
  HEIGHT,
  SIZE4,
  SIZE6,
  SIZE8,
  FONT,
} from 'src/constants';

const ButtonWrap = styled.View`
  height: ${SIZE8}px;
  padding-horizontal: ${SIZE6}px;
  background-color: ${COLORS.WHITE1};
`;

const NoAlertsWrap = styled.View`
  align-self: center;
  position: absolute;
  top: ${HEIGHT * 0.15}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE2};
`;

const NoAlertsText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  text-align: center;
`;

const NoAlertsIcon = styled.View`
  margin-vertical: ${SIZE4}px;
`;

export {
  ButtonWrap,
  NoAlertsWrap,
  NoAlertsText,
  NoAlertsIcon,
};

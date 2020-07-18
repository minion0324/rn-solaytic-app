import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE6,
} from 'src/constants';

const ButtonWrap = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${SIZE2}px;
  padding-horizontal: ${SIZE6}px;
  background-color: ${COLORS.WHITE2};
`;

export {
  ButtonWrap,
}

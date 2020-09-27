import styled from 'styled-components';

import {
  SIZE2,
  SIZE4,
  SIZE8,
} from 'src/constants';

const IconWrap = styled.View`
  width: ${SIZE8}px;
  align-items: center;
`;

const ButtonWrap = styled.View`
  flex-direction: row;
  margin-right: ${SIZE4}px;
  margin-vertical: ${SIZE2}px;
`;

export {
  IconWrap,
  ButtonWrap,
};

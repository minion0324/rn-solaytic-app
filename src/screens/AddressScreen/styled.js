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
  padding-vertical: ${SIZE2}px;
  padding-right: ${SIZE4}px;
`;

export {
  IconWrap,
  ButtonWrap,
};

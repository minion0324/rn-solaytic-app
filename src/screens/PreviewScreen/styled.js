import styled from 'styled-components';

import {
  SIZE4,
} from 'src/constants';

const HalfWrap = styled.View`
  width: 100%;
  aspect-ratio: 2;
  justify-content: center;
  padding: ${SIZE4}px;
`;

const LogoImageWrap = styled.View`
  width: 100%;
  aspect-ratio: 1;
`;

export {
  HalfWrap,
  LogoImageWrap,
};

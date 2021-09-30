import styled from 'styled-components';

import {
  SIZE4,
  SIZE5,
  SIGNATURE_WRAP_RATIO,
} from 'src/constants';

const SignatureWrap = styled.View`
  width: 300px;
  height: 300px;
  aspect-ratio: ${SIGNATURE_WRAP_RATIO};
  justify-content: center;
  padding: ${SIZE4}px;
`;

const LogoImageWrap = styled.View`
  width: 100%;
  aspect-ratio: 2;
  padding-horizontal: ${SIZE5}px;
`;

export {
  SignatureWrap,
  LogoImageWrap,
};

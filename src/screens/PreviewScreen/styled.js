import styled from 'styled-components';

import {
  SIZE4,
  SIGNATURE_WRAP_RATIO,
} from 'src/constants';

const SignatureWrap = styled.View`
  width: 100%;
  aspect-ratio: ${SIGNATURE_WRAP_RATIO};
  justify-content: center;
  padding: ${SIZE4}px;
`;

const LogoImageWrap = styled.View`
  width: 100%;
  aspect-ratio: 1;
`;

export {
  SignatureWrap,
  LogoImageWrap,
};

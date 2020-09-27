import styled from 'styled-components';

import {
  SIZE3,
  SIZE4,
  SIZE8,
} from 'src/constants';

const IconWrap = styled.View`
  width: ${SIZE8}px;
  align-items: center;
`;

const ButtonWrap = styled.View`
  align-items: ${(props) => (
    props.forCenter ? 'center' : 'flex-start'
  )};
  margin-right: ${SIZE4}px;
  margin-vertical: ${SIZE3}px;
`;

export {
  IconWrap,
  ButtonWrap,
};

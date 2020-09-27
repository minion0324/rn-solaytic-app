import styled from 'styled-components';

import {
  COLORS,
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

const Location1Line = styled.View`
  height: 50%;
  top: 60%;
  left: ${SIZE8 - 1}px;
  position: absolute;
  border-width: 0.5px;
  border-color: ${COLORS.GRAY3};
`;

const Location2Line = styled.View`
  height: 100%;
  top: 0%;
  left: ${SIZE8 - 1}px;
  position: absolute;
  border-width: 0.5px;
  border-color: ${COLORS.GRAY3};
`;

const Location3Line = styled.View`
  height: 50%;
  top: 0%;
  left: ${SIZE8 - 1}px;
  position: absolute;
  border-width: 0.5px;
  border-color: ${COLORS.GRAY3};
`;

export {
  IconWrap,
  ButtonWrap,
  Location1Line,
  Location2Line,
  Location3Line,
};

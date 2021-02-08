import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  FONT,
} from 'src/constants';

const DriverNoteBadge = styled.View`
  width: ${SIZE2}px;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.RED1};
  margin-left: ${SIZE1}px;
  margin-top: -${SIZE1}px;
`;

const BinWrap = styled.View`
  margin-left: ${SIZE2}px;
  margin-right: ${SIZE2}px;
  border-width: 1px;
  border-color: ${(props) => (
    props.active
    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
  )};
`;

const BinInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

const PhotoWrap = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE5};
`;

const SignWrap = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1.5;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE5};
`;

export {
  DriverNoteBadge,
  BinWrap,
  BinInput,
  PhotoWrap,
  SignWrap,
};

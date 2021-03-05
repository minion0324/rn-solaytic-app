import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE6,
  SIZE8,
  FONT,
} from 'src/constants';

const DriverMessageBadge = styled.View`
  width: ${SIZE2}px;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.RED1};
  margin-left: ${SIZE2}px;
  margin-top: -${SIZE1}px;
`;

const BinInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

const BinInputWrap = styled.View`
  min-height: ${(props) => (
    props.effect ? SIZE8 : 0
  )}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${(props) => (
    props.effect ? 3 : 0
  )}px;
  padding-horizontal: ${(props) => (
    props.effect ? SIZE2 : 0
  )}px;
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${props => props.color};
  background-color: ${(props) => (
    props.effect ? COLORS.WHITE5 : COLORS.WHITE1
  )};
`;

const PhotoWrap = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE5};
  overflow: hidden;
`;

const SignWrap = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1.5;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE5};
  overflow: hidden;
`;

const PhotoModalButtonsWrap = styled.View`
  position: absolute;
  bottom: ${SIZE6}px;
  left: 0px;
  right: 0px;
  padding-horizontal: ${SIZE6}px;
`;

const PrintReceiptButton = styled.TouchableOpacity`
  height: ${SIZE6}px;
  padding-horizontal: ${SIZE2}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${props => props.color};
  background-color: ${COLORS.WHITE1};
`;

export {
  DriverMessageBadge,
  BinInput,
  BinInputWrap,
  PhotoWrap,
  SignWrap,
  PhotoModalButtonsWrap,
  PrintReceiptButton,
};

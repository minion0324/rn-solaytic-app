import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE12,
  FONT,
} from 'src/constants';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.color || COLORS.WHITE2};
`;

const ShadowWrap = styled.View`
  elevation: 10;
  box-shadow: 0px 8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  background-color: ${COLORS.WHITE1};
`;

const LoadingWrap = styled.View`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE2};
`;

const FullImage = styled.Image`
  width: 100%;
  height: 100%;
`;

//
const SearchBarWrap = styled.View`
  width: 100%;
  height: ${SIZE12}px;
  padding: ${SIZE1}px;
  flex-direction: row;
  align-items: center;
`;

const SearchIconWrap = styled.View`
  padding-horizontal: ${SIZE2}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const FlexWrap = styled.View`
  flex: ${props => props.flex || 1};
`;

const SpaceView = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-top: ${props => props.mTop || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  margin-bottom: ${props => props.mBottom || 0}px;
`;

const OkCancelRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-vertical: ${SIZE1}px;
`;

const OkCancelButton = styled.TouchableOpacity`
  padding-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
`;

const OkCancelText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700,
  color: ${COLORS.BLUE1};
  text-transform: uppercase;
`;

export {
  Container,
  ShadowWrap,
  LoadingWrap,
  FullImage,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  FlexWrap,
  SpaceView,
  OkCancelRow,
  OkCancelButton,
  OkCancelText,
};

import React from 'react';
import styled from 'styled-components';
import Dash from 'react-native-dash';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE12,
  FONT,
} from 'src/constants';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const Content = styled.View`
  flex: 1;
  background-color: ${props => props.color || COLORS.WHITE2};
`;

const ContentWrap = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  padding-top: ${props => props.mTop || SIZE3}px;
  padding-horizontal: ${SIZE3}px;
  padding-bottom: ${SIZE3}px;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const BorderView = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  height: 0px;
  border-top-width: 1px;
  border-color: ${props => props.color || COLORS.GRAY2};
`;

const ShadowWrap = styled.View`
  elevation: 10;
  z-index: 1;
  box-shadow:
    0px ${(props) => (props.forUp ? '-' : '+')}8px;
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
  background-color: ${COLORS.WHITE2};
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

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
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

const CenteredWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LeftDash = styled(Dash)`
  flex-direction: column;
  left: 0px;
  top: ${props => props.dashLength || 4}px;
  bottom: ${props => props.dashLength || 4}px;
  position: absolute;
`;

const TopDash = styled(Dash)`
  left: ${props => props.dashLength || 4}px;
  top: 0px;
  right: ${props => props.dashLength || 4}px;
  position: absolute;
`;

const RightDash = styled(Dash)`
  flex-direction: column;
  top: ${props => props.dashLength || 4}px;
  right: 0px;
  bottom: ${props => props.dashLength || 4}px;
  position: absolute;
`;

const BottomDash = styled(Dash)`
  left: ${props => props.dashLength || 4}px;
  right: ${props => props.dashLength || 4}px;
  bottom: 0px;
  position: absolute;
`;

const BorderDash = ({ color, ...props }) => (
  <>
    <LeftDash dashColor={color} {...props} />
    <TopDash dashColor={color} {...props} />
    <RightDash dashColor={color} {...props} />
    <BottomDash dashColor={color} {...props} />
  </>
);

export {
  Container,
  Content,
  ContentWrap,
  BorderView,
  ShadowWrap,
  LoadingWrap,
  FullImage,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  RowWrap,
  FlexWrap,
  SpaceView,
  CenteredWrap,
  BorderDash,
};

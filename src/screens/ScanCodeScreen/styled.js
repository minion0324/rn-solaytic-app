import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
} from 'src/constants';

const { Scan1Icon, Scan2Icon } = SVGS;

const CameraWrap = styled.View`
  width: 70%;
  aspect-ratio: 1;
  margin: ${SIZE4}px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const LabelWrap = styled.View`
  align-items: center;
  margin-top: ${SIZE2}px;
`;

const InfoWrap = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${SIZE3}px;
  margin-bottom: ${SIZE2}px;
  margin-horizontal: ${SIZE4}px;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const ButtonWrap = styled.View`
  width: 100%;
  padding-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE4}px;
`;

const Mask1IconWrap = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const Mask2IconWrap = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
`;

const Mask3IconWrap = styled.View`
  position: absolute;
  left: 0px;
  bottom: 0px;
`;

const Mask4IconWrap = styled.View`
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

//
const ScanQrWrap = styled.View`
  align-items: center;
  justify-content: center;
`;

const Scan1IconWrap = styled.View`

`;

const Scan2IconWrap = styled.View`
  position: absolute;
  top: ${SIZE4}px;
`;

const ScanQr = () => (
  <ScanQrWrap>
    <Scan1IconWrap>
      <Scan1Icon />
    </Scan1IconWrap>
    <Scan2IconWrap>
      <Scan2Icon />
    </Scan2IconWrap>
  </ScanQrWrap>
);

//
const CameraStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: COLORS.WHITE1,
};

export {
  CameraWrap,
  LabelWrap,
  InfoWrap,
  ButtonWrap,
  Mask1IconWrap,
  Mask2IconWrap,
  Mask3IconWrap,
  Mask4IconWrap,
  ScanQr,
  CameraStyle,
};

import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE6,
  FONT,
} from 'src/constants';

const InfoWrap = styled.View`
  align-items: center;
  padding-horizontal: ${SIZE1}px;
  padding-bottom: ${SIZE6}px;
`;

const NameWrap = styled.View`
  width: 100%;
  height: ${SIZE6}px;
  justify-content: center;
  margin-top: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
`;

const ContactWrap = styled.View`
  width: 100%;
  height: ${SIZE6}px;
  justify-content: center;
  margin-top: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
`;

const SignatureWrap = styled.View`
  width: 100%;
  aspect-ratio: 1.2;
  padding-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE3}px;
`;

const Input = styled.TextInput`
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

export {
  InfoWrap,
  NameWrap,
  ContactWrap,
  SignatureWrap,
  Input,
};

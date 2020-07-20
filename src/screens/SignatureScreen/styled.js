import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  FONT,
} from 'src/constants';

const InfoWrap = styled.View`
  padding-horizontal: ${SIZE1}px;
  align-items: center;
`;

const NameWrap = styled.View`
  width: 100%;
  height: ${SIZE8}px;
  justify-content: center;
  margin-top: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
`;

const ContactWrap = styled.View`
  width: 100%;
  height: ${SIZE8}px;
  justify-content: center;
  margin-top: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
`;

const SignatureWrap = styled.View`
  width: 100%;
  aspect-ratio: 1.8;
  padding: ${SIZE1}px;
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

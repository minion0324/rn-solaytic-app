import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  FONT,
} from 'src/constants';

const InfoWrap = styled.View`
  padding-top: ${SIZE1}px;
  padding-horizontal: ${SIZE1}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const NameWrap = styled.View`
  flex: 3;
  height: ${SIZE8}px;
  justify-content: center;
  padding-horizontal: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
`;

const ContactWrap = styled.View`
  flex: 2;
  height: ${SIZE8}px;
  justify-content: center;
  padding-horizontal: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
  margin-left: ${SIZE1}px;
`;

const SignatureWrap = styled.View`
  flex: 1;
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

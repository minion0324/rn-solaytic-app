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

const webStyle = `
  .m-signature-pad {
    box-shadow: none;
    border-color: ${COLORS.TRANSPARENT1};
  }
  .m-signature-pad--body {
    bottom: 0px;
    border: 1px solid ${COLORS.GRAY3};
  }
  .m-signature-pad--footer {
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
  .m-signature-pad--footer .button.save {
    display: none;
  }
  .m-signature-pad--footer .description {
    display: none;
  }
  .m-signature-pad--footer .button.clear {
    right: 0px;
    left: auto;
    background-color: ${COLORS.TRANSPARENT1};
    color: ${COLORS.BLUE1};
  }
`;

export {
  InfoWrap,
  NameWrap,
  ContactWrap,
  SignatureWrap,
  Input,
  webStyle,
};

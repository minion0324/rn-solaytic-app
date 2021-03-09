import styled from 'styled-components';

import {
  COLORS,
  WIDTH,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE6,
  FONT,
  SIGNATURE_WRAP_RATIO,
} from 'src/constants';

const SIGNATURE_PAD_WIDTH = WIDTH * 0.9 - SIZE3 * 2;
const SIGNATURE_PAD_HEIGHT = SIGNATURE_PAD_WIDTH / SIGNATURE_WRAP_RATIO;

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
  width: ${SIGNATURE_PAD_WIDTH}px;
  aspect-ratio: ${SIGNATURE_WRAP_RATIO};
  margin-vertical: ${SIZE1}px;
  margin-horizontal: ${SIZE3}px;
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
    width: ${SIGNATURE_PAD_WIDTH}px;
    height: ${SIGNATURE_PAD_HEIGHT}px;
    border-color: ${COLORS.TRANSPARENT1};
  }
  .m-signature-pad--body {
    bottom: 0px;
    border: 1px solid ${COLORS.GRAY3};
  }
  .m-signature-pad--footer {
    bottom: 30px;
    height: auto;
  }
  .m-signature-pad--footer .button.save {
    display: none;
  }
  .m-signature-pad--footer .description {
    display: none;
  }
  .m-signature-pad--footer .button.clear {
    position: absolute;
    right: 10px;
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

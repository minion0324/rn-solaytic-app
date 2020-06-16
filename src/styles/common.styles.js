import styled from 'styled-components';

import {
  COLORS,
  COMMON_HEIGHT1,
} from 'src/constants';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.WHITE2};
`;

const HeaderContainer = styled.View`
  width: 100%;
  height: ${COMMON_HEIGHT1}px;
  background-color: ${COLORS.BLUE1};
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  elevation: 12;
`;

const ShadowContainer = styled.View`
  elevation: 10;
  box-shadow: 0px 8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  background-color: ${COLORS.WHITE1};
`;

export {
  Container,
  HeaderContainer,
  ContentContainer,
  ShadowContainer,
};

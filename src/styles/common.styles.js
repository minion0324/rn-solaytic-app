import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
} from 'src/constants';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.WHITE2};
`;

const ShadowWrap = styled.View`
  elevation: 10;
  box-shadow: 0px 8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  background-color: ${COLORS.WHITE1};
`;

const HeaderTitle = styled.Text`
  font-size: 15px;
  color: ${COLORS.WHITE1};
  text-transform: uppercase;
`;

export {
  Container,
  ShadowWrap,
  HeaderTitle,
};

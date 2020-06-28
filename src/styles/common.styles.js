import styled from 'styled-components';

import {
  COLORS,
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
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export {
  Container,
  ShadowWrap,
  LoadingWrap,
};

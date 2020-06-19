import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE4,
  SIZE6,
  SIZE8,
  SIZE10,
  FONT,
} from 'src/constants';

const Content = styled.View`
  margin-top: ${SIZE4}px;
`;

const ItemRow = styled.View`
  height: ${SIZE10}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: 1px;
  background-color: ${COLORS.WHITE1};
  padding-left: ${SIZE6}px;
  padding-right: ${SIZE8}px;
`;

const InfoText = styled.Text`
  color: ${COLORS.BLACK2};
  font-size: ${FONT(15)}px;
  font-weight: 500;
`

const Button = styled.TouchableOpacity`
  width: 24%;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${COLORS.BLUE1};
  border-radius: 2px;
  padding-vertical: ${SIZE1}px;
`;

const ButtonText = styled.Text`
  color: ${COLORS.BLUE1};
  font-size: ${FONT(12)}px;
  font-style: italic;
`;

const IconWrap = styled.View`
  width: 18%;
`;

const InfoRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export {
  Content,
  ItemRow,
  InfoText,
  Button,
  ButtonText,
  IconWrap,
  InfoRow,
};

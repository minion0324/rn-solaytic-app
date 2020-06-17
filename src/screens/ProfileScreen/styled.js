import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
} from 'src/constants';

const Content = styled.View`
  margin-top: ${COMMON_PADDING * 2}px;
`;

const ItemRow = styled.View`
  height: ${COMMON_SIZE / 2}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: 1px;
  background-color: ${COLORS.WHITE1};
  padding-left: ${COMMON_PADDING * 3}px;
  padding-right: ${COMMON_PADDING * 4}px;
`;

const InfoText = styled.Text`
  color: ${COLORS.BLACK2};
  font-size: 15px;
`

const Button = styled.TouchableOpacity`
  width: 24%;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${COLORS.BLUE1};
  border-radius: 2px;
  padding-vertical: ${COMMON_PADDING / 2}px;
`;

const ButtonText = styled.Text`
  color: ${COLORS.BLUE1};
  font-size: 12px;
  font-style: italic;
`;

const IconWrap = styled.View`
  width: 20%;
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

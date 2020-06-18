import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const LabelText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  opacity: 0.2;
  color: ${COLORS.BLACK2};
`;

const ContentText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
  margin-top: ${COMMON_PADDING / 2}px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${COMMON_PADDING}px;
  padding-horizontal: ${COMMON_PADDING * 2}px;
`;

const InfoWrap = styled.View`
  align-items: ${(props) => (
    props.forEnd ? 'flex-end' : 'flex-start'
  )};
`;

const ButtonWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  height: ${COMMON_SIZE * 0.4}px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  padding-vertical: ${COMMON_PADDING / 2}px;
`;

const ButtonText = styled.Text`
  font-size: ${props => FONT(props.font || 12)}px;
  font-weight: 600;
  color: ${props => props.color};
  text-transform: uppercase;
`;

const Content = styled.View`
  margin-bottom: ${COMMON_PADDING}px;
`;

//
const InfoView = styled.View`
  margin-left: ${COMMON_PADDING}px;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  opacity: ${props => props.opacity || 1};
  color: ${COLORS.BLACK2};
  margin-left: ${COMMON_PADDING / 2}px;
`;

const Location2Text = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  opacity: ${props => props.opacity || 1};
  color: ${COLORS.BLACK2};
  margin-top: ${COMMON_PADDING / 2}px;
  margin-left: ${COMMON_PADDING}px;
`;

const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NameText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  opacity: ${props => props.opacity || 1};
  color: ${COLORS.BLACK2};
  margin-left: ${COMMON_PADDING / 2}px;
`;

const ItemRow = styled.View`
  padding: ${COMMON_PADDING}px;
  border-radius: 3px;
  border-color: ${(props) => (
    props.activated ? COLORS.BLUE1 : COLORS.GRAY2
  )};
  border-width: 1px;
  margin-vertical: ${COMMON_PADDING}px;
`;

const ItemText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  opacity: ${props => props.opacity || 1};
  color: ${COLORS.BLACK2};
`;

const ToolRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-vertical: ${COMMON_PADDING}px;
`;

const ItemContent = styled.View`
  background-color: ${COLORS.WHITE1};
  padding-top: ${COMMON_PADDING / 2}px;
  padding-bottom: ${COMMON_PADDING}px;
  padding-horizontal: ${COMMON_PADDING * 2}px;
`;

export {
  LabelText,
  ContentText,
  InfoRow,
  InfoWrap,
  ButtonWrap,
  Button,
  ButtonText,
  Content,

  InfoView,
  LocationRow,
  LocationText,
  Location2Text,
  NameRow,
  NameText,
  ItemRow,
  ItemText,
  ToolRow,
  ItemContent,
};

import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE8,
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
  margin-top: ${SIZE1}px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${SIZE2}px;
  padding-horizontal: ${SIZE4}px;
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
  height: ${SIZE8}px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  padding-vertical: ${SIZE1}px;
`;

const ButtonText = styled.Text`
  font-size: ${props => FONT(props.font || 12)}px;
  font-weight: 600;
  color: ${props => props.color};
  text-transform: uppercase;
`;

const Content = styled.View`
  margin-bottom: ${SIZE2}px;
`;

//
const InfoView = styled.View`
  margin-left: ${SIZE2}px;
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
  margin-left: ${SIZE1}px;
`;

const Location2Text = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  opacity: ${props => props.opacity || 1};
  color: ${COLORS.BLACK2};
  margin-top: ${SIZE1}px;
  margin-left: ${SIZE2}px;
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
  margin-left: ${SIZE1}px;
`;

const ItemRow = styled.View`
  padding: ${SIZE2}px;
  border-radius: 3px;
  border-color: ${(props) => (
    props.activated ? COLORS.BLUE1 : COLORS.GRAY2
  )};
  border-width: 1px;
  margin-vertical: ${SIZE2}px;
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
  margin-vertical: ${SIZE2}px;
`;

const ItemContent = styled.View`
  background-color: ${COLORS.WHITE1};
  padding-top: ${SIZE1}px;
  padding-bottom: ${SIZE2}px;
  padding-horizontal: ${SIZE4}px;
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

import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE6,
  SIZE8,
  SIZE12,
  SIZE24,
  FONT,
} from 'src/constants';

const ButtonWrap = styled.View`
  height: ${SIZE12}px;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${SIZE6}px;
  background-color: ${COLORS.WHITE2};
`;

const JobDetails = styled.View`
  margin: ${SIZE2}px;
`;

const Content = styled.View`
  padding-vertical: ${SIZE3}px;
  padding-horizontal: ${SIZE4}px;
  background-color: ${COLORS.WHITE1};
`;

const LabelText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500,
  color: ${COLORS.GRAY3};
`;

const InfoText = styled.Text`
  max-width: 88%;
  font-size: ${FONT(15)}px;
  font-weight: 700,
  color: ${COLORS.BLACK2};
`;

const LocationInfo = styled.View`
  margin-top: ${SIZE2}px;
  margin-bottom: ${SIZE4}px;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconWrap = styled.View`
  width: ${SIZE8}px;
  align-items: center;
`;

const Border = styled.View`
  width: 0px;
  height: ${SIZE6}px;
  margin-left: ${SIZE4 - 3}px;
  border-right-width: 5px;
  border-color: ${COLORS.GRAY2};
`;

const ContactInfo = styled.View`
  margin-vertical: ${SIZE4}px;
`;

const InfoWrap = styled.View`
  margin-vertical: ${SIZE2}px;
`;

const IdWrap = styled.TouchableOpacity`

`;

const IdText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700,
  color: ${COLORS.BLUE1};
  text-decoration-line: underline;
`;

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BinButtonWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-vertical: ${SIZE4}px;
`;

const BinButton = styled.TouchableOpacity`
  width: ${SIZE24}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE1}px;
  background-color: ${(props) => (
    props.active ? COLORS.BLUE3 : COLORS.TRANSPARENT1
  )};
`;

const BinButtonText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${(props) => (
    props.active ? COLORS.BLUE1 : COLORS.BLACK2
  )};
`;

const BinInfoWrap = styled.View`

`;

const BinInfoRow = styled.View`
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE3};
  margin-vertical: ${SIZE1}px;
  border-radius: ${SIZE1}px;
`;

const BinText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLUE1};
  text-align: center;
`;

const BinInput = styled.TextInput`
  width: 100%;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLUE1};
  text-align: center;
`;

const InstructionsWrap = styled.View`
  align-items: center;
  margin-vertical: ${SIZE4}px;
`;

const InstructionsContent = styled.View`
  width: 100%;
  margin-top: ${SIZE2}px;
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${COLORS.GRAY4};
  padding-horizontal: ${SIZE4}px;
  padding-top: ${SIZE4}px;
  padding-bottom: ${SIZE8}px;
`;

const InstructionsText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600,
  color: ${COLORS.BLACK1};
`;

const PhotoAndSignWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const PhotoAndSignText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLACK2};
  margin-left: ${SIZE1}px;
  margin-vertical: ${SIZE4}px;
`;

const AttachmentWrap = styled.View`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  overflow: hidden;
`;

const HalfWrap = styled.View`
  width: 100%;
  aspect-ratio: 2;
  justify-content: center;
  padding: ${SIZE4}px;
`;

const SignInfo = styled.View`
  height: ${SIZE8}px;
  justify-content: center;
  margin-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE4}px;
  background-color: ${COLORS.WHITE3};
  border-radius: ${SIZE1}px;
`;

const SignInfoText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

export {
  ButtonWrap,
  JobDetails,
  Content,
  LabelText,
  InfoText,
  LocationInfo,
  LocationRow,
  IconWrap,
  Border,
  ContactInfo,
  InfoWrap,
  IdWrap,
  IdText,
  RowWrap,
  BinButtonWrap,
  BinButton,
  BinButtonText,
  BinInfoWrap,
  BinInfoRow,
  BinText,
  BinInput,
  InstructionsWrap,
  InstructionsContent,
  InstructionsText,
  PhotoAndSignWrap,
  PhotoAndSignText,
  AttachmentWrap,
  HalfWrap,
  SignInfo,
  SignInfoText,
};

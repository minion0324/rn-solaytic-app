import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE8,
  SIZE20,
  FONT,
} from 'src/constants';

const JobProofItem = styled.View`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${SIZE2}px;
  overflow: hidden;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: ${SIZE1}px;
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
  border-radius: ${SIZE1}px;
`;

const SignInfoText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
  text-align: center;
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
  margin-vertical: ${SIZE3}px;
`;

const PrintAndShareWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const PrintAndShareText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLACK2};
  margin-left: ${SIZE1}px;
  margin-vertical: ${SIZE3}px;
`;

const AmountButton = styled.TouchableOpacity`
  width: ${SIZE20}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE3};
  margin-left: ${SIZE2}px;
  padding-horizontal: ${SIZE2}px;
  border-radius: ${SIZE1}px;
`;

const DriverNoteBadge = styled.View`
  width: ${SIZE2}px;
  aspect-ratio: 1;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.RED1};
  margin-left: ${SIZE1}px;
  margin-top: -${SIZE1}px;
`;

export {
  JobProofItem,
  HalfWrap,
  SignInfo,
  SignInfoText,
  CancelButton,
  PhotoAndSignWrap,
  PhotoAndSignText,
  PrintAndShareWrap,
  PrintAndShareText,
  AmountButton,
  DriverNoteBadge,
};

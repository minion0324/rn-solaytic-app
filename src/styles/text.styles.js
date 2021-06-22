import styled from 'styled-components';

import {
  COLORS,
  FONT,
} from 'src/constants';

const TitleText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${props => props.color || COLORS.BLACK2};
`;

const InfoText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${props => props.color || COLORS.BLACK2};
  text-align: ${props => props.align || 'left'};
  padding-right: ${props => props.right || 0}px;
`;

const LabelText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${props => props.color || COLORS.BLACK2};
`;

export {
  TitleText,
  InfoText,
  LabelText,
};

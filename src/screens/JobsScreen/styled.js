import styled from 'styled-components';

import {
  COLORS,
  HEIGHT,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE10,
  FONT,
} from 'src/constants';

const TabWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-vertical: ${SIZE2}px;
  background-color: ${COLORS.WHITE2};
`;

const TabItem = styled.TouchableOpacity`
  width: ${SIZE10}px;
  align-items: center;
  border-bottom-width: 3px;
  border-color: ${(props) => (
    props.selected
    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
  )};
  padding-vertical: ${SIZE1}px;
`;

const TabText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  text-transform: uppercase;
`;

const NoJobsWrap = styled.View`
  align-self: center;
  position: absolute;
  top: ${HEIGHT * 0.15}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE2};
`;

const NoJobsText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  text-align: center;
`;

const NoJobsIcon = styled.View`
  margin-vertical: ${SIZE4}px;
`;

export {
  TabWrap,
  TabItem,
  TabText,
  NoJobsWrap,
  NoJobsText,
  NoJobsIcon,
};

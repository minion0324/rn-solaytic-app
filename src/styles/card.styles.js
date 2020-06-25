import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE12,
  FONT,
} from 'src/constants';

const CardRow = styled.View`
  flex-direction: row;
`;

const DateWrap = styled.View`
  width: ${SIZE12}px;
  align-items: center;
  padding-top: ${SIZE2}px;
  border-right-width: 1px;
  border-color: ${COLORS.GRAY3};
`;

const DateText1 = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const DateText2 = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

export {
  CardRow,
  DateWrap,
  DateText1,
  DateText2,
};

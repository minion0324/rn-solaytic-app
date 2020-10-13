import styled from 'styled-components';

import {
  COLORS,
  SIZE3,
  SIZE12,
  FONT,
} from 'src/constants';

const DriverNoteItem = styled.View`
  height: ${SIZE12}px;
  justify-content: center;
  padding-horizontal: ${SIZE3}px;
  background-color: ${(props) => (
    props.activated ? COLORS.RED1 : COLORS.WHITE1
  )};
`;

const DriverNoteText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${(props) => (
    props.activated ? COLORS.WHITE1 : COLORS.BLACK2
  )};
`;

export {
  DriverNoteItem,
  DriverNoteText,
};

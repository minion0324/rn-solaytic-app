import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE6,
  SIZE8,
  FONT,
} from 'src/constants';

const Comment = styled.View`
  padding: ${SIZE3}px;
  margin-vertical: ${SIZE2}px;
  max-width: 90%;
  border-radius: ${SIZE2}px;
  background-color: ${COLORS.WHITE1};
  align-self: ${(props) => (
    props.pos === 'right' ? 'flex-end' : 'flex-start'
  )};
`;

const CommentText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  text-align: ${(props) => (
    props.pos === 'right' ? 'right' : 'left'
  )};
`;

const CommentInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLACK2};
`;

export {
  Comment,
  CommentText,
  CommentInput,
};

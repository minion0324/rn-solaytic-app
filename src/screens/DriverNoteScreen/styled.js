import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE3,
  FONT,
} from 'src/constants';

const CommentWrap = styled.View`
  flex-direction: row;
  align-self: ${(props) => (
    props.pos === 'right' ? 'flex-end' : 'flex-start'
  )};
`;

const Comment = styled.View`
  padding: ${SIZE3}px;
  margin-vertical: ${SIZE2}px;
  max-width: 80%;
  background-color: ${COLORS.WHITE1};
  border-radius: ${SIZE3}px;
  border-bottom-left-radius: ${(props) => (
    props.pos === 'right' ? SIZE3 : 0
  )}px;
  border-bottom-right-radius: ${(props) => (
    props.pos === 'right' ? 0 : SIZE3
  )}px;
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

const AvatarWrap = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: ${SIZE3}px;
`;

const AvatarText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

export {
  CommentWrap,
  Comment,
  CommentText,
  CommentInput,
  AvatarWrap,
  AvatarText,
};

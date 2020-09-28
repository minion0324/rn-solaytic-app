import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  HeaderBar,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
} from 'src/constants';
import {
  Jobs,
} from 'src/redux';

import {
  Container,
  Content,
  ContentWrap,
  ShadowWrap,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';

import {
  CommentWrap,
  Comment,
  CommentText,
  CommentInput,
  AvatarWrap,
  AvatarText,
  TimeText,
} from './styled';

const {
  ChatIcon,
  SendIcon,
  MessageAvatarIcon,
} = SVGS;

const DriverNoteScreen = ({
  focusedJob,
  markMessagesAsRead,
  addMessage,
  componentId,
}) => {
  const [ newComment, setNewComment ] = useState('');

  const listRef = useRef(null);

  const onBack = () => {
    popScreen(componentId);
  };

  const onReadMessages = () => {
    markMessagesAsRead({
      jobId: focusedJob.jobId,
    });
  };

  const onNewComment = () => {
    if (!newComment.trim()) {
      setNewComment('');
      Alert.alert('Warning', 'Please enter message.');
      return;
    }

    Keyboard.dismiss();

    addMessage({
      jobId: focusedJob.jobId,
      message: newComment,
      success: () => setNewComment(''),
      failure: () => {},
    });
  };

  const renderCommentItem = ({ item }) => {
    return (
      !!item.message &&
      <CommentWrap
        pos={item.type && 'right'}
      >
        {
          !item.type &&
          <AvatarWrap>
            <MessageAvatarIcon />
            <AvatarText>
              {item.name}
            </AvatarText>
          </AvatarWrap>
        }
        <FlexWrap>
          <Comment
            key={item.jobMessageId}
            pos={item.type && 'right'}
          >
            <CommentText
              pos={item.type && 'right'}
            >
              {item.message}
            </CommentText>
          </Comment>
          <TimeText
            pos={item.type && 'right'}
          >
            {
              moment(item.created)
                .format('DD-MMM-YYYY, hh:mm A')
            }
          </TimeText>
        </FlexWrap>
      </CommentWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              <ChatIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Driver Note</ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <ContentWrap color={COLORS.WHITE2}>
          <FlatList
            ref={listRef}
            bounces={false}
            data={focusedJob.messages}
            keyExtractor={(item) => `${item.jobMessageId}`}
            showsVerticalScrollIndicator={false}
            renderItem={renderCommentItem}
          />
        </ContentWrap>
      </Content>

      <ShadowWrap>
        <ContentWrap>
          <RowWrap>
            <CommentInput
              placeholder={'Type a message'}
              underlineColorAndroid={COLORS.TRANSPARENT1}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={text => setNewComment(text)}
              value={newComment}
              returnKeyType={'go'}
              onSubmitEditing={onNewComment}
            />
            <SpaceView mLeft={SIZE2} />
            <TouchableOpacity onPress={onNewComment}>
              <SendIcon />
            </TouchableOpacity>
          </RowWrap>
        </ContentWrap>
      </ShadowWrap>
    </Container>
  );
};

DriverNoteScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  markMessagesAsRead: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

DriverNoteScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
  };
};

const mapDispatchToProps = {
  markMessagesAsRead: Jobs.actionCreators.markMessagesAsRead,
  addMessage: Jobs.actionCreators.addMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverNoteScreen);

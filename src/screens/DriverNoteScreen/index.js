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
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';

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
  ViewStore,
} from 'src/redux';
import {
  delay,
} from 'src/utils';

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
  newCommentInfo,
  markMessagesAsRead,
  addMessage,
  setNewCommentInfo,
  setCoreScreenInfo,
  componentId,
}) => {
  const [ newComment, setNewComment ] = useState('');

  const listRef = useRef(null);

  useEffect(() => {
    onNewCommentInfo();
  }, [newCommentInfo]);

  useNavigationComponentDidAppear((event) => {
    const { componentName } = event;

    setCoreScreenInfo({
      componentId,
      componentName,
      componentType: 'push',
    });
  });

  const onNewCommentInfo = async () => {
    try {
      const { jobId } = newCommentInfo;

      if (+jobId === focusedJob.jobId) {
        setNewCommentInfo({});
      }

      await delay(100);
      listRef.current.scrollToEnd();

      onReadMessages();
    } catch (error) {
      //
    }
  };

  const onBack = () => {
    popScreen(componentId);
  };

  const onReadMessages = () => {
    markMessagesAsRead({
      jobId: focusedJob.jobId,
    });
  };

  const onNewCommentSuccess = async () => {
    setNewComment('');

    await delay(100);
    listRef.current.scrollToEnd();
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
      success: onNewCommentSuccess,
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

      <ShadowWrap forUp>
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
  newCommentInfo: PropTypes.object.isRequired,
  markMessagesAsRead: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

DriverNoteScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    newCommentInfo: ViewStore.selectors.getNewCommentInfo(state),
  };
};

const mapDispatchToProps = {
  markMessagesAsRead: Jobs.actionCreators.markMessagesAsRead,
  addMessage: Jobs.actionCreators.addMessage,
  setNewCommentInfo: ViewStore.actionCreators.setNewCommentInfo,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverNoteScreen);

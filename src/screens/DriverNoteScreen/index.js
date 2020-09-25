import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  Comment,
  CommentText,
  CommentInput,
} from './styled';

const {
  ChatIcon,
  SendIcon,
} = SVGS;

const DriverNoteScreen = ({
  focusedJob,
  componentId,
}) => {

  const onBack = () => {
    popScreen(componentId);
  };

  const renderCommentItem = ({ item }) => {
    return (
      !!item.message &&
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
            // ref={listRef}
            bounces={false}
            data={focusedJob.messages}
            keyExtractor={(item) => `${item.jobMessageId}`}
            showsVerticalScrollIndicator={false}
            renderItem={renderCommentItem}
          />
        </ContentWrap>
      </Content>

      <ContentWrap>
        <RowWrap>
          <CommentInput
          />
          <SpaceView mLeft={SIZE2} />
          <TouchableOpacity>
            <SendIcon />
          </TouchableOpacity>
        </RowWrap>
      </ContentWrap>
    </Container>
  );
};

DriverNoteScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
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
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverNoteScreen);

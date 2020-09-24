import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE10,
} from 'src/constants';
import {
  showOverlay,
  dismissOverlay,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';
import {
  delay,
} from 'src/utils';

import {
  ShadowWrap,
  SpaceView,
  OkCancelRow,
  OkCancelButton,
  OkCancelText,
} from 'src/styles/common.styles';
import {
  ModalWrap,
  ModalTopText,
  ModalInput,
} from 'src/styles/modal.styles';

import {
  Content,
  InfoText,
  JobInstruction,
  CommentsWrap,
  Comment,
  CommentText,
  AddComment,
  CollectRow,
  CollectInputWrap,
  CollectInput,
  AddServices,
  ServicesWrap,
  ServiceRow,
} from '../styled';

const {
  CommentIcon,
  ActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  ServiceIcon,
} = SVGS;

const COMMENT = 'Comment';
const SERVICES = 'Services';

const UNIT = '$ ';

const InstructionTab = ({
  amountCollected,
  setAmountCollected,
  services,

  focusedJob,
  newCommentInfo,
  setNewCommentInfo,

  onUpdateService,
  onReadMessages,
  onNewComment,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
}) => {
  const [ active, setActive ] = useState(COMMENT);

  const [ maxHeight, setMaxHeight ] = useState(0);

  const listRef = useRef(null);

  const wrap1Height = useRef(null);
  const wrap2Height = useRef(null);

  useEffect(() => {
    onNewCommentInfo();
  }, [newCommentInfo]);

  useEffect(() => {
    const result = wrap1Height.current - wrap2Height.current - SIZE1 * 28;

    if (result > 0) {
      setMaxHeight(result);
    }
  }, [wrap1Height.current, wrap2Height.current]);

  // const onCommentActive = async () => {
  //   try {
  //     await delay(1000);
  //     listRef.current.scrollToEnd();
  //   } catch (error) {
  //     //
  //   }
  // };

  const onNewCommentInfo = async () => {
    try {
      const { jobId } = newCommentInfo;

      if (+jobId === focusedJob.jobId) {
        await delay(100);

        setActive(COMMENT);
        await delay(100);

        onReadMessages();
        setNewCommentInfo({});
      }
    } catch (error) {
      //
    }
  };

  const onShowCommentModal = () => {
    if (!onAlertNotProgress()) {
      return;
    }

    showOverlay(CUSTOM_MODAL_SCREEN, {
      offsetFromCenter: SIZE10,
      dismissible: false,
      getContent: renderCommentModal,
    });
  };

  const onDismissCommentModal = async (containerId) => {
    Keyboard.dismiss();

    await delay(100);
    dismissOverlay(containerId);
  };

  const onAddComment = (comment, containerId) => {
    if (!comment) {
      Alert.alert('Warning', 'Please enter comment.');
      return;
    }

    onNewComment(comment);
    onDismissCommentModal(containerId);
  };

  const renderCommentModal = (containerId, { modalData, setModalData }) => {
    return (
      <ModalWrap>
        <ModalTopText>Enter a comment</ModalTopText>
        <ModalInput
          underlineColorAndroid={COLORS.TRANSPARENT1}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={text => setModalData(text)}
          value={modalData}
        />
        <OkCancelRow>
          <OkCancelButton
            onPress={() => onDismissCommentModal(containerId)}
          >
            <OkCancelText>Cancel</OkCancelText>
          </OkCancelButton>
          <OkCancelButton
            onPress={() => onAddComment(modalData, containerId)}
          >
            <OkCancelText>Ok</OkCancelText>
          </OkCancelButton>
        </OkCancelRow>
      </ModalWrap>
    );
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

  const renderComments = () => {
    if (active !== COMMENT) {
      return (
        <View>
          <SpaceView mTop={SIZE2} />
          <ShadowWrap>
            <Content>
              <AddComment onPress={() => setActive(COMMENT)}>
                <CommentIcon />
                <SpaceView mLeft={SIZE1} />
                <InfoText>ADD COMMENT</InfoText>
              </AddComment>
            </Content>
          </ShadowWrap>
        </View>
      );
    }

    return (
      <ShadowWrap>
        <Content>
          {
            focusedJob.messages.length > 0 &&
            <CommentsWrap>
              <FlatList
                ref={listRef}
                bounces={false}
                data={focusedJob.messages}
                keyExtractor={(item) => `${item.jobMessageId}`}
                showsVerticalScrollIndicator={false}
                renderItem={renderCommentItem}
                style={{ maxHeight }}
              />
            </CommentsWrap>
          }
          <AddComment onPress={onShowCommentModal}>
            <CommentIcon />
            <SpaceView mLeft={SIZE1} />
            <InfoText>ADD COMMENT</InfoText>
          </AddComment>
        </Content>
      </ShadowWrap>
    );
  };

  const renderCollect = () => {
    return (
      <View
        onLayout={({ nativeEvent: { layout } }) => {
          if (Math.abs(wrap2Height.current - layout.height) > SIZE1) {
            wrap2Height.current = layout.height;
          }
        }}
      >
        <SpaceView mTop={SIZE2} />
        <ShadowWrap>
          <Content>
            <CollectRow>
              <InfoText>COLLECT</InfoText>
              <CollectInputWrap>
                <CollectInput
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => setAmountCollected(text.replace(UNIT, ''))}
                  value={
                    amountCollected ? `${UNIT}${amountCollected}` : ''
                  }
                  keyboardType={'numeric'}
                  editable={isInProgress()}
                />
              </CollectInputWrap>
            </CollectRow>
            <OkCancelRow>
              <OkCancelButton
                onPress={() => {
                  setAmountCollected(
                    focusedJob.collectedAmount || focusedJob.amountToCollect
                  );
                }}
              >
                <OkCancelText>Cancel</OkCancelText>
              </OkCancelButton>
              <OkCancelButton
                onPress={() => onUpdateAmountCollected(amountCollected)}
              >
                <OkCancelText>Ok</OkCancelText>
              </OkCancelButton>
            </OkCancelRow>
          </Content>
        </ShadowWrap>
      </View>
    );
  };

  const renderServiceItem = ({ item, index }) => {
    return (
      <ServiceRow
        key={`${item.serviceAdditionalChargeId}`}
        onPress={() => onUpdateService(item, index)}
      >
        {
          item.isSelected
          ? <ActiveCircleCheckIcon />
          : <DeactiveCircleCheckIcon />
        }
        <SpaceView mLeft={SIZE2} />
        <InfoText>{item.serviceAdditionalChargeName}</InfoText>
      </ServiceRow>
    );
  };

  const renderServices = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ShadowWrap>
          <Content>
            <AddServices onPress={() => setActive(SERVICES)}>
              <ServiceIcon />
              <SpaceView mLeft={SIZE1} />
              <InfoText>ADD SERVICES</InfoText>
            </AddServices>
            {
              active === SERVICES &&
              <ServicesWrap>
                <FlatList
                  bounces={false}
                  data={services}
                  keyExtractor={(item) => `${item.serviceAdditionalChargeId}`}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderServiceItem}
                  style={{ maxHeight }}
                />
              </ServicesWrap>
            }
          </Content>
        </ShadowWrap>
      </View>
    );
  };

  return (
    <JobInstruction
      onLayout={({ nativeEvent: { layout } }) => {
        if (Math.abs(wrap1Height.current - layout.height) > SIZE1) {
          wrap1Height.current = layout.height;
        }
      }}
    >
      { renderComments() }

      {
        focusedJob.isEnabledCashCollection &&
        renderCollect()
      }

      {
        focusedJob.additionalCharges.length > 0 &&
        renderServices()
      }
    </JobInstruction>
  );
};

InstructionTab.propTypes = {
  amountCollected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  setAmountCollected: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,

  focusedJob: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,

  onUpdateService: PropTypes.func.isRequired,
  onReadMessages: PropTypes.func.isRequired,
  onNewComment: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
};

InstructionTab.defaultProps = {
  amountCollected: '',
};

export default InstructionTab;

import React, { useState } from 'react';
import {
  View,
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
} = SVGS;

const COMMENT = 'Comment';
const SERVICES = 'Services';

const UNIT = '$ ';

const InstructionTab = ({
  amountCollected,
  setAmountCollected,

  focusedJob,

  onUpdateService,
  onNewComment,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
}) => {
  const [ active, setActive ] = useState(COMMENT);

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
              {
                focusedJob.messages.map((item) => (
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
                ))
              }
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
      <View>
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

  const renderServices = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ShadowWrap>
          <Content>
            <AddServices onPress={() => setActive(SERVICES)}>
              <InfoText>ADD SERVICES</InfoText>
            </AddServices>
            {
              active === SERVICES &&
              <ServicesWrap>
                {
                  focusedJob.additionalCharges.map((item) => (
                    <ServiceRow
                      key={`${item.serviceAdditionalChargeId}`}
                      onPress={() => onUpdateService(item)}
                    >
                      {
                        item.isSelected
                        ? <ActiveCircleCheckIcon />
                        : <DeactiveCircleCheckIcon />
                      }
                      <SpaceView mLeft={SIZE2} />
                      <InfoText>{item.serviceAdditionalChargeName}</InfoText>
                    </ServiceRow>
                  ))
                }
              </ServicesWrap>
            }
          </Content>
        </ShadowWrap>
      </View>
    );
  };

  return (
    <JobInstruction>
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

  focusedJob: PropTypes.object.isRequired,

  onUpdateService: PropTypes.func.isRequired,
  onNewComment: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
};

InstructionTab.defaultProps = {
  amountCollected: '',
};

export default InstructionTab;

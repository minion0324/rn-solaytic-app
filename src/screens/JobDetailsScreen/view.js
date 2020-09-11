import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';

import {
  COLORS,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
} from 'src/components';

import {
  Container,
  Content,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
  FailJob,
} from 'src/styles/header.styles';
import {
  TabBarBadge,
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
} from 'src/styles/tab.styles';

import {
  ButtonWrap,
} from './styled';

import { DetailsTab, InstructionTab } from './components';

const TAB1 = 'Details';
const TAB2 = 'Instruction';

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
  jobStatus,
  amountCollected,
  setAmountCollected,

  focusedJob,
  newCommentInfo,
  setNewCommentInfo,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onCancelPhoto,
  onCancelSign,
  onFail,
  onUpdateService,
  onReadMessages,
  onNewComment,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
}) => {
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ tabRoutes ] = useState([
    { key: TAB1, title: TAB1 },
    { key: TAB2, title: TAB2 },
  ]);

  const onTapPress = ({ route }) => {
    if (
      route.key === TAB1 ||
      !focusedJob.haveUnreadMessage
    ) {
      return;
    }

    onReadMessages();
  };

  const renderButton = () => {
    if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.BLUE1}
            text={'Start'}
            onPress={onStart}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    if (
      jobStatus === JOB_STATUS.IN_PROGRESS1 &&
      focusedJob.steps.length === 3
    ) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.PURPLE1}
            text={'Exchange'}
            onPress={onExchange}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    if (
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.IN_PROGRESS2
    ) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.GREEN1}
            text={'Complete'}
            onPress={onComplete}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    return null;
  };

  const renderHeader = () => {
    return (
      JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
      ? <HeaderBar
          centerIcon={
            <ScreenText>{focusedJob.jobTemplateName || focusedJob.jobTypeName}</ScreenText>
          }
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      : <ShadowWrap>
          <HeaderBar
            centerIcon={
              <ScreenText>{focusedJob.jobTemplateName || focusedJob.jobTypeName}</ScreenText>
            }
            leftIcon={<BackButton />}
            rightIcon={
              jobStatus === JOB_STATUS.IN_PROGRESS1 ||
              jobStatus === JOB_STATUS.IN_PROGRESS2
              ? <FailJob />
              : <EmptyWrap />
            }
            onPressLeft={onBack}
            onPressRight={
              jobStatus === JOB_STATUS.IN_PROGRESS1 ||
              jobStatus === JOB_STATUS.IN_PROGRESS2
              ? onFail
              : null
            }
          />

          { renderButton() }
        </ShadowWrap>
    );
  };

  const renderScene = ({ route }) => {
    return route.key === TAB1
      ? <DetailsTab
          loading={loading}
          photos={photos}
          sign={sign}
          signedUserName={signedUserName}
          signedUserContact={signedUserContact}
          binInfo={binInfo}
          setBinInfo={setBinInfo}
          jobStatus={jobStatus}
          setTabIndex={setTabIndex}

          focusedJob={focusedJob}

          onAcknowledge={onAcknowledge}
          onPhoto={onPhoto}
          onSign={onSign}
          onCancelPhoto={onCancelPhoto}
          onCancelSign={onCancelSign}
          isInProgress={isInProgress}
        />
      : <InstructionTab
          amountCollected={amountCollected}
          setAmountCollected={setAmountCollected}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}

          focusedJob={focusedJob}
          newCommentInfo={newCommentInfo}
          setNewCommentInfo={setNewCommentInfo}

          onUpdateService={onUpdateService}
          onReadMessages={onReadMessages}
          onNewComment={onNewComment}
          onUpdateAmountCollected={onUpdateAmountCollected}
          isInProgress={isInProgress}
          onAlertNotProgress={onAlertNotProgress}
        />
  };

  const renderBadge = ({ route }) => {
    if (
      route.key === TAB1 ||
      !focusedJob.haveUnreadMessage
    ) {
      return null;
    }

    return (
      <TabBarBadge />
    );
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        style={TabBarStyle}
        indicatorStyle={TabBarIndicatorStyle}
        labelStyle={TabBarLabelStyle}
        activeColor={TabBarActiveColor}
        inactiveColor={TabBarInactiveColor}
        renderBadge={renderBadge}
        onTabPress={onTapPress}
      />
    );
  };

  return (
    <Container>
      { renderHeader() }

      <Content>
        <TabView
          navigationState={{
            index: tabIndex, routes: tabRoutes
          }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={idx => setTabIndex(idx)}
          useNativeDriver
        />
      </Content>
    </Container>
  );
};

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  amountCollected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  setAmountCollected: PropTypes.func.isRequired,

  focusedJob: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onCancelSign: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onUpdateService: PropTypes.func.isRequired,
  onReadMessages: PropTypes.func.isRequired,
  onNewComment: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
  amountCollected: '',
};

export default JobDetailsScreenView;

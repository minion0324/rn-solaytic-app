import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';

import {
  SVGS,
  COLORS,
  JOB_DATE,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  pushScreen,
  popScreen,
  SIGNATURE_SCREEN,
} from 'src/navigation';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';
import {
  Jobs,
  ViewStore,
} from 'src/redux';

import {
  ButtonWrap,
  JobDetails,
  Content,
  LabelText,
  InfoText,
  LocationInfo,
  LocationRow,
  IconWrap,
  Border,
  ContactInfo,
  InfoWrap,
  IdWrap,
  IdText,
  RowWrap,
  BinButtonWrap,
  BinButton,
  BinButtonText,
  BinInfoWrap,
  BinInfoRow,
  BinText,
  InstructionsWrap,
  InstructionsContent,
  InstructionsText,
  PhotoAndSignWrap,
  PhotoAndSignText,
} from './styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  CameraIcon,
  SignIcon,
} = SVGS;

const JobDetailsScreen = ({
  focusedJob,
  acknowledgeJobs,
  startJobs,
  exchangeJobs,
  completeJobs,
  setCurrentScreenInfo,
  componentId,
}) => {
  const [ index, setIndex ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    setCurrentScreenInfo({
      componentId,
      componentType: 'push',
    });

    return () => {
      setCurrentScreenInfo({});
    };
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onAcknowledge = () => {
    setLoading(true);

    acknowledgeJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onStart = () => {
    setLoading(true);

    startJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onExchange = () => {
    setLoading(true);

    exchangeJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onComplete = () => {
    setLoading(true);

    completeJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onPhoto = () => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
      },
      // quality: 0.5,
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log(response);

      if (response.didCancel) {
        //
      } else if (response.error) {
        //
      } else {
        //
      }
    });
  };

  const onSign = () => {
    pushScreen(componentId, SIGNATURE_SCREEN);
  };

  const renderButton = () => {
    if (focusedJob.statusName === JOB_STATUS.ACKNOWLEDGED) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.BLUE1}
            text={'Start'}
            onPress={onStart}
            loading={loading}
          />
        </ButtonWrap>
      )
    }

    if (
      focusedJob.statusName === JOB_STATUS.IN_PROGRESS1 &&
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
      focusedJob.statusName === JOB_STATUS.IN_PROGRESS1 ||
      focusedJob.statusName === JOB_STATUS.IN_PROGRESS2
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

  const renderLocationInfo = () => {
    const locations = focusedJob.steps.map(item => item.address);

    return (
      <View>
        <LabelText>Locations</LabelText>
        <LocationInfo>
          <LocationRow>
            <IconWrap>
              <Location1Icon />
            </IconWrap>
            <InfoText numberOfLines={1}>
              {locations[0]}
            </InfoText>
          </LocationRow>

          {
            locations.length === 3 &&
            <View>
              <Border />
              <LocationRow>
                <IconWrap>
                  <Location2Icon />
                </IconWrap>
                <InfoText numberOfLines={1}>
                  {locations[1]}
                </InfoText>
              </LocationRow>
            </View>
          }

          {
            <View>
              <Border />
              <LocationRow>
                <IconWrap>
                  <Location3Icon />
                </IconWrap>
                <InfoText numberOfLines={1}>
                  {locations.length === 3 ? locations[2] : locations[1]}
                </InfoText>
              </LocationRow>
            </View>
          }
        </LocationInfo>
      </View>
    );
  };

  const renderContactInfo = () => {
    const jobDate = moment(focusedJob[JOB_DATE]);

    return (
      <ContactInfo>
        <InfoWrap>
          <LabelText>Customer</LabelText>
          <InfoText>{focusedJob.customerName}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Customer Contact & Phone Number</LabelText>
          <RowWrap>
            <InfoText>
              {`${focusedJob.steps[0].contactPersonOne || focusedJob.steps[1].contactPersonOne}  |  `}
            </InfoText>
            <IdWrap>
              <IdText>
                {focusedJob.steps[0].contactNumberOne || focusedJob.steps[1].contactNumberOne}
              </IdText>
            </IdWrap>
          </RowWrap>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>{`${jobDate.format('DD ddd')} | ${jobDate.format('hh:mm A')}`}</InfoText>
        </InfoWrap>
      </ContactInfo>
    );
  };

  const renderBinInfo = () => {
    return (
      <View>
        {
          focusedJob.steps[1].wasteTypeName ||
          focusedJob.steps[1].binTypeName ||
          focusedJob.steps[1].binNumber
          ? <BinButtonWrap>
              <BinButton
                active={index === 0}
                onPress={() => setIndex(0)}
              >
                <BinButtonText active={index === 0}>Bin1</BinButtonText>
              </BinButton>
              <BinButton
                active={index === 1}
                onPress={() => setIndex(1)}
              >
                <BinButtonText active={index === 1}>Bin2</BinButtonText>
              </BinButton>
            </BinButtonWrap>
          : <BinButtonWrap>
              <BinButton
                active={index === 0}
                onPress={() => setIndex(0)}
              >
                <BinButtonText active={index === 0}>Bin</BinButtonText>
              </BinButton>
            </BinButtonWrap>
        }
        <BinInfoWrap>
          <BinInfoRow>
            <BinText numberOfLines={2}>{focusedJob.steps[index].wasteTypeName}</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText numberOfLines={2}>{focusedJob.steps[index].binTypeName}</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText numberOfLines={2}>{focusedJob.steps[index].binNumber}</BinText>
          </BinInfoRow>
        </BinInfoWrap>
      </View>
    );
  };

  const renderInstructions = () => {
    return (
      <InstructionsWrap>
        <InfoText>Instructions</InfoText>
        <InstructionsContent>
          <InstructionsText>
            {focusedJob.instructionToDrivers || ''}
          </InstructionsText>
        </InstructionsContent>
      </InstructionsWrap>
    );
  }

  const renderPhotoAndSign = () => {
    return (
      <PhotoAndSignWrap>
        <TouchableOpacity onPress={onPhoto}>
          <RowWrap>
            <CameraIcon />
            <PhotoAndSignText>Photo</PhotoAndSignText>
          </RowWrap>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSign}>
          <RowWrap>
            <SignIcon />
            <PhotoAndSignText>Sign</PhotoAndSignText>
          </RowWrap>
        </TouchableOpacity>
      </PhotoAndSignWrap>
    );
  }

  return (
    <Container>
      {
        JOB_STATUS.FOR_ACKNOWLEDGE.includes(focusedJob.statusName)
        ? <HeaderBar
            centerIcon={<ScreenText>{focusedJob.jobTypeName}</ScreenText>}
            leftIcon={<BackButton />}
            rightIcon={<EmptyWrap />}
            onPressLeft={onBack}
          />
        : <ShadowWrap>
            <HeaderBar
              centerIcon={<ScreenText>{focusedJob.jobTypeName}</ScreenText>}
              leftIcon={<BackButton />}
              rightIcon={<EmptyWrap />}
              onPressLeft={onBack}
            />

            { renderButton() }
          </ShadowWrap>
      }

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <JobDetails>
          <ShadowWrap>
            <Content>
              { renderLocationInfo() }
              { renderContactInfo() }
              { renderBinInfo() }
              { renderInstructions() }

              {
                // (focusedJob.statusName === JOB_STATUS.IN_PROGRESS2 ||
                // (focusedJob.statusName === JOB_STATUS.IN_PROGRESS1 && focusedJob.steps.length === 2)) &&
                renderPhotoAndSign()
              }

              {
                JOB_STATUS.FOR_ACKNOWLEDGE.includes(focusedJob.statusName) &&
                <DefaultButton
                  text={'Acknowledge'}
                  color={COLORS.BLUE1}
                  onPress={onAcknowledge}
                  loading={loading}
                />
              }
            </Content>
          </ShadowWrap>
        </JobDetails>
      </ScrollView>
    </Container>
  );
};

JobDetailsScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  startJobs: PropTypes.func.isRequired,
  exchangeJobs: PropTypes.func.isRequired,
  completeJobs: PropTypes.func.isRequired,
  setCurrentScreenInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

JobDetailsScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
  };
};

const mapDispatchToProps = {
  acknowledgeJobs: Jobs.actionCreators.acknowledgeJobs,
  startJobs: Jobs.actionCreators.startJobs,
  exchangeJobs: Jobs.actionCreators.exchangeJobs,
  completeJobs: Jobs.actionCreators.completeJobs,
  setCurrentScreenInfo: ViewStore.actionCreators.setCurrentScreenInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);

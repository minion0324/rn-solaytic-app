import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  popScreen,
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
  ContractInfo,
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
  componentId,
}) => {
  const [ index, setIndex ] = useState(0);
  const [ loading, setLoading ] = useState(false);

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

  const renderContractInfo = () => {
    const jobDate = moment(focusedJob.jobDate);

    return (
      <ContractInfo>
        <InfoWrap>
          <LabelText>Customer</LabelText>
          <InfoText>{focusedJob.customerName}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Contract</LabelText>
          <RowWrap>
            <InfoText>{`${focusedJob.driverName}  |  `}</InfoText>
            <IdWrap>
              <IdText>{focusedJob.jobNumber}</IdText>
            </IdWrap>
          </RowWrap>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>{`${jobDate.format('DD ddd')} | ${jobDate.format('hh:mm A')}`}</InfoText>
        </InfoWrap>
      </ContractInfo>
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
            <BinText>{focusedJob.steps[index].wasteTypeName}</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText>{focusedJob.steps[index].binTypeName}</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText>{focusedJob.steps[index].binNumber}</BinText>
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
            Look out for bombs. if discovered, please contact the admin or the police.
          </InstructionsText>
        </InstructionsContent>
      </InstructionsWrap>
    );
  }

  const renderPhotoAndSign = () => {
    return (
      <PhotoAndSignWrap>
        <TouchableOpacity>
          <RowWrap>
            <CameraIcon />
            <PhotoAndSignText>Photo</PhotoAndSignText>
          </RowWrap>
        </TouchableOpacity>
        <TouchableOpacity>
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
              { renderContractInfo() }
              { renderBinInfo() }
              { renderInstructions() }

              {
                (focusedJob.statusName === JOB_STATUS.IN_PROGRESS2 ||
                (focusedJob.statusName === JOB_STATUS.IN_PROGRESS1 && focusedJob.steps.length === 2)) &&
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);

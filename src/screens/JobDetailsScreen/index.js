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
} from 'src/constants';
import {
  HeaderBar,
  ItemWrap,
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
  componentId,
}) => {
  const [ index, setIndex ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const onAcknowledge = () => {
    setLoading(true);

    acknowledgeJobs({
      jobIds: focusedJob.jobId,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onBack = () => {
    popScreen(componentId);
  };

  const renderLocationInfo = () => {
    return (
      <View>
        <LabelText>Locations</LabelText>
        <LocationInfo>
          <LocationRow>
            <IconWrap>
              <Location1Icon />
            </IconWrap>
            <InfoText>My Yard</InfoText>
          </LocationRow>
          <Border />
          <LocationRow>
            <IconWrap>
              <Location2Icon />
            </IconWrap>
            <InfoText>Merdeka Ferry Terminal 3</InfoText>
          </LocationRow>
          <Border />
          <LocationRow>
            <IconWrap>
              <Location3Icon />
            </IconWrap>
            <InfoText>My Yard</InfoText>
          </LocationRow>
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
        <BinButtonWrap>
          <BinButton active>
            <BinButtonText active>Bin1</BinButtonText>
          </BinButton>
          <BinButton>
            <BinButtonText>Bin2</BinButtonText>
          </BinButton>
        </BinButtonWrap>
        <BinInfoWrap>
          <BinInfoRow>
            <BinText>Paper disposal</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText>5 ft bin (5 * 8 * 16)</BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText>Bin Number</BinText>
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
        focusedJob.statusName === 'Assigned'
        ? <HeaderBar
            centerIcon={<ScreenText>Exchange Bin</ScreenText>}
            leftIcon={<BackButton />}
            onPressLeft={onBack}
          />
        : <ShadowWrap>
            <HeaderBar
              centerIcon={<ScreenText>Exchange Bin</ScreenText>}
              leftIcon={<BackButton />}
              onPressLeft={onBack}
            />
            <ButtonWrap>
              <DefaultButton
                color={COLORS.BLUE1}
                text={'Start'}
              />
            </ButtonWrap>
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
                focusedJob.statusName !== 'Assigned' &&
                renderPhotoAndSign()
              }

              {
                focusedJob.statusName === 'Assigned' &&
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);

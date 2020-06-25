import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

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
  ButtonWrap,
  JobDetails,
  Content,
  LabelText,
  InfoText,
  LocationInfo,
  LocationRow,
  IconWrap,
  Border,
  CustomerInfo,
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
  componentId,
  type,
}) => {
  const [ index, setIndex ] = useState(0);

  const toBack = () => {
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

  const renderCustomerInfo = () => {
    return (
      <CustomerInfo>
        <InfoWrap>
          <LabelText>Customer</LabelText>
          <InfoText>Cheetah projects Co.</InfoText>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Contract</LabelText>
          <RowWrap>
            <InfoText>Michael Tan  |  </InfoText>
            <IdWrap>
              <IdText>898981112</IdText>
            </IdWrap>
          </RowWrap>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>15 Jan | 3:30 PM</InfoText>
        </InfoWrap>
      </CustomerInfo>
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
        type
        ? <ShadowWrap>
            <HeaderBar
              centerIcon={<ScreenText>Exchange Bin</ScreenText>}
              leftIcon={<BackButton />}
              onPressLeft={toBack}
            />
            <ButtonWrap>
              <DefaultButton
                color={COLORS.BLUE1}
                text={'Start'}
              />
            </ButtonWrap>
          </ShadowWrap>
        : <HeaderBar
            centerIcon={<ScreenText>Exchange Bin</ScreenText>}
            leftIcon={<BackButton />}
            onPressLeft={toBack}
          />
      }

      <ScrollView>
        <JobDetails>
          <ShadowWrap>
            <Content>
              { renderLocationInfo() }
              { renderCustomerInfo() }
              { renderBinInfo() }
              { renderInstructions() }
              { renderPhotoAndSign() }
              {
                // <DefaultButton
                //   color={COLORS.BLUE1}
                //   text={'Acknowledge'}
                // />
              }

            </Content>
          </ShadowWrap>
        </JobDetails>
      </ScrollView>
    </Container>
  );
};

JobDetailsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
  type: PropTypes.string,
};

JobDetailsScreen.defaultProps = {
  type: '',
};

export default JobDetailsScreen;

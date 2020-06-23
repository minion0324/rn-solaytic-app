import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import {
  SVGS,
  COLORS,
  SIZE1,
} from 'src/constants';
import {
  HeaderBar,
  ItemWrap,
} from 'src/components';
import {
  dismissModal,
} from 'src/navigation';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  JobText,
  BackButton,
} from 'src/styles/header.styles';

import {
  LabelText,
  ContentText,
  InfoRow,
  InfoWrap,
  ButtonWrap,
  Button,
  ButtonText,
  Content,

  InfoView,
  LocationRow,
  LocationText,
  Location2Text,
  NameRow,
  NameText,
  ItemRow,
  ItemText,
  ToolRow,
  ItemContent,
} from './styled';

const {
  MessageIcon,
  CameraIcon,
  PhoneIcon,
} = SVGS;

const JobDetailsScreen = ({ componentId }) => {
  const [ index, setIndex ] = useState(0);

  const toBack = () => {
    dismissModal(componentId);
  };

  const renderFirstPart = () => {
    const activated = index === 0;
    const deactivated = !activated;

    return (
      <ItemWrap
        onPress={() => setIndex(0)}
        activated={activated}
        deactivated={deactivated}
        mTop={SIZE1}
        mBottom={SIZE1}
      >
        <ItemContent>
          <InfoView>
            <LocationRow>
              <LocationText
                opacity={activated ? 1 : 0.2}
              >
                {'LP 120 tanah Merah Coast Road'}
              </LocationText>
            </LocationRow>

            <NameRow>
              <NameText
                opacity={activated ? 1 : 0.2}
              >
                {'Michael Tan'}
              </NameText>
            </NameRow>
          </InfoView>

          {
            activated &&
            ['5FT (5 * 8 * 16)', 'RUBBISH'].map(item => (
              <ItemRow
                key={item}
                activated={activated}
              >
                <ItemText>{item}</ItemText>
              </ItemRow>
            ))
          }

          {
            activated &&
            <ToolRow>
              <TouchableOpacity>
                <MessageIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <CameraIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <PhoneIcon />
              </TouchableOpacity>
            </ToolRow>
          }
        </ItemContent>
      </ItemWrap>
    );
  };

  const renderSecondPart = () => {
    const activated = index === 1;
    const deactivated = !activated;

    return (
      <ItemWrap
        onPress={() => setIndex(1)}
        activated={activated}
        deactivated={deactivated}
        mTop={SIZE1}
        mBottom={SIZE1}
      >
        <ItemContent>
          <InfoView>
            <LocationRow>
              <LocationText
                opacity={activated ? 1 : 0.7}
              >
                {'My Yard'}
              </LocationText>
            </LocationRow>
            <Location2Text
              opacity={activated ? 1 : 0.7}
            >
              {'123, Recycling Road, Singapore 123456'}
            </Location2Text>
          </InfoView>

          {
            ['5FT (5 * 8 * 16)', 'RUBBISH', '97821'].map(item => (
              <ItemRow
                key={item}
                activated={activated}
              >
                <ItemText
                  opacity={activated ? 1 : 0.2}
                >
                  {item}
                </ItemText>
              </ItemRow>
            ))
          }

          {
            activated &&
            <ToolRow>
              <TouchableOpacity>
                <MessageIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <CameraIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <PhoneIcon />
              </TouchableOpacity>
            </ToolRow>
          }
        </ItemContent>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<BackButton />}
          onPressLeft={toBack}
          rightIcon={<JobText>#D918291979</JobText>}
        />
      </ShadowWrap>

      <Content>
        <InfoRow>
          <InfoWrap>
            <LabelText>Customer</LabelText>
            <ContentText>Heathcote and Sons</ContentText>
          </InfoWrap>
        </InfoRow>
        <InfoRow>
          <InfoWrap>
            <LabelText>Job Date / Time</LabelText>
            <ContentText>22-01-2020, 9:00 AM</ContentText>
          </InfoWrap>
          <InfoWrap forEnd>
            <LabelText>Job Type</LabelText>
            <ContentText>Exchange Bin</ContentText>
          </InfoWrap>
        </InfoRow>
      </Content>

      <ScrollView bounces={false}>
        {
          renderFirstPart()
        }
        {
          renderSecondPart()
        }
      </ScrollView>

      <ButtonWrap>
        <Button color={COLORS.WHITE1}>
          <ButtonText color={COLORS.RED1}>
            Report Problem
          </ButtonText>
        </Button>
        <Button color={COLORS.GRAY2}>
          <ButtonText color={COLORS.BLACK2} font={15}>
            Start
          </ButtonText>
        </Button>
      </ButtonWrap>
    </Container>
  );
};

JobDetailsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobDetailsScreen;

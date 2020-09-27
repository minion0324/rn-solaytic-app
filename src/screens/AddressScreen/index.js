import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLocation } from 'react-native-map-link';

import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
  JOB_STATUS,
  SIZE1,
  SIZE2,
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  Jobs,
} from 'src/redux';
import {
  openUrl,
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
  TitleText,
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

import {
  IconWrap,
  ButtonWrap,
  Location1Line,
  Location2Line,
  Location3Line,
} from './styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  AddressIcon,
  PhoneIcon,
  MapIcon,
} = SVGS;

const AddressScreen = ({
  focusedJob,
  jobStatus,
  customerSiteIndex,
  componentId,
}) => {

  const onBack = () => {
    popScreen(componentId);
  };

  const onLocation = (latitude, longitude) => {
    showLocation({ latitude, longitude });
  };

  const onContact = (phoneNumber) => {
    openUrl(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <IconWrap>
              {
                index === 0
                ? <Location1Icon />
                : index === 1
                  ? <Location2Icon />
                  : <Location3Icon />
              }
            </IconWrap>
            <FlexWrap>
              {
                index === customerSiteIndex
                ? <TitleText>
                    {item.address}
                  </TitleText>
                : <InfoText>
                    {item.siteName}
                  </InfoText>
              }
              {
                index !== customerSiteIndex &&
                <LabelText>
                  {item.address}
                </LabelText>
              }
              {
                JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
                ? index === customerSiteIndex &&
                  <ButtonWrap forCenter>
                    <SpaceView mTop={SIZE2} />
                    <TouchableOpacity
                      onPress={() => onLocation(item.latitude, item.longitude)}
                    >
                      <RowWrap>
                        <MapIcon />
                        <SpaceView mLeft={SIZE1} />
                        <LabelText>
                          {'Show map'}
                        </LabelText>
                      </RowWrap>
                    </TouchableOpacity>
                    <SpaceView mTop={SIZE2} />
                  </ButtonWrap>
                : <ButtonWrap>
                    <TouchableOpacity
                      onPress={() => onLocation(item.latitude, item.longitude)}
                    >
                      <LabelText color={COLORS.BLUE1}>
                        {'Show on map'}
                      </LabelText>
                    </TouchableOpacity>
                  </ButtonWrap>
              }
              {
                index === customerSiteIndex &&
                <TitleText>
                  {item.siteName}
                </TitleText>
              }
              {
                index === customerSiteIndex &&
                (
                  (!!item.contactPersonOne && !!item.contactNumberOne) ||
                  (!!item.contactPersonTwo && !!item.contactNumberTwo)
                ) &&
                <ButtonWrap>
                  {
                    !!item.contactPersonOne &&
                    !!item.contactNumberOne &&
                    <DefaultButton
                      color={
                        JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
                        ? COLORS.GRAY3 : COLORS.GREEN1
                      }
                      text={item.contactPersonOne}
                      onPress={
                        JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
                        ? null
                        : () => onContact(item.contactNumberOne)
                      }
                      icon={<PhoneIcon />}
                      mTop={SIZE1}
                      mBottom={SIZE1}
                    />
                  }

                  {
                    !!item.contactPersonTwo &&
                    !!item.contactNumberTwo &&
                    <DefaultButton
                      color={
                        JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
                        ? COLORS.GRAY3 : COLORS.GREEN1
                      }
                      text={item.contactPersonTwo}
                      onPress={
                        JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
                        ? null
                        : () => onContact(item.contactNumberOne)
                      }
                      icon={<PhoneIcon />}
                      mTop={SIZE1}
                      mBottom={SIZE1}
                    />
                  }
                </ButtonWrap>
              }
            </FlexWrap>
          </RowWrap>
        </ContentWrap>
        {
          index === 0
          ? <Location1Line />
          : index === 1
            ? focusedJob.steps.length === 2
              ? <Location3Line />
              : <Location2Line />
            : <Location3Line />
        }
      </View>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              <AddressIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Address</ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <FlatList
          bounces={false}
          data={focusedJob.steps}
          keyExtractor={(item) => `${item.jobStepId}`}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      </Content>
    </Container>
  );
};

AddressScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  jobStatus: PropTypes.string.isRequired,
  customerSiteIndex: PropTypes.number.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddressScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    jobStatus: Jobs.selectors.getJobStatus(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressScreen);

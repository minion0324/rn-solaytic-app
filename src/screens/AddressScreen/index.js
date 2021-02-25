import React, { useMemo } from 'react';
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
} from 'src/styles/text.styles';

import {
  JobTypeWrap,
  LocationWrap,
  IconWrap,
  ButtonWrap,
  LocationIcon,
  Location1Line,
  Location2Line,
  Location3Line,
} from './styled';

const {
  AddressIcon,
  Phone1Icon,
  Phone2Icon,
  MapIcon,
} = SVGS;

const AddressScreen = ({
  focusedJob,
  jobStatus,
  customerSiteIndex,
  componentId,
}) => {
  const isDisabled = useMemo(() => {
    return JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus);
  }, [jobStatus]);

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
    console.log(item);

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap
          color={COLORS.WHITE2}
          mLeft={SIZE1} mRight={SIZE1}
        >
          <LocationWrap>
            <IconWrap>
              <LocationIcon>
                <TitleText>{index + 1}</TitleText>
              </LocationIcon>
            </IconWrap>
            <FlexWrap>
              <TitleText>
                {item.address}
              </TitleText>
              {
                item.site &&
                index === customerSiteIndex &&
                <View>
                  <SpaceView mTop={SIZE1} />
                  {
                    !!item.site.blockNo &&
                    <View>
                      <SpaceView mTop={SIZE1} />
                      <InfoText>
                        {`Block: ${item.site.blockNo}`}
                      </InfoText>
                    </View>
                  }
                  {
                    !!item.site.unitNo &&
                    <View>
                      <SpaceView mTop={SIZE1} />
                      <InfoText>
                        {`Unit No.: ${item.site.unitNo}`}
                      </InfoText>
                    </View>
                  }
                  {
                    !!item.site.postalCode &&
                    <View>
                      <SpaceView mTop={SIZE1} />
                      <InfoText>
                        {`Postal Code: ${item.site.postalCode}`}
                      </InfoText>
                    </View>
                  }
                  {
                    !!item.site.instructions &&
                    <View>
                      <SpaceView mTop={SIZE2} />
                      <InfoText>
                        {item.site.instructions}
                      </InfoText>
                    </View>
                  }
                </View>
              }
              {
                isDisabled
                ? index === customerSiteIndex &&
                  <ButtonWrap forCenter>
                    <SpaceView mTop={SIZE1} />
                    <TouchableOpacity
                      onPress={() => onLocation(item.latitude, item.longitude)}
                    >
                      <RowWrap>
                        <MapIcon />
                        <SpaceView mLeft={SIZE1} />
                        <TitleText>
                          {'Show map'}
                        </TitleText>
                      </RowWrap>
                    </TouchableOpacity>
                  </ButtonWrap>
                : <ButtonWrap>
                    <TouchableOpacity
                      onPress={() => onLocation(item.latitude, item.longitude)}
                    >
                      <TitleText color={COLORS.BLUE5}>
                        {'Show on map'}
                      </TitleText>
                    </TouchableOpacity>
                  </ButtonWrap>
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
                        isDisabled
                        ? COLORS.GRAY3 : COLORS.BLUE1
                      }
                      text={item.contactPersonOne}
                      onPress={
                        isDisabled
                        ? null
                        : () => onContact(item.contactNumberOne)
                      }
                      icon={
                        isDisabled
                        ? <Phone1Icon /> : <Phone2Icon />
                      }
                      mTop={SIZE1}
                      mBottom={SIZE1}
                    />
                  }

                  {
                    !!item.contactPersonTwo &&
                    !!item.contactNumberTwo &&
                    <DefaultButton
                      color={
                        isDisabled
                        ? COLORS.GRAY3 : COLORS.BLUE1
                      }
                      text={item.contactPersonTwo}
                      onPress={
                        isDisabled
                        ? null
                        : () => onContact(item.contactNumberTwo)
                      }
                      icon={
                        isDisabled
                        ? <Phone1Icon /> : <Phone2Icon />
                      }
                      mTop={SIZE1}
                      mBottom={SIZE1}
                    />
                  }
                </ButtonWrap>
              }
            </FlexWrap>
          </LocationWrap>
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
              <ScreenText>ADDRESS</ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <JobTypeWrap>
          <TitleText>
            {focusedJob.jobTypeName}
          </TitleText>
        </JobTypeWrap>

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

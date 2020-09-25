import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
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
} from './styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  AddressIcon,
} = SVGS;

const AddressScreen = ({
  focusedJob,
  stepIndex,
  componentId,
}) => {

  const onBack = () => {
    popScreen(componentId);
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
        <ScrollView>
          {
            focusedJob.steps.map((item, index) => (
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
                        index === stepIndex
                        ? <TitleText>
                            {item.address}
                          </TitleText>
                        : <InfoText>
                            {item.siteName}
                          </InfoText>
                      }
                      {
                        index !== stepIndex &&
                        <LabelText>
                          {item.address}
                        </LabelText>
                      }
                      <ButtonWrap>
                        <TouchableOpacity>
                          <LabelText color={COLORS.BLUE1}>
                            {'Show on map'}
                          </LabelText>
                        </TouchableOpacity>
                      </ButtonWrap>
                      {
                        index === stepIndex &&
                        <TitleText>
                          {item.siteName}
                        </TitleText>
                      }

                      {
                        index === stepIndex &&
                        <ButtonWrap>
                        <DefaultButton
                          color={COLORS.GREEN1}
                          text={item.contactPersonOne}
                          onPress={() => {}}
                          mTop={SIZE1}
                          mBottom={SIZE1}
                        />
                        {
                          item.contactPersonTwo &&
                          item.contactNumberTwo &&
                          <DefaultButton
                            color={COLORS.GREEN1}
                            text={item.contactPersonTwo}
                            onPress={() => {}}
                            mTop={SIZE1}
                            mBottom={SIZE1}
                          />
                        }
                        </ButtonWrap>
                      }
                    </FlexWrap>
                  </RowWrap>
                </ContentWrap>
              </View>
            ))
          }

        </ScrollView>
      </Content>
    </Container>
  );
};

AddressScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  stepIndex: PropTypes.number,
  componentId: PropTypes.string.isRequired,
};

AddressScreen.defaultProps = {
  stepIndex: 0,
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressScreen);

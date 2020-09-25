import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HeaderBar,
} from 'src/components';
import {
  popScreen,
  pushScreen,
  SCAN_CODE_SCREEN,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
} from 'src/constants';

import {
  Container,
  Content,
  ContentWrap,
  WrapBorder,
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

const {
  ActiveBinInIcon,
  ActiveBinOutIcon,
  QrCodeIcon,
} = SVGS;

const BinInfoScreen = ({
  bin,
  binInOutIndex,
  componentId,
}) => {

  const onBack = () => {
    popScreen(componentId);
  };

  const onScanCode = () => {
    pushScreen(componentId, SCAN_CODE_SCREEN);
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              {
                binInOutIndex === 0 &&
                <ActiveBinInIcon />
              }
              {
                binInOutIndex === 1 &&
                <ActiveBinOutIcon />
              }
              <SpaceView mLeft={SIZE1} />
              <ScreenText>
                {`Bin ${binInOutIndex === 0 ? 'In' : binInOutIndex === 1 ? 'Out' : ''}`}
              </ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <ScrollView>
          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <RowWrap>
              <SpaceView mLeft={SIZE2} />
              <FlexWrap flex={6}>
                <View>
                  <LabelText>Bin ID</LabelText>
                  <InfoText>{bin['binNumber']}</InfoText>
                  <WrapBorder />
                </View>
                <SpaceView mTop={SIZE4} />
                <View>
                  <LabelText>Bin Type</LabelText>
                  <InfoText>
                    {bin['binType'] && bin['binType']['binTypeName']}
                  </InfoText>
                  <WrapBorder />
                </View>
              </FlexWrap>
              <FlexWrap flex={4}>
                <RowWrap>
                  <FlexWrap />
                  <TouchableOpacity onPress={onScanCode}>
                    <QrCodeIcon />
                  </TouchableOpacity>
                </RowWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
            </RowWrap>
          </ContentWrap>

          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <RowWrap>
              <SpaceView mLeft={SIZE2} />
              <FlexWrap flex={6}>
                <View>
                  <LabelText>Nett Weight</LabelText>
                  <InfoText>{bin['binWeight']}</InfoText>
                  <WrapBorder />
                </View>

              </FlexWrap>
              <FlexWrap flex={4} />
              <SpaceView mLeft={SIZE2} />
            </RowWrap>
          </ContentWrap>

          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <SpaceView mLeft={SIZE2} />
            <View>
              <LabelText>Waste Type</LabelText>
              <InfoText>Paper disposal</InfoText>
            </View>
            <SpaceView mLeft={SIZE2} />
          </ContentWrap>
        </ScrollView>
      </Content>
    </Container>
  );
};

BinInfoScreen.propTypes = {
  bin: PropTypes.object.isRequired,
  binIndex: PropTypes.number.isRequired,
  binInOutIndex: PropTypes.number.isRequired,
  componentId: PropTypes.string.isRequired,
};

BinInfoScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    //
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BinInfoScreen);

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { useNavigationComponentDidDisappear } from 'react-native-navigation-hooks';

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
  Jobs,
} from 'src/redux';

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
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

import {
  BinInput,
  BinSearch,
} from './styled';

const {
  ActiveBinInIcon,
  ActiveBinOutIcon,
  QrCodeIcon,
  BinSearchIcon,
} = SVGS;

const BinInfoScreen = ({
  focusedJob,
  binInfo,
  setBinInfo,
  binIndex,
  binInOutInfoIndex,
  componentId,
}) => {
  const [ originBinInfo, setOriginBinInfo ] = useState([]);

  const [ chargeIndex, setChargeIndex ] = useState(-1);

  const [ actionSheetData, setActionSheetData ] = useState([]);

  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const bin = useMemo(() => {
    return originBinInfo[binIndex] || {};
  }, [originBinInfo, binIndex]);

  useEffect(() => {
    setOriginBinInfo(binInfo);
  }, []);

  useNavigationComponentDidDisappear(() => {
    setBinInfo(originBinInfo);
  });

  const onUpdateBinInfo = (newInfo) => {
    const newBinInfo = originBinInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setOriginBinInfo(newBinInfo);
  };

  const onBack = () => {
    Keyboard.dismiss();
    popScreen(componentId);
  };

  const onScanCode = () => {
    pushScreen(componentId, SCAN_CODE_SCREEN, {
      binIndex,
      binInfo: originBinInfo,
      setBinInfo: setOriginBinInfo,
    });
  };

  const onActionSheetPress = (index) => {
    const { charges } = focusedJob;

    if (index === actionSheetData.length) {
      return;
    }

    if (
      actionSheetKey.current === 'wasteType' ||
      actionSheetKey.current === 'binType'
    ) {
      onUpdateBinInfo({
        wasteType: charges[index].wasteType,
        binType: charges[index].binType,
      });

      setChargeIndex(index);
    } else {
      onUpdateBinInfo({
        binNumber: charges[chargeIndex].binType.binNumbers[index].binNumberName,
      });
    }
  };

  const getInitChargeIndex = () => {
    try {
      const { charges } = focusedJob;
      const { binTypeId } = bin.binType;

      const index = charges
        .findIndex(charge => charge.binType.binTypeId === binTypeId);

      if (index !== -1) {
        setChargeIndex(index);
      }

      return index;
    } catch (error) {
      return -1;
    }
  };

  const onShowActionSheet = (key) => {
    const { charges } = focusedJob;

    if (charges.length === 0) {
      Alert.alert('Warning', 'The customer has no Bin / Waste.');
      return;
    }

    actionSheetKey.current = key;

    let data = [];
    if (key === 'wasteType' || key === 'binType') {
      data = charges
        .map(charge => charge[key][`${key}Name`]);
    } else {
      const index = chargeIndex !== -1
        ? chargeIndex
        : getInitChargeIndex();

      if (index === -1) {
        Alert.alert('Warning', 'You can take Bin Numbers after a Bin Type is selected.');
        return;
      }

      data = charges[index].binType.binNumbers
        .map(binNumber => binNumber[`${key}Name`]);

      if (data.length === 0) {
        Alert.alert('Warning', 'There are no Bin Numbers.');
        return;
      }
    }
    setActionSheetData(data);

    actionSheetRef.current.show();
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              {
                binInOutInfoIndex === 0 &&
                <ActiveBinInIcon />
              }
              {
                binInOutInfoIndex === 1 &&
                <ActiveBinOutIcon />
              }
              <SpaceView mLeft={SIZE1} />
              <ScreenText>
                {
                  `Bin ${
                    binInOutInfoIndex === 0
                    ? 'In'
                    : binInOutInfoIndex === 1
                      ? 'Out' : ''}`
                }
              </ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <RowWrap>
              <SpaceView mLeft={SIZE2} />
              <FlexWrap flex={6}>
                <View>
                  <LabelText>
                    {
                      focusedJob.isRequiredBinNumberToStart
                      ? 'Bin ID *' : 'Bin ID'
                    }
                  </LabelText>
                  <BinInput
                    underlineColorAndroid={COLORS.TRANSPARENT1}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={'BIN NUMBER'}
                    value={`${bin['binNumber'] || ''}`}
                    onChangeText={(text) => onUpdateBinInfo({ binNumber: text })}
                    editable={focusedJob.isAllowDriverEditOnApp}
                  />
                  <WrapBorder />
                </View>
                <SpaceView mTop={SIZE4} />
                <View>
                  <RowWrap>
                    <FlexWrap>
                      <LabelText>Bin Type</LabelText>
                      <InfoText>
                        {bin['binType'] && bin['binType']['binTypeName']}
                      </InfoText>
                    </FlexWrap>
                    {
                      focusedJob.isAllowDriverEditOnApp &&
                      <BinSearch
                        onPress={() => onShowActionSheet('binType')}
                      >
                        <BinSearchIcon />
                      </BinSearch>
                    }
                  </RowWrap>
                  <WrapBorder />
                </View>
              </FlexWrap>
              <FlexWrap flex={4}>
                <RowWrap>
                  <FlexWrap />
                  {
                    focusedJob.isAllowDriverEditOnApp &&
                    <TouchableOpacity onPress={onScanCode}>
                      <QrCodeIcon />
                    </TouchableOpacity>
                  }
                </RowWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
            </RowWrap>
          </ContentWrap>

          <View>
            <SpaceView mTop={SIZE2} />
            <ContentWrap>
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <FlexWrap>
                  <RowWrap>
                    <FlexWrap>
                      <LabelText>Waste Type</LabelText>
                      <InfoText>
                        {bin['wasteType'] && bin['wasteType']['wasteTypeName']}
                      </InfoText>
                    </FlexWrap>
                    {
                      focusedJob.isAllowDriverEditOnApp &&
                      <BinSearch
                        onPress={() => onShowActionSheet('wasteType')}
                      >
                        <BinSearchIcon />
                      </BinSearch>
                    }
                  </RowWrap>
                  <WrapBorder />
                </FlexWrap>
                <SpaceView mLeft={SIZE2} />
              </RowWrap>
            </ContentWrap>
          </View>

          {
            focusedJob.isEnabledBinWeight &&
            <View>
              <SpaceView mTop={SIZE2} />
              <ContentWrap>
                <RowWrap>
                  <SpaceView mLeft={SIZE2} />
                  <FlexWrap flex={6}>
                    <View>
                      <LabelText>Nett Weight</LabelText>
                      <RowWrap>
                        <FlexWrap>
                          <BinInput
                            underlineColorAndroid={COLORS.TRANSPARENT1}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            placeholder={'BIN WEIGHT'}
                            keyboardType={'numeric'}
                            value={`${bin['binWeight'] || ''}`}
                            onChangeText={(text) => onUpdateBinInfo({ binWeight: text })}
                            editable={focusedJob.isAllowDriverEditOnApp}
                          />
                        </FlexWrap>
                        <InfoText>tons</InfoText>
                      </RowWrap>
                      <WrapBorder />
                    </View>
                  </FlexWrap>
                  <FlexWrap flex={4} />
                  <SpaceView mLeft={SIZE2} />
                </RowWrap>
              </ContentWrap>
            </View>
          }
        </ScrollView>
      </Content>

      <ActionSheet
        ref={actionSheetRef}
        title={'Please select one.'}
        options={[ ...actionSheetData, 'Cancel' ]}
        cancelButtonIndex={actionSheetData.length}
        onPress={onActionSheetPress}
      />
    </Container>
  );
};

BinInfoScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  binIndex: PropTypes.number.isRequired,
  binInOutInfoIndex: PropTypes.number.isRequired,
  componentId: PropTypes.string.isRequired,
};

BinInfoScreen.defaultProps = {
  //
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
)(BinInfoScreen);

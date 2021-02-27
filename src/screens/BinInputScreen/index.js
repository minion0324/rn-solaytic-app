import React, { useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import {
  dismissLightBox,
} from 'src/navigation';
import {
  HeaderBar,
  OverlayWrap,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
} from 'src/constants';
import {
  pushScreen,
  SCAN_CODE_SCREEN,
} from 'src/navigation';

import {
  ContentWrap,
  BorderView,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  Back,
  EmptyWrap,
} from 'src/styles/header.styles';
import {
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

import {
  BinInput,
} from './styled';

const {
  ScanCodeIcon,
  GreenActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

const BinInputScreen = ({
  binIndex,
  binInfo,
  setBinInfo,
  onSuccess,
  onFailure,
  componentId,
}) => {
  const [ originBinInfo, setOriginBinInfo ] = useState([]);

  const bin = useMemo(() => {
    return originBinInfo[binIndex] || {};
  }, [originBinInfo, binIndex]);

  useEffect(() => {
    setOriginBinInfo(binInfo);
  }, []);

  const onUpdateBinInfo = (newInfo) => {
    const newBinInfo = originBinInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setOriginBinInfo(newBinInfo);
  };

  const onClose = () => {
    dismissLightBox(componentId);
  };

  const onScanCode = () => {
    pushScreen(componentId, SCAN_CODE_SCREEN, {
      binIndex,
      binInfo: originBinInfo,
      setBinInfo: setOriginBinInfo,
    });
  };

  const renderBinNumber = () => (
    <View>
      <SpaceView mTop={SIZE2} />
      <RowWrap>
        <FlexWrap>
          <LabelText>Bin ID</LabelText>
          <BinInput
            underlineColorAndroid={COLORS.TRANSPARENT1}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={'BIN NUMBER'}
            value={`${bin['binNumber'] || ''}`}
            onChangeText={(text) =>
              onUpdateBinInfo({ binNumber: text })
            }
          />
          <SpaceView mTop={SIZE1} />
        </FlexWrap>
        <RowWrap>
          <SpaceView mLeft={SIZE3} />
          <TouchableOpacity onPress={onScanCode}>
            <ScanCodeIcon />
          </TouchableOpacity>
          {
            <RowWrap>
              <SpaceView mLeft={SIZE3} />
              {
                bin['binNumber']
                ? <GreenActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
            </RowWrap>
          }
        </RowWrap>
      </RowWrap>
      <BorderView color={COLORS.BLUE1} />
      <SpaceView mTop={SIZE2} />
    </View>
  );

  const renderBinType = () => (
    bin['binType'] &&
    bin['binType']['binTypeName'] &&
    <View>
      <SpaceView mTop={SIZE2} />
      <RowWrap>
        <FlexWrap>
          <LabelText>Bin Type</LabelText>
          <InfoText>
            {
              bin['binType'] &&
              bin['binType']['binTypeName']
            }
          </InfoText>
        </FlexWrap>
      </RowWrap>
      <SpaceView mTop={SIZE2} />
    </View>
  );

  const renderWasteType = () => (
    <View>
      <SpaceView mTop={SIZE2} />
      <RowWrap>
        <FlexWrap>
          <LabelText>
            For Waste Type
          </LabelText>

          {
            bin['wasteTypes'].map((el, i) => (
              <View key={el.wasteTypeId}>
                {
                  i > 0 &&
                  <SpaceView mTop={SIZE1} />
                }
                <InfoText>
                  {el.wasteType.wasteTypeName || ''}
                </InfoText>
              </View>
            ))
          }
        </FlexWrap>
      </RowWrap>
      <SpaceView mTop={SIZE2} />
    </View>
  );

  const renderCompleteButton = () => (
    <View>
      <SpaceView mTop={SIZE4} />
      <RowWrap>
        <FlexWrap flex={1} />
        <FlexWrap flex={2}>
          <DefaultButton
            color={COLORS.BLUE1}
            text={'Complete'}
            onPress={onSuccess}
            // loading={
            //   status === 'ACTIVE'
            //   ? loading : null
            // }
            textColor={COLORS.WHITE1}
            bRadius={SIZE4}
          />
        </FlexWrap>
        <FlexWrap flex={1} />
      </RowWrap>
      <SpaceView mTop={SIZE4} />
    </View>
  );

  return (
    <OverlayWrap
      dismissOverlay={onClose}
      color={COLORS.WHITE1}
    >
      <HeaderBar
        centerIcon={
          <ScreenText>INPUT BIN NUMBER</ScreenText>
        }
        leftIcon={<Back />}
        rightIcon={<EmptyWrap />}
        onPressLeft={onClose}
      />

      <ContentWrap
        mLeft={0.1} mRight={0.1}
      >
        { renderBinNumber() }
        { renderBinType() }
        { renderWasteType() }
        { renderCompleteButton() }
      </ContentWrap>
    </OverlayWrap>
  );
};

BinInputScreen.propTypes = {
  binIndex: PropTypes.number.isRequired,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

export default BinInputScreen;

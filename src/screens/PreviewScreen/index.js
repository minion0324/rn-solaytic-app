import React, { useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  JOB_TYPE,
} from 'src/constants';
import {
  HeaderBar,
} from 'src/components';
import {
  Jobs,
} from 'src/redux';
import {
  popScreen,
} from 'src/navigation';

import {
  showLightBox,
  BLUETOOTH_PRINTER_SCREEN,
} from 'src/navigation';

import {
  Container,
  ContentWrap,
  WrapBorder,
  ShadowWrap,
  FullImage,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  Back,
  Sharing,
} from 'src/styles/header.styles';
import {
  TitleText,
  InfoText,
} from 'src/styles/text.styles';

import {
  HalfWrap,
  LogoImageWrap,
} from './styled';

const {
  PrintIcon,
} = SVGS;

const PreviewScreen = ({
  focusedJob,
  jobReceiptSetting,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  // services,
  amountCollected,
  getBinInOutInfoIndex,
  getCustomerSiteIndex,
  componentId,
}) => {
  const viewShotRef = useRef(null);

  const getReceiptSettingVariable = useCallback(
    (key) => {
      const index = jobReceiptSetting
        .findIndex(item => item.variableName === key);

      if (index === -1) {
        return '';
      }

      return jobReceiptSetting[index].variableValue;
    },
    [jobReceiptSetting],
  );

  const onBack = () => {
    popScreen(componentId);
  };

  const onViewShot = async () => {
    try {
      return await viewShotRef.current.capture();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onPrint = async () => {
    try {
      const base64Str = await onViewShot();

      showLightBox(BLUETOOTH_PRINTER_SCREEN, { base64Str });
    } catch (error) {
      //
    }
  };

  const onShare = async () => {
    try {
      const base64Str = await onViewShot();

      const mediaType = 'image/png';
      const base64Data = `data:${mediaType};base64,${base64Str}`;

      await Share.open({ url: base64Data });
    } catch (error) {
      //
    }
  };

  const renderDisclaimerText = () => {
    const disclaimerText = getReceiptSettingVariable('StringDisclaimerText');

    if (!disclaimerText) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <InfoText align={'center'}>
          {disclaimerText}
        </InfoText>
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderJobProof = () => {
    if (!sign.uri) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        {
          getReceiptSettingVariable('ShowSignature') === 'True' &&
          <View>
            <HalfWrap>
              <FullImage source={{ uri: sign.uri }} />
            </HalfWrap>
            <WrapBorder />
          </View>
        }
        {
          getReceiptSettingVariable('ShowSiteContact') === 'True' &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  Site Contact:
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText>
                  {signedUserName}
                </InfoText>
              </FlexWrap>
            </RowWrap>
          </View>
        }
        {
          getReceiptSettingVariable('ShowSiteTelephone') === 'True' &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  Telephone:
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText>
                  {signedUserContact}
                </InfoText>
              </FlexWrap>
            </RowWrap>
          </View>
        }
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  // const renderServices = () => {
  //   const selectedServices = services.filter(item => item.isSelected);
  //   if (selectedServices.length === 0) {
  //     return null;
  //   }

  //   return (
  //     <View>
  //       <SpaceView mTop={SIZE4} />
  //       <InfoText>
  //         ADDITIONAL SERVICE
  //       </InfoText>
  //       <SpaceView mTop={SIZE2} />
  //       <RowWrap>
  //         <FlexWrap>
  //           <InfoText>
  //             ITEM
  //           </InfoText>
  //         </FlexWrap>
  //         <InfoText>
  //           QTY
  //         </InfoText>
  //       </RowWrap>
  //       {
  //         selectedServices.map((item) => (
  //           <View
  //             key={`${item.serviceAdditionalChargeTemplateId}`}
  //           >
  //             <SpaceView mTop={SIZE2} />
  //             <RowWrap>
  //               <FlexWrap>
  //                 <InfoText>
  //                   {item.serviceAdditionalChargeName}
  //                 </InfoText>
  //               </FlexWrap>
  //               <InfoText>
  //                 {item.quantity || 1}
  //               </InfoText>
  //             </RowWrap>
  //           </View>
  //         ))
  //       }
  //       <SpaceView mTop={SIZE2} />
  //     </View>
  //   );
  // };

  const renderPayment = () => {
    if (!focusedJob.isEnabledCashCollection) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        {
          getReceiptSettingVariable('ShowPaymentType') === 'True' &&
          <View>
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {getReceiptSettingVariable('LabelPayment_Type') || 'Payment'}
                </InfoText>
              </FlexWrap>
              <InfoText>
                Cash
              </InfoText>
            </RowWrap>
            <SpaceView mTop={SIZE2} />
          </View>
        }
        {
          getReceiptSettingVariable('ShowAmountCollected') === 'True' &&
          <View>
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {getReceiptSettingVariable('LabelCollected_Cash') || 'Collected'}
                </InfoText>
              </FlexWrap>
              <InfoText>
                {
                  `$${amountCollected}`
                }
              </InfoText>
            </RowWrap>
            <SpaceView mTop={SIZE2} />
          </View>
        }
      </View>
    );
  };

  const renderBinInfo = () => {
    return (
      binInfo.map((item, index) => {
        const idx = getBinInOutInfoIndex(index);

        return (
          (item.wasteType || item.binType) &&
          <View key={`${item.jobStepId}`}>
            <SpaceView mTop={SIZE2} />
            {
              (
                (idx === 0 && getReceiptSettingVariable('ShowBinCollected') === 'True') ||
                (idx === 1 && getReceiptSettingVariable('ShowBinDelivered') === 'True') ||
                (idx !== 0 && idx !== 1)
              ) &&
              <View>
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <FlexWrap>
                    <InfoText>
                      {
                        (
                          idx === 0
                          ? getReceiptSettingVariable('LabelBin_Collected') || 'Bin Collected'
                          : ''
                        ) +
                        (
                          idx === 1
                          ? getReceiptSettingVariable('LabelBin_Delivered') || 'Bin Delivered'
                          : ''
                        ) +
                        (
                          idx !== 0 && idx !== 1 ? 'Bin' : ''
                        )
                      }
                    </InfoText>
                  </FlexWrap>
                  <InfoText>
                    {item['binNumber']}
                  </InfoText>
                </RowWrap>
              </View>
            }
            {
              (
                (idx === 0 && getReceiptSettingVariable('ShowBinCollectedType') === 'True') ||
                (idx === 1 && getReceiptSettingVariable('ShowBinDeliveredType') === 'True') ||
                (idx !== 0 && idx !== 1)
              ) &&
              <View>
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <FlexWrap>
                    <InfoText>
                      {
                        (
                          idx === 0
                          ? getReceiptSettingVariable('LabelBin_Type_Collected') || 'Bin Type'
                          : ''
                        ) +
                        (
                          idx === 1
                          ? getReceiptSettingVariable('LabelBin_Type_Delivered') || 'Bin Type'
                          : ''
                        ) +
                        (
                          idx !== 0 && idx !== 1 ? 'Bin Type' : ''
                        )
                      }
                    </InfoText>
                  </FlexWrap>
                  <InfoText>
                    {item['binType'] && item['binType']['binTypeName']}
                  </InfoText>
                </RowWrap>
              </View>
            }
            {
              (
                idx === 0 ||
                focusedJob.jobTypeName !== JOB_TYPE.EXCHANGE
              ) &&
              (
                (idx === 0 && getReceiptSettingVariable('ShowWasteTypeCollected') === 'True') ||
                (idx === 1 && getReceiptSettingVariable('ShowPlannedWasteType') === 'True') ||
                (idx !== 0 && idx !== 1)
              ) &&
              <View>
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <FlexWrap>
                    <InfoText>
                      {
                        (
                          idx === 0
                          ? getReceiptSettingVariable('LabelWaste_Type_Collected') || 'Waste Type'
                          : ''
                        ) +
                        (
                          idx === 1
                          ? getReceiptSettingVariable('LabelPlanned_Waste_Type') || 'Planned Waste Type'
                          : ''
                        ) +
                        (
                          idx !== 0 && idx !== 1 ? 'Waste Type' : ''
                        )
                      }
                    </InfoText>
                  </FlexWrap>
                  <InfoText>
                    {item['wasteType'] && item['wasteType']['wasteTypeName']}
                  </InfoText>
                </RowWrap>
              </View>
            }
            <SpaceView mTop={SIZE2} />
          </View>
        );
      })
    );
  };

  const renderJobInfo = () => {
    const index = getCustomerSiteIndex();

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <TitleText>
          {`DO #: ${focusedJob.jobNumber}`}
        </TitleText>
        <SpaceView mTop={SIZE4} />
        <InfoText>
          {
            getReceiptSettingVariable('LabelSite_Address') || 'Site Address'
          }
        </InfoText>
        <SpaceView mTop={SIZE2} />
        <InfoText>
          {focusedJob.steps[index].address}
        </InfoText>
        <SpaceView mTop={SIZE2} />
        <SpaceView mTop={SIZE4} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              {
                moment(
                  focusedJob.receiptCompletedDate ||
                  focusedJob.completedDate || focusedJob.jobTimeSpecific
                ).format('DD/MM/YYYY')
              }
            </InfoText>
          </FlexWrap>
          <InfoText>
            {
              moment(
                focusedJob.receiptCompletedDate ||
                focusedJob.completedDate || focusedJob.jobTimeSpecific
              ).format('hh:mm A')
            }
          </InfoText>
        </RowWrap>
        {
          focusedJob.assignedDriver &&
          focusedJob.assignedDriver.driverName &&
          getReceiptSettingVariable('ShowDriver') === 'True' &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {getReceiptSettingVariable('LabelDriver') || 'Driver'}
                </InfoText>
              </FlexWrap>
              <InfoText>
                {focusedJob.assignedDriver.driverName}
              </InfoText>
            </RowWrap>
          </View>
        }
        {
          focusedJob.assignedVehicle &&
          focusedJob.assignedVehicle.vehicleName &&
          getReceiptSettingVariable('ShowVehicle') === 'True' &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {getReceiptSettingVariable('LabelVehicle') || 'Vehicle'}
                </InfoText>
              </FlexWrap>
              <InfoText>
                {focusedJob.assignedVehicle.vehicleName}
              </InfoText>
            </RowWrap>
          </View>
        }
        <SpaceView mTop={SIZE2} />
        {
          getReceiptSettingVariable('ShowJobType') === 'True' &&
          <View>
            <SpaceView mTop={SIZE4} />
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {getReceiptSettingVariable('LabelJob_Type') || 'Job Type'}
                </InfoText>
              </FlexWrap>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </RowWrap>
            <SpaceView mTop={SIZE2} />
          </View>
        }
      </View>
    );
  };

  const renderHeaderText = () => {
    const headerText = getReceiptSettingVariable('StringHeaderText');

    if (!headerText) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <InfoText align={'center'}>
          {headerText}
        </InfoText>
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderLogo = () => {
    const logo = getReceiptSettingVariable('StringCompanyLogo');

    if (!logo) {
      return null;
    }

    return (
      <RowWrap>
        <FlexWrap flex={3} />
        <FlexWrap flex={4}>
          <LogoImageWrap>
            <FullImage
              resizeMode={'contain'}
              source={{ uri: logo }}
            />
          </LogoImageWrap>
        </FlexWrap>
        <FlexWrap flex={3} />
      </RowWrap>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={
          <TouchableOpacity onPress={onPrint}>
            <RowWrap>
              <PrintIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText
                color={COLORS.BLUE1}
              >
                SEARCH PRINTER
              </ScreenText>
            </RowWrap>
          </TouchableOpacity>
        }
        leftIcon={<Back />}
        rightIcon={<Sharing />}
        onPressLeft={onBack}
        onPressRight={onShare}
      />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        { renderHeader() }
      </ShadowWrap>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ result: 'base64' }}
        >
          <ContentWrap>
            <SpaceView mTop={SIZE2} />

            { renderLogo() }
            { renderHeaderText() }
            { renderJobInfo() }
            { renderBinInfo() }
            { renderPayment() }
            {
              // renderServices()
            }
            { renderJobProof() }
            { renderDisclaimerText() }

            <SpaceView mTop={SIZE4 * 4} />
          </ContentWrap>
        </ViewShot>
      </ScrollView>
    </Container>
  );
};

PreviewScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  jobReceiptSetting: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  // services: PropTypes.array.isRequired,
  amountCollected: PropTypes.number.isRequired,
  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

PreviewScreen.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    jobReceiptSetting: Jobs.selectors.getJobReceiptSetting(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreviewScreen);

import React, { useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import HTML from 'react-native-render-html';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  FONT,
  JOB_TYPE,
} from 'src/constants';
import {
  HeaderBar,
} from 'src/components';
import {
  Jobs,
} from 'src/redux';
import {
  showLightBox,
  popScreen,
  BLUETOOTH_PRINTER_SCREEN,
} from 'src/navigation';

import {
  Container,
  ContentWrap,
  BorderView,
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
  ActivePrintIcon,
} = SVGS;

const PreviewScreen = ({
  focusedJob,
  jobReceiptSetting,
  signs,
  binInfo,
  // services,
  amountCollected,
  jobPaymentType,
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
    const sign = signs[signs.length - 1];

    if (!sign) {
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
            <BorderView />
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
                  {sign.signedUserName}
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
                  {sign.signedUserContact}
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
  //         <FlexWrap flex={4}>
  //           <InfoText>
  //             ITEM
  //           </InfoText>
  //         </FlexWrap>
  //         <FlexWrap flex={6}>
  //           <InfoText align={'right'}>
  //             QTY
  //           </InfoText>
  //         </FlexWrap>
  //       </RowWrap>
  //       {
  //         selectedServices.map((item) => (
  //           <View
  //             key={`${item.serviceAdditionalChargeTemplateId}`}
  //           >
  //             <SpaceView mTop={SIZE2} />
  //             <RowWrap>
  //               <FlexWrap flex={4}>
  //                 <InfoText>
  //                   {item.serviceAdditionalChargeName}
  //                 </InfoText>
  //               </FlexWrap>
  //               <FlexWrap flex={6}>
  //                 <InfoText align={'right'}>
  //                   {item.quantity || 1}
  //                 </InfoText>
  //               </FlexWrap>
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
              <FlexWrap flex={4}>
                <InfoText>
                  {getReceiptSettingVariable('LabelPayment_Type') || 'Payment'}
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {focusedJob.jobPaymentTypeList[jobPaymentType]}
                </InfoText>
              </FlexWrap>
            </RowWrap>
            <SpaceView mTop={SIZE2} />
          </View>
        }
        {
          getReceiptSettingVariable('ShowAmountCollected') === 'True' &&
          <View>
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  {getReceiptSettingVariable('LabelCollected_Cash') || 'Collected'}
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {
                    `$${amountCollected}`
                  }
                </InfoText>
              </FlexWrap>
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
                  <FlexWrap flex={4}>
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
                  <FlexWrap flex={6}>
                    <InfoText align={'right'}>
                      {item['binNumber']}
                    </InfoText>
                  </FlexWrap>
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
                  <FlexWrap flex={4}>
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
                  <FlexWrap flex={6}>
                    <InfoText align={'right'}>
                      {item['binType'] && item['binType']['binTypeName']}
                    </InfoText>
                  </FlexWrap>
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
                  <FlexWrap flex={4}>
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
                  <FlexWrap flex={6}>
                    <InfoText align={'right'}>
                      {item['wasteType'] && item['wasteType']['wasteTypeName']}
                    </InfoText>
                  </FlexWrap>
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
          <FlexWrap flex={4}>
            <InfoText>
              {
                moment(
                  focusedJob.receiptCompletedDate ||
                  focusedJob.completedDate || focusedJob.jobTimeSpecific
                ).format('DD/MM/YYYY')
              }
            </InfoText>
          </FlexWrap>
          <FlexWrap flex={6}>
            <InfoText align={'right'}>
              {
                moment(
                  focusedJob.receiptCompletedDate ||
                  focusedJob.completedDate || focusedJob.jobTimeSpecific
                ).format('hh:mm A')
              }
            </InfoText>
          </FlexWrap>
        </RowWrap>
        {
          focusedJob.assignedDriver &&
          focusedJob.assignedDriver.driverName &&
          getReceiptSettingVariable('ShowDriver') === 'True' &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  {getReceiptSettingVariable('LabelDriver') || 'Driver'}
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {focusedJob.assignedDriver.driverName}
                </InfoText>
              </FlexWrap>
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
              <FlexWrap flex={4}>
                <InfoText>
                  {getReceiptSettingVariable('LabelVehicle') || 'Vehicle'}
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {focusedJob.assignedVehicle.vehicleName}
                </InfoText>
              </FlexWrap>
            </RowWrap>
          </View>
        }
        <SpaceView mTop={SIZE2} />
        {
          getReceiptSettingVariable('ShowJobType') === 'True' &&
          <View>
            <SpaceView mTop={SIZE4} />
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  {getReceiptSettingVariable('LabelJob_Type') || 'Job Type'}
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {focusedJob.jobTemplateName || focusedJob.jobTypeName}
                </InfoText>
              </FlexWrap>
            </RowWrap>
            <SpaceView mTop={SIZE2} />
          </View>
        }
      </View>
    );
  };

  const renderHeaderText = () => {
    const baseFontStyle = {
      fontSize: FONT(15),
      color: COLORS.BLACK2,
      textAlign: 'center',
    };

    const tagsStyles = {
      p: {
        marginTop: 0,
        marginBottom: 0,
      },
    };

    const containerStyle = {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    };

    const headerText = getReceiptSettingVariable('StringHeaderText');

    if (!headerText) {
      return null;
    }

    const htmlContent =
      `<div style='text-align: center;'>${headerText}</div>`.replace(
        /\n/g,
        `</div>\n<div style='text-align: center;'>`,
      );

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <HTML
          source={{ html: htmlContent }}
          baseFontStyle={baseFontStyle}
          tagsStyles={tagsStyles}
          containerStyle={containerStyle}
        />
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
              <ActivePrintIcon />
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
  signs: PropTypes.array.isRequired,
  binInfo: PropTypes.array.isRequired,
  // services: PropTypes.array.isRequired,
  amountCollected: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  jobPaymentType: PropTypes.number.isRequired,
  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

PreviewScreen.defaultProps = {
  amountCollected: '',
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

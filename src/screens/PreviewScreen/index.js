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
  getCustomerSiteAddress,
} from 'src/utils';

import {
  Container,
  Content,
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
  SignatureWrap,
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
  services,
  amountCollected,
  jobPaymentType,
  getBinInOutInfoIndex,
  getCustomerSiteIndex,
  componentId,
}) => {
  const viewShotRef = useRef(null);
  const signShotRef = useRef(null);
  const logoShotRef = useRef(null);
  const PRINT_DATA = [];

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

  const onSignShot = async () => {
    try {
      return await signShotRef.current.capture();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onLogoShot = async () => {
    try {
      return await logoShotRef.current.capture();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onPrint = async () => {
    try {
      let logobase64Str;
      let signbase64Str;

      const logo = getReceiptSettingVariable('StringCompanyLogo');
      if (logo) {
        logobase64Str = await onLogoShot();
        PRINT_DATA.splice(0, 0, {
          type: "image",
          value: logobase64Str
        });
      }

      if (getReceiptSettingVariable('ShowSignature') === 'True') {
        const sign = signs[signs.length - 1];

        if (!sign || !sign.uri) {

        } else {
          signbase64Str = await onSignShot();
          PRINT_DATA.splice(PRINT_DATA.length - 5, 0, {
            type: "image",
            value: signbase64Str
          });
        }
      }

      showLightBox(BLUETOOTH_PRINTER_SCREEN, { base64Str: PRINT_DATA });
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

    PRINT_DATA.push({
      type: 'text',
      value: 'disclaimerText'
    });

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

    if (!sign || !sign.uri) {
      return null;
    }

    PRINT_DATA.push({
      type: 'space'
    });

    PRINT_DATA.push({
      type: 'dotline'
    });

    getReceiptSettingVariable('ShowSiteContact') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          'Site Contact',
          sign.signedUserName
        ]
      });

    getReceiptSettingVariable('ShowSiteTelephone') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          'Contact Number',
          sign.signedUserContact || ' --- '
        ]
      });

    PRINT_DATA.push({
      type: 'space'
    });

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <ViewShot
          ref={signShotRef}
          options={{ result: 'base64' }}
        >
          <ContentWrap>
            {
              getReceiptSettingVariable('ShowSignature') === 'True' &&
              <View style={{ alignItems: 'center' }}>
                <SignatureWrap>
                  <FullImage source={{ uri: sign.uri }} />
                </SignatureWrap>
              </View>
            }
          </ContentWrap>
        </ViewShot>
        {
          getReceiptSettingVariable('ShowSiteContact') === 'True' &&
          <View>
            <BorderView />
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap flex={4}>
                <InfoText>
                  Site Contact
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
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
                  Contact Number
                </InfoText>
              </FlexWrap>
              <FlexWrap flex={6}>
                <InfoText align={'right'}>
                  {sign.signedUserContact || ' --- '}
                </InfoText>
              </FlexWrap>
            </RowWrap>
          </View>
        }
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderServices = () => {
    const selectedServices = services.filter(item => item.isSelected);

    if (
      selectedServices.length === 0 ||
      getReceiptSettingVariable('ShowAdditionalService') !== 'True'
    ) {
      return null;
    }

    PRINT_DATA.push({
      type: 'text',
      value: 'Additional Services'
    });

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <InfoText>
          Additional Services
        </InfoText>
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap flex={4}>
            <InfoText>
              ITEM
            </InfoText>
          </FlexWrap>
          <FlexWrap flex={6}>
            <InfoText align={'right'}>
              QTY
            </InfoText>
          </FlexWrap>
        </RowWrap>
        {
          selectedServices.map((item) => {

            PRINT_DATA.push({
              type: 'column',
              value: [
                item.serviceAdditionalChargeName,
                item.quantity.toString()
              ]
            });
            return (
              <View
                key={`${item.serviceAdditionalChargeTemplateId}`}
              >
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <FlexWrap flex={4}>
                    <InfoText>
                      {item.serviceAdditionalChargeName}
                    </InfoText>
                  </FlexWrap>
                  <FlexWrap flex={6}>
                    <InfoText align={'right'}>
                      {item.quantity}
                    </InfoText>
                  </FlexWrap>
                </RowWrap>
              </View>
            )
          })
        }
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderPayment = () => {
    if (
      !amountCollected ||
      !focusedJob.isEnabledCashCollection
    ) {
      return null;
    }

    getReceiptSettingVariable('ShowPaymentType') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          getReceiptSettingVariable('LabelPayment_Type') || 'Payment',
          focusedJob.jobPaymentTypeList[jobPaymentType]
        ]
      });

    getReceiptSettingVariable('ShowAmountCollected') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          getReceiptSettingVariable('LabelCollected_Cash') || 'Collected',
          `$${amountCollected}`
        ]
      });

    PRINT_DATA.push({
      type: 'space'
    });

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
        const idx = focusedJob.jobTypeName === JOB_TYPE.SHIFT
          ? 0 : getBinInOutInfoIndex(index);

        (item.wasteType || item.binType) &&
          (
            (idx === 0 && getReceiptSettingVariable('ShowBinCollected') === 'True') ||
            (idx === 1 && getReceiptSettingVariable('ShowBinDelivered') === 'True') ||
            (idx !== 0 && idx !== 1)
          ) &&
          PRINT_DATA.push({
            type: 'column',
            value: [
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
              ),
              item['binNumber']
            ]
          });

        (item.wasteType || item.binType) &&
          (
            (idx === 0 && getReceiptSettingVariable('ShowBinCollectedType') === 'True') ||
            (idx === 1 && getReceiptSettingVariable('ShowBinDeliveredType') === 'True') ||
            (idx !== 0 && idx !== 1)
          ) &&
          PRINT_DATA.push({
            type: 'column',
            value: [
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
              ),
              item['binType'] && item['binType']['binTypeName']
            ]
          });

        (item.wasteType || item.binType) &&
          (
            (idx === 0 && getReceiptSettingVariable('ShowWasteTypeCollected') === 'True') ||
            (idx === 1 && getReceiptSettingVariable('ShowPlannedWasteType') === 'True') ||
            (idx !== 0 && idx !== 1)
          ) &&
          PRINT_DATA.push({
            type: 'column_array',
            value: [
              (
                idx === 0
                  ? getReceiptSettingVariable('LabelWaste_Type_Collected') || 'With Waste Type'
                  : ''
              ) +
              (
                idx === 1
                  ? getReceiptSettingVariable('LabelPlanned_Waste_Type') || 'For Waste Type'
                  : ''
              ) +
              (
                idx !== 0 && idx !== 1 ? 'With Waste Type' : ''
              ),
              item['wasteTypes'].map((el, i) => el.wasteType.wasteTypeName || '')
            ]
          });

        (item.wasteType || item.binType) &&
          PRINT_DATA.push({
            type: 'space',
          })

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
                            ? getReceiptSettingVariable('LabelWaste_Type_Collected') || 'With Waste Type'
                            : ''
                        ) +
                        (
                          idx === 1
                            ? getReceiptSettingVariable('LabelPlanned_Waste_Type') || 'For Waste Type'
                            : ''
                        ) +
                        (
                          idx !== 0 && idx !== 1 ? 'With Waste Type' : ''
                        )
                      }
                    </InfoText>
                  </FlexWrap>
                  <FlexWrap flex={6}>
                    {
                      item['wasteTypes'].map((el, i) => (
                        <View key={el.wasteTypeId}>
                          {
                            i > 0 &&
                            <SpaceView mTop={SIZE1} />
                          }
                          <InfoText align={'right'}>
                            {el.wasteType.wasteTypeName || ''}
                          </InfoText>
                        </View>
                      ))
                    }
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

    PRINT_DATA.push({
      type: 'text',
      value: `DO #: ${focusedJob.jobNumber}`
    });

    PRINT_DATA.push({
      type: 'space'
    });

    getReceiptSettingVariable('ShowCustomerName') === 'True' &&
      PRINT_DATA.push({
        type: 'text',
        value: focusedJob.customer.customerName
      });

    PRINT_DATA.push({
      type: 'space'
    });

    getReceiptSettingVariable('LabelSite_Address')
      ? PRINT_DATA.push({
        type: 'text',
        value: getReceiptSettingVariable('LabelSite_Address')
      })
      : PRINT_DATA.push({
        type: 'text',
        value: 'Site Address'
      });

    focusedJob.steps[index].site
      ? PRINT_DATA.push({
        type: 'text',
        value: getCustomerSiteAddress(focusedJob.steps[index].site)
      })
      : PRINT_DATA.push({
        type: 'text',
        value: focusedJob.steps[index].address
      });

    PRINT_DATA.push({
      type: 'space'
    });

    PRINT_DATA.push({
      type: 'column',
      value: [
        moment(
          focusedJob.receiptCompletedDate ||
          focusedJob.completedDate || focusedJob.jobTimeSpecific
        ).format('DD/MM/YYYY'),
        moment(
          focusedJob.receiptCompletedDate ||
          focusedJob.completedDate || focusedJob.jobTimeSpecific
        ).format('hh:mm A')
      ]
    });

    focusedJob.assignedDriver &&
      focusedJob.assignedDriver.driverName &&
      getReceiptSettingVariable('ShowDriver') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          getReceiptSettingVariable('LabelDriver') || 'Driver',
          focusedJob.assignedDriver.driverName
        ]
      });

    focusedJob.assignedVehicle &&
      focusedJob.assignedVehicle.vehicleName &&
      getReceiptSettingVariable('ShowVehicle') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          getReceiptSettingVariable('LabelVehicle') || 'Vehicle',
          focusedJob.assignedVehicle.vehicleName
        ]
      });

    PRINT_DATA.push({
      type: 'space'
    });

    getReceiptSettingVariable('ShowJobType') === 'True' &&
      PRINT_DATA.push({
        type: 'column',
        value: [
          getReceiptSettingVariable('LabelJob_Type') || 'Job Type',
          focusedJob.jobTemplateName || focusedJob.jobTypeName
        ]
      });

    PRINT_DATA.push({
      type: 'space'
    });

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <TitleText>
          {`DO #: ${focusedJob.jobNumber}`}
        </TitleText>
        {
          getReceiptSettingVariable('ShowCustomerName') === 'True' &&
          <>
            <SpaceView mTop={SIZE2} />
            <InfoText>
              {focusedJob.customer.customerName}
            </InfoText>
          </>
        }
        <SpaceView mTop={SIZE4} />
        <InfoText>
          {
            getReceiptSettingVariable('LabelSite_Address') || 'Site Address'
          }
        </InfoText>
        <SpaceView mTop={SIZE2} />
        <InfoText>
          {
            focusedJob.steps[index].site
              ? getCustomerSiteAddress(focusedJob.steps[index].site)
              : focusedJob.steps[index].address
          }
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

    let headerText = getReceiptSettingVariable('StringHeaderText');

    if (!headerText) {
      return null;
    }

    const htmlContent =
      `<div style='text-align: center;'>${headerText}</div>`.replace(
        /\n/g,
        `</div>\n<div style='text-align: center;'>`,
      );

    headerText = headerText.replace(/<[^>]+>/g, '');
    headerText = headerText.replace('&nbsp;', '');

    PRINT_DATA.push({
      type: "header",
      value: headerText
    });

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
        <LogoImageWrap>
          <ViewShot
            ref={logoShotRef}
            options={{ result: 'base64' }}
          >
            <ContentWrap>
              <FullImage
                resizeMode={'contain'}
                source={{ uri: logo }}
              />
            </ContentWrap>
          </ViewShot>
        </LogoImageWrap>
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
        {renderHeader()}
      </ShadowWrap>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <SpaceView mTop={SIZE2} />
          <ViewShot
            ref={viewShotRef}
            options={{ result: 'base64' }}
          >
            <ContentWrap
              mLeft={SIZE2} mRight={SIZE2}
            >
              {renderLogo()}
              {renderHeaderText()}
              {renderJobInfo()}
              {renderBinInfo()}
              {renderPayment()}
              {renderServices()}
              {renderJobProof()}
              {renderDisclaimerText()}

              <SpaceView mTop={SIZE4 * 4} />
            </ContentWrap>
          </ViewShot>
          <SpaceView mTop={SIZE4} />
        </Content>
      </ScrollView>
    </Container>
  );
};

PreviewScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  jobReceiptSetting: PropTypes.array.isRequired,
  signs: PropTypes.array.isRequired,
  binInfo: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired,
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

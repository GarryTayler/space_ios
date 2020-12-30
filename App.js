/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Drawer, Router, Scene} from 'react-native-router-flux';
import {connect, Provider} from 'react-redux';
import {AsyncStorage} from 'react-native';
import {Root} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import store from './app/store/configuteStore';
//components
import EStyleSheet from 'react-native-extended-stylesheet';
import Login from './app/components/User/Login';
import DrawerLayout from './app/components/Shared/DrawerLayout';
import Home from './app/components/Root/Home';
import SplashScreen from './app/components/Root/SplashScreen';
import Signup from './app/components/User/Signup';
import Signup_sms from './app/components/User/Signup_sms';
import Findpassword from './app/components/User/Findpassword';
import Changepassword from './app/components/User/Changepassword';
import Service from './app/components/User/Service';
import ServicePrice from './app/components/User/ServicePrice';
import Createinquiry from './app/components/Util/Createinquiry';
import AddressRequest from './app/components/Main/AddressRequest';
import Inquiry from './app/components/Util/Inquiry';
import Notice from './app/components/Util/Notice';
import Faq from './app/components/Util/Faq';
import Update_profile from './app/components/Mypage/Update_profile';
import Modifypassword from './app/components/Mypage/Modifypassword';
import Mypage from './app/components/Mypage/Mypage';
import Card from './app/components/Mypage/Card';
import Coupon from './app/components/Mypage/Coupon';
import Paymentlog from './app/components/Mypage/Paymentlog';
import Paymentdetail from './app/components/Mypage/Paymentdetail';
import Returngood from './app/components/Main/Returngood';
import Payment from './app/components/Main/Payment';
import Restore from './app/components/Main/Restore';
import SaveBox from './app/components/Main/SaveBox';
import SaveInfo from './app/components/Main/SaveInfo';
import CompleteSave from './app/components/Main/CompleteSave';
import SaveBoxStatistic from './app/components/Main/SaveBoxStatistic';
import RequestService from './app/components/Main/RequestService';
import Policy from './app/components/User/Policy';
import Servicerule from './app/components/User/Servicerule';
import RefundAccount from './app/components/Mypage/RefundAccount';

EStyleSheet.build({
    $fontNotoSansRegular: 'NotoSansCJKkr-Regular',
    $fontNotoSansMedium: 'NotoSansCJKkr-Medium',
    $fontNotoSansBold: 'NotoSansCJKkr-Bold',

    $primaryColor: '#27cccd',
    $sWhiteColor: '#fff',
    $sBlackColor: '#000',
    $sRedColor: '#fe0000',
    $sGreyColor: '#a2a2a2',
    $sInputBoundaryColor: '#e6e6e6',
    $sLabelColor1: '#666666',
    $sLabelColor2: '#1f1f1f',
    $sLabelColor3: '#636363',
    $sLabelColor4: '#808080',
    $sLabelColor5: '#177a7a',
    $sLabelColor6: '#1e9495',
    $sCouponLabel: '#bfbfbf',
    $sActiveLabelColor: '#02a3a3',
    $sDeactiveLabelColor: '#b1b1b1',
    $sBackgroundColor1: '#ececec',
    $sBackgroundColor2: '#ededed',
    $sInputboxBackgroundColor: '#47d4d4',
    $sBlurBackground: '#4c4c4c',

    $IS: 'Arial',
    $ISB: 'Arial Bold',
});


class App extends React.Component {
    constructor() {
        super();
    }

    componentWillUnmount() {
    }
    onBackPress() {
    }
    render() {
        const RouterWithRedux = connect()(Router);
        return (
            <Provider store={store}>
                <MenuProvider style={{flex: 1}}>
                    <RouterWithRedux backAndroidHandler={this.onBackPress}>
                        <Scene hideNavBar key="hidenav">
                            <Scene key="root" hideNavBar>
                                <Drawer
                                    key="drawer"
                                    contentComponent={DrawerLayout}
                                    drawerWidth={200}
                                    drawerPosition={'right'}>
                                    <Scene hideNavBar key="hidenavbar">
                                        <Scene key="home" component={Home} initial />

                                        <Scene key="addressrequest" component={AddressRequest}/>
                                        <Scene key="request_service" component={RequestService}/>

                                        <Scene key="save_box" component={SaveBox}/>
                                        <Scene key="returngood" component={Returngood}/>

                                        <Scene key="save_box_statistic" component={SaveBoxStatistic}/>
                                        <Scene key="save_info" component={SaveInfo}/>
                                        <Scene key="restore" component={Restore}/>
                                        <Scene key="complete_save" component={CompleteSave}/>

                                        <Scene key="payment" component={Payment}/>

                                        <Scene key="mypage" component={Mypage}/>
                                        <Scene key="update_profile" component={Update_profile}/>
                                        <Scene key="modifypassword" component={Modifypassword}/>
                                        <Scene key="card" component={Card}/>
                                        <Scene key="refund_account" component={RefundAccount}/>
                                        <Scene key="paymentlog" component={Paymentlog}/>
                                        <Scene key="paymentdetail" component={Paymentdetail}/>
                                        <Scene key="coupon" component={Coupon}/>
                                        <Scene key="service" component={Service} />
                                        <Scene key="service_price" component={ServicePrice}/>
                                        <Scene key="inquiry" component={Inquiry}/>
                                        <Scene key="createinquiry" component={Createinquiry}/>
                                        <Scene key="notice" component={Notice}/>
                                        <Scene key="faq" component={Faq}/>
                                    </Scene>
                                </Drawer>
                            </Scene>
                            <Scene key="splash" component={SplashScreen} initial />
                            <Scene key="login" component={Login} />
                            <Scene key="policy" component={Policy}  />
                            <Scene key="service_rule" component={Servicerule} />
                            <Scene key="signup" component={Signup}/>
                            <Scene key="signup_sms" component={Signup_sms}/>
                            <Scene key="findpassword" component={Findpassword}/>
                            <Scene key="changepassword" component={Changepassword}/>
                        </Scene>
                    </RouterWithRedux>
                </MenuProvider>
            </Provider>
        );
    }
}
export default () => <Root><App/></Root>

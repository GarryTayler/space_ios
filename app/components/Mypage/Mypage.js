import React from 'react';
import { View, TouchableHighlight , TouchableOpacity , Image, BackHandler } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Content, Form, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements , Image_Icon, fonts, dialog } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import Images from "../../assets/Images";
import ToggleSwitch from 'toggle-switch-react-native';
import { connect } from "react-redux";
import { setUser, logOut } from '../../actions';
import store from "./../../store/configuteStore";
import { remove_account, log_out } from './../Root/api';
import Dialog, {DialogButton, DialogContent, DialogFooter, ScaleAnimation} from 'react-native-popup-dialog';
import {performNetwork, showToast} from './../Shared/global';

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { NaverLogin, getProfile } from '@react-native-seoul/naver-login';
import KakaoLogins from '@react-native-seoul/kakao-login';
import { LoginManager , AccessToken , GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

let pageTitle = '마이페이지';

var itemDetailModalVisible = false;

class Mypage extends React.Component {
    constructor(props) {
        super(props);

        this.state= {
            params: props.params,

            itemDetailModalVisible: false,
            pushNotificationCheck: store.getState().user.push_flag == null ? false : store.getState().user.push_flag
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        if (itemDetailModalVisible) {
            itemDetailModalVisible = false;
            return true;
        }

        return false;
    }

    pushNotificationPressed() {
        let pushNotificationCheck = !this.state.pushNotificationCheck;
        this.setState({ pushNotificationCheck: pushNotificationCheck });

        let user = store.getState().user;

        this.props.setUser({
            userid: user.userid,
            email: user.email,
            mobile: user.mobile,
            addr1: user.addr1,
            addr2: user.addr2,
            detail_addr: user.detail_addr,
            username: user.username,
            userno: user.userno,
            apiToken: user.apiToken,
            push_flag: pushNotificationCheck,
            user_type: user.user_type
        });
    }
    googleSignOut = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
        //   console.error(error);
        }
    };

    kakaoLogout = async () => {
        KakaoLogins.logout().then(result => {
        }).catch(err => {
            console.log(`Logout Failed:${err.code} ${err.message}`);
      });

        // try {
        //   const result = await RNKakao.logout();
        // } catch (e) {
        //   console.log(e);
        // }
    }

    logout() {
        performNetwork(this, this.state.params.homeComp, log_out(
            store.getState().user.apiToken
        )).then((response) => {
            if (response == null) { return; }
            
            if(store.getState().user.user_type == 1) {
                this.googleSignOut();
            }
            else if(store.getState().user.user_type == 2) {
                LoginManager.logOut();
            }
            else if(store.getState().user.user_type == 3) {
                NaverLogin.logout();
            }
            else if(store.getState().user.user_type == 4) {
                this.kakaoLogout();
            }

            this.props.logOut({});
            Actions.reset('home');
        });
    }

    removeAccount() {
        this.setState({ itemDetailModalVisible: false });
        itemDetailModalVisible = false;

        performNetwork(this, this.state.params.homeComp, remove_account(
            store.getState().user.apiToken
        )).then((response) => {
            if (response == null) { return; }
            
            showToast("탈퇴 성공하였습니다." , "success");
            
            this.props.logOut({});
            Actions.reset('home');
        });
    }
    
    renderRemoveAccountDialog() {
        return (
            <Dialog
                visible={ this.state.itemDetailModalVisible }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.8 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ itemDetailModalVisible: false }); }}
                footer={
                    <DialogFooter bordered={ false } style={ dialog.footer }>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="탈퇴하기"
                                textStyle={ dialog.footerButton }
                                onPress={() => { this.removeAccount() }} />
                        ]}
                    </DialogFooter>
                } >
                <DialogContent>
                    <Form style={ dialog.contentTitleContainer }>
                        <Text style={ dialog.contentTitle }>탈퇴하기</Text>
                    </Form>

                    <Form style={dialog.formWarning}>
                        <Image
                            style={elements.size60}
                            source={Images.ic_dialog_warning}/>
                    </Form>

                    <View style={base.top10}></View>

                    <Form>
                        <Text style={dialog.formWarningText}>
                            회원탈퇴 전 모든 물품을 반드시 찾아주세요.
                            탈퇴하시겠습니까?
                        </Text>
                    </Form>

                    <Button transparent
                        style={ dialog.closeButton }
                        onPress={ () => {
                            this.setState({ itemDetailModalVisible: false });
                            itemDetailModalVisible = false;
                        }}>
                        <Image style={ elements.size16 } source={ Images.ic_dialog_close } />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }
    render()    {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content style={ base.whiteBg }>
                    <Form style={{ paddingBottom: 25 }}>
                        <View style={ base.top20 } />
                        <View style={{ paddingVertical: 10, paddingHorizontal: 16, borderBottomColor: '#ececec', borderBottomWidth: 1 }}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightBlack] }>내 정보</Text>
                        </View>

                        <TouchableHighlight onPress={()=>Actions.push('update_profile', { params: this.state.params })} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , { alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.update_profile} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>개인정보 수정</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>Actions.push('modifypassword', { params: this.state.params })} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.change_password} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>비밀번호 변경</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                        <View style={ base.top20 } />
                        <View style={{ paddingVertical: 10, paddingHorizontal: 16, borderBottomColor: '#ececec', borderBottomWidth: 1 }}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightBlack] }>결제</Text>
                        </View>

                        <TouchableHighlight onPress={()=>Actions.push('card', { params: this.state.params })} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.payment_card} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>결제 카드 관리</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>Actions.push('paymentlog', { params: this.state.params })} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.payment_log} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>결제 내역</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>Actions.push('coupon', { params: this.state.params })} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.coupon} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>쿠폰</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>

                        <View style={ base.top20 } />
                        <View style={{ paddingVertical: 10, paddingHorizontal: 16, borderBottomColor: '#ececec', borderBottomWidth: 1 }}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightBlack] }>알람</Text>
                        </View>
                        
                        <TouchableHighlight onPress={()=> this.pushNotificationPressed() } activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign, { paddingRight: 16 }]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.push_notification} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>푸시</Text>
                                    </View>
                                </View>
                                <ToggleSwitch
                                    isOn={this.state.pushNotificationCheck}
                                    onColor="#27cccd"
                                    offColor="#a2a2a2"
                                    label=""
                                    labelStyle={{ color: "black", fontWeight: "900" }}
                                    size="medium"
                                    onToggle={isOn => this.pushNotificationPressed() }
                                />
                            </View>
                        </TouchableHighlight>

                        <View style={ base.top20 } />
                        <View style={{ paddingVertical: 10, paddingHorizontal: 16, borderBottomColor: '#ececec', borderBottomWidth: 1 }}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightBlack] }>기타</Text>
                        </View>
                        <TouchableHighlight onPress={()=>this.logout()} activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View style={{width: 30}}>
                                        <Image source={Images.logout} style={Image_Icon.mypageIcons} />    
                                    </View>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>로그아웃</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=> { this.setState({ itemDetailModalVisible: true }); itemDetailModalVisible = true; } } activeOpacity={0.9} underlayColor='#eee'>
                            <View style={[elements.mypage_row , elements.flex_rowAlign]}>
                                <View style={[elements.flex_rowAlign , {alignItems: 'center'}]}>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>탈퇴하기</Text>
                                    </View>
                                </View>
                                <Icon name='chevron-right' type='evilicon' size={36} color='#a2a2a2' />
                            </View>
                        </TouchableHighlight>
                    </Form>

                    <Form style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                (주)여유공간 
                            </Text>
                            { " " }| 대표 정하섭
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            경기도 안양시 동안구 시민대로 361
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                1물류창고
                            </Text>
                            { " " }| 경기도 안양시 동안구 시민대로 361, 516호
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                2물류창고
                            </Text>
                            { " " }| 경기도 의왕시 초평동 336-1
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                사업자 등록번호
                            </Text>
                            { " " }| 750-81-01724
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                통신판매업 신고번호
                            </Text>
                            { " " }| 제2019-경기동안-00361
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                이메일
                            </Text>
                            { " " }| spare-space@naver.com
                        </Text>
                        <Text style={ [fonts.familyRegular, fonts.size11, fonts.colorLightBlack] }>
                            <Text style={ [fonts.familyBold, fonts.size11, fonts.colorLightBlack] }>
                                전화번호
                            </Text>
                            { " " }| 031-342-8811
                        </Text>
                    </Form>
                </Content>    
                { this.renderRemoveAccountDialog() }
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser : user => { dispatch(setUser(user)) },
        logOut : state => { dispatch(logOut(state)) }
    }
}

export default connect(null,mapDispatchToProps)(Mypage)
import React from 'react';
import {TouchableHighlight, View, Keyboard} from 'react-native';
import {Body, Button, CheckBox, Container, Content, Form, Input, Item, Right, Text} from 'native-base';
import {base, fonts, form} from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {user_sendcode, user_signup, user_verifycode} from './../Root/api.js';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {_e} from '../../lang';
import {performNetwork, showToast , global_variable} from '../Shared/global';

let pageTitle = '회원가입';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password_confirm: '',
            userid: '',
            mobile: '',
            verifyCode: '',
            emailError: null,
            passwordError: null,
            password_confirmError: null,
            useridError: null,
            mobileError: null,
            verifyCodeError: null,
            isMobileVerified: false,

            agree1: false,
            agree2: false,
            loaded: true,
        };
    }

    onSetAgree(type) {
        if (type == '1') {
            this.setState({agree1: !this.state.agree1});
        }
        if (type == '2') {
            this.setState({agree2: !this.state.agree2});
        }
    }

    onBtnSendVerifyPressed() {
        if (this.state.mobile == '') {
            this.setState({mobileError: _e.mobileCheck});
            return;
        }

        this.setState({mobileError: null, verifyCodeError: null});
        
        performNetwork(this, null, user_sendcode(this.state.mobile)).then(resp => {
            if (resp == null) { return; }
            
            showToast(_e.verifyCodeSent, 'success');
        });
    }

    onBtnVerifyConfirmPressed() {
        if (this.state.verifyCode == '') {
            this.setState({verifyCodeError: _e.verifyCodeCheck});
            return;
        }

        this.setState({mobileError: null, verifyCodeError: null});
        performNetwork(this, null, user_verifycode(this.state.mobile, this.state.verifyCode)).then((response) => {
            if (response == null) { return; }

            this.setState({ isMobileVerified: true });
            showToast(_e.verifyCodeSuccess , "success");
        });
    }

    onBtnSignupPressed() {
        Keyboard.dismiss();
        if (this.state.email == '') {
            this.setState({emailError: _e.emailCheck});
            return;
        }
        if (this.state.password == '') {
            this.setState({passwordError: _e.passwordCheck});
            return;
        }
        if (this.state.password.length < 6) {
            this.setState({passwordError: _e.passwordRule});
            return;
        }
        if (this.state.password_confirm != this.state.password) {
            this.setState({password_confirmError: _e.confirmPasswordNotSame});
            return;
        }
        if (this.state.userid.length < 2) {
            this.setState({useridError: _e.userIdRule});
            return;
        }
        if (this.state.mobile == '') {
            this.setState({mobileError: _e.mobileCheck});
            return;
        }
        if (!this.state.isMobileVerified) {
            this.setState({mobileError: _e.shouldMobileVerify});
            return;
        }
        if (this.state.verifyCode == '') {
            this.setState({verifyCodeError: _e.verifyCodeCheck});
            return;
        }

        if (!this.state.agree1 || !this.state.agree2) {
            showToast(_e.shouldAgreePrivacyPolicy);
            return;
        }

        this.setState({
            emailError: null,
            passwordError: null,
            password_confirmError: null,
            useridError: null,
            mobileError: null,
            verifyCodeError: null,
        });

        performNetwork(this, null, user_signup(
            this.state.email,
            this.state.userid,
            this.state.password,
            this.state.mobile,
            global_variable.device_id
        )).then(response => {
            if (response == null) { return; }
            //showToast(_e.signup_success, 'success');
            Actions.pop();
        });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle}/>
                <Content style={base.whiteBg}>
                    <Form style={form.styleForm}>
                        <View>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>이메일</Text>
                        </View>
                        <Item rounded
                              style={[this.state.emailError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                placeholder="이메일을 입력해주세요."
                                value={this.state.email}
                                style={form.input_common}
                                onChangeText={(text) => {
                                    this.setState({email: text.replace(' ', ''), emailError: null});
                                }}
                                placeholderTextColor='#a2a2a2'
                            />
                            {this.state.emailError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.emailError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>비밀번호</Text>
                        </View>
                        <Item rounded
                              style={[this.state.passwordError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                secureTextEntry={true}
                                placeholder="비밀번호를 입력해주세요."
                                value={this.state.password}
                                style={form.input_common}
                                placeholderTextColor='#a2a2a2'
                                onChangeText={(text) => this.setState({password: text, passwordError: null})}
                            />
                            {this.state.passwordError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.passwordError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>비밀번호 확인</Text>
                        </View>
                        <Item rounded
                              style={[this.state.password_confirmError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                secureTextEntry={true}
                                placeholder="비밀번호 확인"
                                value={this.state.password_confirm}
                                style={form.input_common}
                                placeholderTextColor='#a2a2a2'
                                onChangeText={(text) => this.setState({
                                    password_confirm: text,
                                    password_confirmError: null,
                                })}
                            />
                            {this.state.password_confirmError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.password_confirmError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>아이디</Text>
                        </View>
                        <Item rounded
                              style={[this.state.useridError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                placeholder="아이디를 입력해주세요."
                                value={this.state.userid}
                                style={form.input_common}
                                placeholderTextColor='#a2a2a2'
                                onChangeText={(text) => this.setState({
                                    userid: text.replace(' ', ''),
                                    useridError: null,
                                })}
                            />
                            {this.state.useridError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.useridError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>휴대폰</Text>
                        </View>
                        <Item rounded
                              style={[this.state.mobileError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                placeholder={_e.mobilePlaceholder}
                                value={this.state.mobile}
                                style={form.input_common}
                                placeholderTextColor='#a2a2a2'
                                onChangeText={(text) => this.setState({
                                    mobile: text.replace(' ', ''),
                                    mobileError: null,
                                })}
                            />
                            <Button style={[form.vbutton, {width: 140, height: 32}]}
                                    onPress={() => this.onBtnSendVerifyPressed()}>
                                <Text style={[fonts.familyMedium, fonts.size14, fonts.colorWhite]}>인증번호발송</Text>
                            </Button>
                            {this.state.mobileError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.mobileError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>인증번호</Text>
                        </View>
                        <Item rounded
                              style={[this.state.verifyCodeError != null ? form.item_common_failed : form.item_common, {position: 'relative'}]}>
                            <Input
                                placeholder={_e.verifyCodePlaceholder}
                                value={this.state.verifyCode}
                                style={form.input_common}
                                placeholderTextColor='#a2a2a2'
                                onChangeText={(text) => this.setState({
                                    verifyCode: text.replace(' ', ''),
                                    verifyCodeError: null,
                                })}
                            />
                            <Button style={[form.vbutton, {width: 140, height: 32}]}
                                    onPress={() => this.onBtnVerifyConfirmPressed()}>
                                <Text style={[fonts.familyMedium, fonts.size14, fonts.colorWhite]}>인증</Text>
                            </Button>
                            {this.state.verifyCodeError != null ?
                                <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 55}}>
                                    <Text
                                        style={[fonts.familyRegular, fonts.size12, fonts.colorRed]}>* {this.state.verifyCodeError}</Text>
                                </View>
                                :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>이용약관</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#f6f6f6',
                            paddingTop: 15,
                            paddingBottom: 15,
                            marginTop: 5,
                        }}>

                            <TouchableHighlight onPress={() => this.onSetAgree('1')} activeOpacity={1}
                                                underlayColor='#0000'>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <CheckBox checked={this.state.agree1} color="#27cccd" style={{borderRadius: 3}}
                                              onPress={() => this.onSetAgree('1')}/>
                                    <Body style={{flex: 3, marginLeft: 20, alignItems: 'flex-start'}}>
                                        <Text
                                            style={[fonts.familyRegular, fonts.size13, this.state.agree1 ? fonts.colorLightBlack : {color: '#b1b1b1'}]}>서비스
                                            이용약관에 동의합니다.</Text>
                                    </Body>
                                    <Right style={{flex: 1}}>
                                        <Button style={{
                                            width: 80,
                                            height: 28,
                                            borderRadius: 2,
                                            backgroundColor: '#27cccd',
                                            justifyContent: 'center',
                                        }} onPress={()=>Actions.push('service_rule')}>
                                            <Text style={[fonts.familyMedium, fonts.size12, fonts.colorWhite]}>보기</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </TouchableHighlight>

                            <View style={base.top10}/>

                            <TouchableHighlight onPress={() => this.onSetAgree('2')} activeOpacity={1}
                                                underlayColor='#0000'>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <CheckBox checked={this.state.agree2} color="#27cccd" style={{borderRadius: 3}}
                                              onPress={() => this.onSetAgree('2')}/>
                                    <Body style={{flex: 3, marginLeft: 20, alignItems: 'flex-start'}}>
                                        <Text
                                            style={[fonts.familyRegular, fonts.size13, this.state.agree2 ? fonts.colorLightBlack : {color: '#b1b1b1'}]}>개인정보
                                            취급방침에 동의합니다.</Text>
                                    </Body>
                                    <Right style={{flex: 1}}>
                                        <Button style={{
                                            width: 80,
                                            height: 28,
                                            borderRadius: 2,
                                            backgroundColor: '#27cccd',
                                            justifyContent: 'center',
                                        }} onPress={()=>Actions.push('policy')}>
                                            <Text style={[fonts.familyMedium, fonts.size12, fonts.colorWhite]}>보기</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </TouchableHighlight>

                        </View>
                    </Form>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={''}
                                 overlayColor={'rgba(0, 0, 0, 0.5)'}/>
                </Content>

                <View style={form.styleForm}>
                    <Button full style={form.submitButton1} onPress={() => this.onBtnSignupPressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>가입하기</Text>
                    </Button>
                </View>

            </Container>
        );
    }
}

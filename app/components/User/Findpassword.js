import React from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Container, Content, Item, Input , Text , Button, Form} from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import { user_verifycode , user_sendcode, find_password } from './../Root/api.js';

let pageTitle = '비밀번호 찾기'

export default class Findpassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            email: '', mobile: '', verifyCode: '',
            emailError: null, mobileError: null, verifyCodeError: null,
            isMobileVerified: false
        };
    }

    onBtnSendVerifyPressed() {
        if (this.state.mobile == '')             { this.setState({ mobileError: _e.mobileCheck });           return; }

        this.setState({ mobileError: null, verifyCodeError: null });
        performNetwork(this, null, user_sendcode(this.state.mobile)).then((response) => {
            if (response == null) { return; }
            
            showToast(_e.verifyCodeSent , "success");
        });
    }
    onBtnVerifyConfirmPressed() {
        if (this.state.verifyCode == '')        { this.setState({ verifyCodeError: _e.verifyCodeCheck });   return; }

        this.setState({ mobileError: null, verifyCodeError: null });
        performNetwork(this, null, user_verifycode(this.state.mobile, this.state.verifyCode)).then((response) => {
            if (response == null) { return; }
            
            this.setState({ isMobileVerified: true });
            showToast(_e.verifyCodeSuccess , "success");
        });
    }

    onBtnPwdCheckedPressed() {
        Keyboard.dismiss();
        if (this.state.email == '')             { this.setState({ emailError: _e.emailCheck });             return; }
        if (this.state.mobile == '')            { this.setState({ mobileError: _e.mobileCheck });           return; }
        if (!this.state.isMobileVerified)       { this.setState({ mobileError: _e.shouldMobileVerify });    return; }
        if (this.state.verifyCode == '')        { this.setState({ verifyCodeError: _e.verifyCodeCheck });   return; }

        this.setState({
            emailError: null,
            mobileError: null,
            verifyCodeError: null
        });

        performNetwork(this, null, find_password(this.state.email, this.state.mobile)).then((response) => {
            if (response == null) { return; }

            Actions.push("changepassword", { apiToken: response.data.api_token });
        });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content style={base.whiteBg}>
                    <Form style={form.styleForm}>
                        <View>
                            <View>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>이메일</Text>
                            </View>
                            <Item rounded style={[this.state.emailError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    placeholder = "이메일을 입력해주세요."
                                    value = { this.state.email }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({email: text.replace(' ' , ''), emailError: null })}
                                />
                                { this.state.emailError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.emailError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>휴대폰</Text>
                            </View>
                            <Item rounded style={[this.state.mobileError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    placeholder = { _e.mobilePlaceholder }
                                    value = { this.state.mobile }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({mobile: text.replace(' ' , ''), mobileError: null })}
                                />
                                <Button style={[form.vbutton, { width: 140, height: 32 }]} onPress={()=>this.onBtnSendVerifyPressed()}>
                                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>인증번호발송</Text>
                                </Button>
                                { this.state.mobileError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.mobileError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>인증번호</Text>
                            </View>
                            <Item rounded style={[this.state.verifyCodeError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    placeholder = { _e.verifyCodePlaceholder }
                                    value = { this.state.verifyCode }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({verifyCode: text.replace(' ' , ''), verifyCodeError: null })}
                                />
                                <Button style={[form.vbutton, { width: 140, height: 32 }]} onPress={()=>this.onBtnVerifyConfirmPressed()}>
                                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>인증</Text>
                                </Button>
                                { this.state.verifyCodeError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.verifyCodeError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                        </View>
                    </Form>

                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnPwdCheckedPressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>비밀번호 확인</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

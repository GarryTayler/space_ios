import React from 'react';
import { Dimensions, View, TouchableOpacity, BackHandler, Keyboard } from 'react-native';
import { Container, Item, Input , Text , Button , CheckBox , Content, Form } from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import { user_verifycode , user_sendcode, update_userinfo } from './../Root/api.js';
import store from "./../../store/configuteStore";
import { setUser } from '../../actions';
import { connect } from "react-redux";
import Postcode from 'react-native-daum-postcode';

let pageTitle = '개인정보수정';
var self = null;

class Update_profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params: props.params,

            viewWidth: 0, viewHeight: 0,

            loaded: true,
            isAddressSearch: false,

            userid: '' ,email: '', detailAddr: '', addr1: '', addr2: '', mobile: '', verifyCode: '',
            useridError: null ,emailError: null, mobileError: null, verifyCodeError: null,

            addressError: null, detailAddrError: null, addr1Error: null, addr2Error: null,
            isMobileVerified: false
        };
    }

    componentDidMount() {
        self = this;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.setState({
            viewWidth: Math.round(Dimensions.get('window').width),
            viewHeight: Math.round(Dimensions.get('window').height)
        });

        this.setState({
            userid: store.getState().user.userid,
            email: store.getState().user.email,
            detailAddr: store.getState().user.detail_addr,
            addr1: store.getState().user.addr1,
            addr2: store.getState().user.addr2,
            mobile: store.getState().user.mobile
        });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (self.state.isAddressSearch) {
            self.setState({ isAddressSearch: false });
            return true;
        }

        return false;
    }

    searchAddressButtonPressed() {
        this.setState({
            loaded: false,
            isAddressSearch: true
        });

        var self = this;
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 3000);
    }
    searchAddressValueUpdated(data) {
        let address = data.address;
        let jibunAddress = data.jibunAddress;
        let userSelectedType = data.userSelectedType;
        let buildingName = data.buildingName;
        let zonecode = data.zonecode;

        let addr1 = '';
        if(userSelectedType == 'J') {
            addr1 = jibunAddress + (buildingName == '' ? '' : ", ") + buildingName;
        }
        else {
            addr1 = address + (buildingName == '' ? '' : ", ") + buildingName;
        }

        this.setState({
            detailAddr: zonecode,
            //addr1: query + (roadname == '' ? '' : ' ') + roadname,
            //addr2: jibunAddress + (roadname == '' ? '' : ", ") + roadname + (buildingName == '' ? '' : ", ") + buildingName,
            addr1: addr1,
            addr2: '' ,
            isAddressSearch: false
        });
    }

    onBtnSendVerifyPressed() {
        if (this.state.mobile == '')             { this.setState({ mobileError: _e.mobileCheck });           return; }

        this.setState({ mobileError: null, verifyCodeError: null });

        performNetwork(this, this.state.params.homeComp, user_sendcode(this.state.mobile)).then((response) => {
            if (response == null) { return; }
            showToast(_e.verifyCodeSent , "success");
        });
    }
    onBtnVerifyConfirmPressed() {
        if (this.state.verifyCode == '')        { this.setState({ verifyCodeError: _e.verifyCodeCheck });   return; }

        this.setState({ mobileError: null, verifyCodeError: null });
        performNetwork(this, this.state.params.homeComp, user_verifycode(this.state.mobile, this.state.verifyCode)).then((response) => {
            if (response == null) { return; }
            this.setState({ isMobileVerified: true });
            showToast(_e.verifyCodeSuccess , "success");
        });
    }

    onBtnUpdatePressed() {
        Keyboard.dismiss();
        if (this.state.userid.length < 2)       { this.setState({ useridError: _e.userIdRule });                                    return; }
        if (this.state.email == '')             { this.setState({ emailError: _e.emailCheck });                                     return; }
        if (this.state.detailAddr == '')        { this.setState({ addressError: _e.addressCheck, detailAddrError: 'error' });       return; }
        if (this.state.addr1 == '')             { this.setState({ addressError: _e.addressCheck, addr1Error: 'error' });            return; }
        //if (this.state.addr2 == '')             { this.setState({ addressError: _e.addressCheck, addr2Error: 'error' });            return; }

        if (this.state.mobile !== store.getState().user.mobile) {
            if (!this.state.isMobileVerified)   { this.setState({ mobileError: _e.shouldMobileVerify });                            return; }
            if (this.state.mobile == '')        { this.setState({ mobileError: _e.mobileCheck });                                   return; }
            if (this.state.verifyCode == '')    { this.setState({ verifyCodeError: _e.verifyCodeCheck });                           return; }
        }

        this.setState({
            useridError: null,
            emailError: null,
            addressError: null,
            detailAddrError: null,
            addr1Error: null,
            addr2Error: null,
            mobileError: null,
            verifyCodeError: null
        });

        performNetwork(this, this.state.params.homeComp, update_userinfo(
            store.getState().user.apiToken,
            this.state.userid,
            this.state.email,
            this.state.detailAddr,
            this.state.addr1,
            this.state.addr2,
            this.state.mobile
        )).then((response) => {
            if (response == null) { return; }
           let user = store.getState().user;
            this.props.setUser({
                userid: this.state.userid,
                email: this.state.email,
                mobile: this.state.mobile,
                addr1: this.state.addr1,
                addr2: this.state.addr2,
                detail_addr: this.state.detailAddr,
                username: user.username,
                userno: user.userno,
                apiToken: user.apiToken,
                push_flag: user.push_flag,
                user_type: user.user_type
            });
            showToast(_e.updateProfileSuccess , "success");
            Actions.pop();
        });
    }
    render() {
        var emailType = "";
        if (store.getState().user.user_type == 1) {
            emailType = "구글: ";
        } else if (store.getState().user.user_type == 2) {
            emailType = "페이스북: ";
        } else if (store.getState().user.user_type == 3) {
            emailType = "네이버: ";
        } else if (store.getState().user.user_type == 4) {
            emailType = "카카오톡: ";
        }
        return (
            <Container>
                <UserHeader title={pageTitle} comp={ this }/>

                <Content style={[base.whiteBg, { backgroundColor: this.state.loaded ? 'white' : '#efefef' }]}>
                    { this.state.isAddressSearch ?
                        <Form style={form.styleForm}>
                            <Postcode
                                style={{ width: this.state.viewWidth - 32, height: this.state.viewHeight - 200 }}
                                jsOptions={{ animated: true }}
                                onSelected={(data) => this.searchAddressValueUpdated(data) }
                            />
                        </Form>
                    :
                        <Form style={ form.styleForm }>
                            <View>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>아이디</Text>
                            </View>
                            <Item rounded style={[this.state.useridError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    placeholder = "아이디를 입력해주세요."
                                    value = { this.state.userid }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({userid: text.replace(' ' , ''), useridError: null})}
                                />
                                { this.state.useridError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.useridError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>
                                    { store.getState().user.user_type == 5 ? "이메일" : "가입 SNS" }
                                </Text>
                            </View>
                            <Item rounded style={[this.state.emailError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    disabled={ store.getState().user.user_type != 5 }
                                    placeholder = "이메일을 입력해주세요."
                                    value = { emailType + this.state.email }
                                    style = { form.input_common }
                                    onChangeText = {(text) => {
                                        store.getState().user.user_type == 5 ?
                                            this.setState({ email: text.replace(' ' , ''), emailError: null})
                                        :
                                            null;
                                        }}
                                    placeholderTextColor = '#a2a2a2'
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
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>주소</Text>
                            </View>
                            <View style={{display: 'flex' , flexDirection: 'row' , alignItems: 'center' , justifyContent: 'space-between' }}>
                                <Item rounded style={ [this.state.detailAddrError != null ? form.item_common_failed : form.item_common , {flex: 1}] }>
                                    <Input
                                        placeholder = "상세주소를 입력하세요."
                                        value = { this.state.detailAddr }
                                        style = { form.input_common }
                                        placeholderTextColor = '#a2a2a2'
                                        onChangeText = {(text) => this.setState({detailAddr: text, addressError: null, detailAddrError: null})}
                                    />
                                </Item>
                                <Button style={[form.vbutton , { marginLeft: 8, width: 40, height: 40}]} onPress={ () => { this.searchAddressButtonPressed() } }>
                                    <Icon color='#fff' name='md-search' type='ionicon' />
                                </Button>
                            </View>
                            <Item rounded style={ this.state.addr1Error != null ? form.item_common_failed : form.item_common }>
                                <Input
                                    placeholder = "서울특별시 서대문구 연희로"
                                    value = { this.state.addr1 }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({addr1: text, addressError: null, addr1Error: null})}
                                />
                            </Item>
                            <Item rounded style={ this.state.addr2Error != null ? form.item_common_failed : form.item_common }>
                                <Input
                                    placeholder = "지번,도로명,건물명을 입력하세요."
                                    value = { this.state.addr2 }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({addr2: text, addressError: null, addr2Error: null})}
                                />
                                { this.state.addressError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.addressError }</Text>
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
                        </Form>
                    }
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>

                { !this.state.isAddressSearch ?
                    <View style={ form.styleForm }>
                        <Button full style={form.submitButton1} onPress={()=>this.onBtnUpdatePressed()}>
                            <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>수정하기</Text>
                        </Button>
                    </View>
                : null }

            </Container>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return { setUser : user => { dispatch(setUser(user)) } }
}

export default connect(null, mapDispatchToProps)(Update_profile);

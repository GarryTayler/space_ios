import React from 'react';
import { View, TouchableOpacity , Keyboard } from 'react-native';
import { Container, Content , Item, Input , Text , Button, Form} from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import { change_password } from './../Root/api.js';

let pageTitle = '비밀번호 변경'

export default class Changepassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiToken: props.apiToken,

            loaded: true,
            password: '', password_confirm: '',
            passwordError: null, password_confirmError: null,
        };
    }

    onBtnChangePassword() {
        Keyboard.dismiss();
        if (this.state.password == '')          { this.setState({ passwordError: _e.passwordCheck });       return; }
        if (this.state.password.length < 6)     { this.setState({ passwordError: _e.passwordRule });        return; }
        if (this.state.password_confirm != this.state.password) { this.setState({ password_confirmError: _e.confirmPasswordNotSame }); return; }

        this.setState({
            passwordError: null,
            password_confirmError: null
        });

        performNetwork(this, null, change_password(this.state.apiToken, this.state.password)).then((response) => {
            if (response == null) { return; }
            
            showToast(_e.changepwd_success , "success");
            Actions.push("login");
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
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>비밀번호</Text>
                            </View>
                            <Item rounded style={[this.state.passwordError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    secureTextEntry={true}
                                    placeholder = "비밀번호를 입력해주세요."
                                    value = { this.state.password }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({password: text, passwordError: null})}
                                />
                                { this.state.passwordError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.passwordError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>비밀번호 확인</Text>
                            </View>
                            <Item rounded style={[this.state.password_confirmError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                                <Input
                                    secureTextEntry={true}
                                    placeholder = "비밀번호 확인"
                                    value = { this.state.password_confirm }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({password_confirm: text, password_confirmError: null })}
                                />
                                { this.state.password_confirmError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.password_confirmError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>
                        </View>

                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                    </Form>
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnChangePassword()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>비밀번호 확인</Text>
                    </Button>
                </View>

            </Container>
        )
    }
}

import React from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Container, Content , Item, Input , Text , Button, Form} from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import { modify_password } from './../Root/api.js';
import store from "./../../store/configuteStore";

let pageTitle = '비밀번호 변경';

export default class Modifypassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: props.params,

            loaded: true,
            old_password: '', password: '', password_confirm: '',
            old_passwordError: null, passwordError: null, password_confirmError: null
        };
    }

    onBtnChangePasswordPressed() {
        Keyboard.dismiss();
        if (this.state.old_password == '')                      { this.setState({ old_passwordError: _e.oldPasswordCheck });                return; }
        if (this.state.password == '')                          { this.setState({ passwordError: _e.passwordCheck });                       return; }
        if (this.state.password.length < 6)                     { this.setState({ passwordError: _e.passwordRule });                        return; }
        if (this.state.password_confirm != this.state.password) { this.setState({ password_confirmError: _e.confirmPasswordNotSame });      return; }

        this.setState({
            old_passwordError: null,
            passwordError: null,
            password_confirmError: null
        });

        performNetwork(this, this.state.params.homeComp, modify_password(
            store.getState().user.apiToken,
            this.state.old_password,
            this.state.password
        )).then((response) => {
            if (response == null) { return; }
            
            showToast(_e.updatePasswordSuccess , "success");
            Actions.pop();
        });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content style={ base.whiteBg }>
                    <Form style={ form.styleForm }>
                        <View>
                            <View>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>현재비밀번호</Text>
                            </View>
                            <Item rounded style={ [this.state.old_passwordError != null ? form.item_common_failed : form.item_common , {position: 'relative'}] }>
                                <Input
                                    secureTextEntry={true}
                                    placeholder = "현재비밀번호를 입력해주세요."
                                    value = { this.state.old_password }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({old_password: text, old_passwordError: null})}
                                />
                                { this.state.old_passwordError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.old_passwordError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>비밀번호</Text>
                            </View>
                            <Item rounded style={ [this.state.passwordError != null ? form.item_common_failed : form.item_common , {position: 'relative'}] }>
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
                            <Item rounded style={ [this.state.password_confirmError != null ? form.item_common_failed : form.item_common , {position: 'relative'}] }>
                                <Input
                                    secureTextEntry={true}
                                    placeholder = "비밀번호 확인"
                                    value = { this.state.password_confirm }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    onChangeText = {(text) => this.setState({password_confirm: text, password_confirmError: null})}
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
                    </Form>

                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnChangePasswordPressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>변경하기</Text>
                    </Button>
                </View>

            </Container>
        )
    }
}

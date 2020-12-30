import React from 'react';
import { View, Dimensions, TouchableOpacity, Image , Keyboard } from 'react-native';
import { Container, Content , Item, Input , Text , Button, Form} from 'native-base';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import Images from "../../assets/Images";
import { get_cardinfo, update_cardinfo } from './../Root/api.js';
import store from "./../../store/configuteStore";

let pageTitle = '결제 카드 관리';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: props.params,
            
            loaded: true,
            card_num1 : '' , card_num2 : '' , card_num3 : '' , card_num4 : '' ,
            card_mm : '' , card_yy : '' ,
            birth_no : '' ,
            card_pwd : '' ,

            cardNumError: null, card_num1Error : null, card_num2Error : null, card_num3Error : null, card_num4Error : null,
            expireDateError: null, card_mmError : null, card_yyError : null,
            birth_noError : null,
            card_pwdError : null
        };
    }

    componentDidMount() {
        this.fetchCardData();
    }
    fetchCardData() {
        performNetwork(this, this.state.params.homeComp, get_cardinfo(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            
            let arrCardNum = response.data.card_num.split("-");
            this.setState({
                card_num1 : arrCardNum[0] , card_num2 : arrCardNum[1] , card_num3 : arrCardNum[2] , card_num4 : arrCardNum[3] ,
                card_mm : response.data.card_mm , card_yy : response.data.card_yy ,
                birth_no : response.data.card_birth_no ,
                card_pwd : response.data.card_pwd
            })
        });
    }

    cardNumberChanged(index, text) {
        this.setState({ cardNumError: null });

        if (index == 0) {
            this.setState({card_num1: text, card_num1Error: null});
            if (text.length == 4) { this.cardNumInput2._root.focus(); }
        } else if (index == 1) {
            this.setState({card_num2: text, card_num2Error: null});
            if (text.length == 4) { this.cardNumInput3._root.focus(); }
        } else if (index == 2) {
            this.setState({card_num3: text, card_num3Error: null});
            if (text.length == 4) { this.cardNumInput4._root.focus(); }
        } else if (index == 3) {
            this.setState({card_num4: text, card_num4Error: null});
            if (text.length == 4) { this.cardExpireDateMMInput._root.focus(); }
        }
    }
    cardExpireDateChanged(key, text) {
        this.setState({ expireDateError: null });
        if (key == 'mm') {
            this.setState({card_mm: text, card_mmError: null})
            if (text.length == 2) { this.cardExpireDateYYInput._root.focus(); }
        } else if (key == 'yy') {
            this.setState({card_yy: text, card_yyError: null})
        }
    }

    onBtnRegistCardPressed() {
        Keyboard.dismiss();
        if (this.state.card_num1.length != 4) { this.setState({ cardNumError: _e.cardNumberCheck, card_num1Error: 'error' }); return; }
        if (this.state.card_num2.length != 4) { this.setState({ cardNumError: _e.cardNumberCheck, card_num2Error: 'error' }); return; }
        if (this.state.card_num3.length != 4) { this.setState({ cardNumError: _e.cardNumberCheck, card_num3Error: 'error' }); return; }
        if (this.state.card_num4.length < 3) { this.setState({ cardNumError: _e.cardNumberCheck, card_num4Error: 'error' }); return; }

        if (this.state.card_mm.length != 2 || parseInt(this.state.card_mm) == 0 || parseInt(this.state.card_mm) > 12) {
            this.setState({ expireDateError: _e.cardExpireDateCheck, card_mmError: 'error' });
            return;
        }
        if (this.state.card_yy.length != 2 || parseInt(this.state.card_yy) == 0) {
            this.setState({ expireDateError: _e.cardExpireDateCheck, card_yyError: 'error' });
            return;
        }

        if (this.state.birth_no == '') { this.setState({ birth_noError: _e.birth_noCheck }); return; }
        if (this.state.card_pwd == '') { this.setState({ card_pwdError: _e.cardPwd2DigitsCheck }); return; }

        this.setState({
            cardNumError: null, card_num1Error : null, card_num2Error : null, card_num3Error : null, card_num4Error : null,
            expireDateError: null, card_mmError : null, card_yyError : null,
            birth_noError : null,
            card_pwdError : null
        });

        performNetwork(this, this.state.params.homeComp, update_cardinfo(
            store.getState().user.apiToken,
            this.state.card_num1 + "-" + this.state.card_num2 + "-" + this.state.card_num3 + "-" + this.state.card_num4,
            this.state.card_mm,
            this.state.card_yy,
            this.state.card_pwd,
            this.state.birth_no
        )).then((response) => {
            if (response == null) { return; }

            showToast(_e.registCardSuccess , "success");
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
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>카드번호</Text>
                        </View>
                        <View style={[elements.flex_rowAlign , {justifyContent:"space-between"}]}>
                            <Item rounded style={ [this.state.card_num1Error != null ? form.item_common_failed : form.item_common , {width: '23.5%'}]}>
                                <Input
                                    maxLength={ 4 }
                                    secureTextEntry={true}
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "1234"
                                    value = { this.state.card_num1 }
                                    onChangeText = { (text) => this.cardNumberChanged(0, text) }
                                />
                                { this.state.cardNumError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.cardNumError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>
                            <Item rounded style={ [this.state.card_num2Error != null ? form.item_common_failed : form.item_common , {width: '23.5%'}] }>
                                <Input
                                    ref={ (input) => { this.cardNumInput2 = input } }
                                    maxLength={ 4 }
                                    secureTextEntry={true}
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "1234"
                                    value = { this.state.card_num2 }
                                    onChangeText = { (text) => this.cardNumberChanged(1, text) }
                                />
                            </Item>
                            <Item rounded style={ [this.state.card_num3Error != null ? form.item_common_failed : form.item_common , {width: '23.5%'}] }>
                                <Input
                                    ref={ (input) => { this.cardNumInput3 = input } }
                                    maxLength={ 4 }
                                    secureTextEntry={true}
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "1234"
                                    value = { this.state.card_num3 }
                                    onChangeText = { (text) => this.cardNumberChanged(2, text) }
                                />
                            </Item>
                            <Item rounded style={ [this.state.card_num4Error != null ? form.item_common_failed : form.item_common , {width: '23.5%'}] }>
                                <Input
                                    ref={ (input) => { this.cardNumInput4 = input } }
                                    maxLength={ 4 }
                                    secureTextEntry={true}
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "1234"
                                    value = { this.state.card_num4 }
                                    onChangeText = { (text) => this.cardNumberChanged(3, text) }
                                />
                            </Item>
                        </View>

                        <View style={base.top30}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>유효기간</Text>
                        </View>
                        <View style={[elements.flex_rowAlign , {justifyContent:"flex-start"}]}>
                            <Item rounded style={ [this.state.card_mmError != null ? form.item_common_failed : form.item_common , {width: '22%' , marginRight: 10}]}>
                                <Input
                                    ref={ (input) => { this.cardExpireDateMMInput = input } }
                                    maxLength={ 2 }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "MM"
                                    value = { this.state.card_mm }
                                    onChangeText = {(text) => this.cardExpireDateChanged('mm', text)}
                                />
                                { this.state.expireDateError != null ?
                                    <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.expireDateError }</Text>
                                    </View>
                                :
                                    null
                                }
                            </Item>
                            <Item rounded style={ [this.state.card_yyError != null ? form.item_common_failed : form.item_common , {width: '22%'}] }>
                                <Input
                                    ref={ (input) => { this.cardExpireDateYYInput = input } }
                                    maxLength={ 2 }
                                    style = { form.input_common }
                                    placeholderTextColor = '#a2a2a2'
                                    keyboardType={'numeric'}
                                    textAlign='center'
                                    placeholder = "YY"
                                    value = { this.state.card_yy }
                                    onChangeText = {(text) => this.cardExpireDateChanged('yy', text)}
                                />
                            </Item>
                        </View>

                        <View style={base.top30}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>생년월일(6자리) 또는 사업자번호(10자리)</Text>
                        </View>
                        <Item rounded style={ [this.state.birth_noError != null ? form.item_common_failed : form.item_common , {position : "relative"}] }>
                            <Input
                                value = { this.state.birth_no }
                                style = { form.input_common }
                                keyboardType={'numeric'}
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({birth_no: text.replace(' ' , ''), birth_noError: null})}
                            />
                            { this.state.birth_noError != null ?
                                <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.birth_noError }</Text>
                                </View>
                            :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>비밀번호 앞 2자리</Text>
                        </View>
                        <Item rounded style={ [this.state.card_pwdError != null ? form.item_common_failed : form.item_common , {position : "relative"}] }>
                            <Input
                                secureTextEntry={true}
                                value = { this.state.card_pwd }
                                style = { form.input_common }
                                keyboardType={'numeric'}
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({card_pwd: text.replace(' ' , ''), card_pwdError: null})}
                            />
                            { this.state.card_pwdError != null ?
                                <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.card_pwdError }</Text>
                                </View>
                            :
                                null
                            }
                        </Item>

                        <View style={[base.top30 , elements.flex_rowAlign]}>
                            <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                            <View style={{marginLeft: 10}}>
                                <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>등록된 카드정보로 정기결제가 진행됩니다.</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11 , {color: '#636363'}] }>-기간 종료전 전체찾기시 자동결제 진행되지 않습니다.</Text>
                            </View>
                        </View>

                        <View style={[base.top10 , elements.flex_rowAlign]}>
                            <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                            <View style={{marginLeft: 10}}>
                                <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>무료취소 변경 가능시간</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11, {color: '#636363'}] }>-15시 이전 예약시 당일 15시</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11 , {color: '#636363'}] }>-15시 이후 예약시 다음날 15시</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11 , {color: '#636363'}] }>기본료(10,000원)의 50% 위약금:무료 취소시간 이후</Text>
                            </View>
                        </View>
                    </Form>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnRegistCardPressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>등록</Text>
                    </Button>
                </View>

            </Container>
        );
    }
}

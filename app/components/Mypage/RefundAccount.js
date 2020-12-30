import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Container, Content , Item, Input , Text , Button, Form, Right} from 'native-base';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import Images from "../../assets/Images";
import { get_bank_list, register_refund_account, get_refund_info } from './../Root/api.js';
import store from "./../../store/configuteStore";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ModalDropdown from 'react-native-modal-dropdown';

let pageTitle = '환불계좌 관리';

export default class RefundAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: props.params,
            
            loaded: true,
            arrBankData: [], arrBankName: [],
            bankIndex: 0, depositOwnerName: '', accountNumber: '',
            bankIndexError: null, depositOwnerNameError: null, accountNumberError: null
        };
    }

    componentDidMount() {
        this.fetchBankData();
    }
    fetchBankData() {
        performNetwork(this, this.state.params.homeComp, get_bank_list()).then((response) => {
            if (response == null) { return; }

            var arrBankData = [];
            response.data.bank_list.forEach(data => {
                arrBankData.push(data);
            });

            var arrBankName = [];
            arrBankData.forEach(data => {
                arrBankName.push(data.name);
            });

            this.setState({
                arrBankData: arrBankData,
                arrBankName: arrBankName
            });
            this.fetchRefundData(arrBankData);
        });
    }
    fetchRefundData(arrBankData) {
        performNetwork(this, this.state.params.homeComp, get_refund_info(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }

            var index = 0;
            for (var i = 0; i < arrBankData.length; i++) {
                if (arrBankData[i].id == response.data.bank_id) {
                    index = i;
                }
            }
            this.setState({
                bankIndex: index,
                depositOwnerName: response.data.deposit_owner_name,
                accountNumber: response.data.account_number
            });
        });
    }

    setMenuRef = ref => {
        this._bankDropDownMenu = ref;
    };
    hideMenu = () => {
        this._bankDropDownMenu.hide();
    };
    showMenu = () => {
        this._bankDropDownMenu.show();
    };
    onBankItemSelected(index) {
        this.setState({ bankIndexError: null });

        this.setState({ bankIndex: index });
        this._bankDropDownMenu.hide();
    }

    onBtnSavePressed() {
        if (this.state.depositOwnerName == '')  { this.setState({ depositOwnerNameError: _e.depositOwnerNameCheck });               return; }
        if (this.state.accountNumber == '')     { this.setState({ accountNumberError: _e.accountNumberCheck });                     return; }

        this.setState({
            bankIndexError: null,
            depositOwnerNameError: null,
            accountNumberError: null
        });

        performNetwork(this, this.state.params.homeComp, register_refund_account(
            store.getState().user.apiToken,
            this.state.arrBankData[this.state.bankIndex].id,
            this.state.depositOwnerName,
            this.state.accountNumber
        )).then((response) => {
            if (response == null) { return; }

            Actions.pop();
            showToast(_e.saveRefundAccountSuccess , "success");
        });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={ base.whiteBg }>
                    <Form style={ form.styleForm }>

                        <View><Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>은행</Text></View>
                        <View style={{ paddingTop: 8 }}>
                            { (this.state.arrBankData == null || this.state.arrBankData.length == 0) ? null :
                                <ModalDropdown
                                    style={ { paddingRight: 16, height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#efefef' } }
                                    textStyle={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack] }
                                    // dropdownStyle={{ marginTop: 8 }}
                                    dropdownTextStyle={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack, { lineHeight: 25 }] }
                                    options={ this.state.arrBankName }
                                    onSelect={ (index) => { this.setState({ bankIndex: index }) }}>
                                        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                                            <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack, { paddingLeft: 16 }] }>
                                                { this.state.arrBankData[this.state.bankIndex].name }
                                            </Text>
                                            <Right>
                                                <Image
                                                    style={{ width: 12, height: 7 }}
                                                    source={ Images.ic_dropdown_arrow } />
                                            </Right>
                                        </View>
                                </ModalDropdown>
                            }
                            { this.state.bankIndexError == null ? null : 
                                <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.bankIndexError }</Text>
                                </View>
                            }
                        </View>

                        <View style={base.top30}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>예금주명</Text>
                        </View>
                        <Item rounded style={[this.state.depositOwnerNameError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                            <Input
                                placeholder = "예금주명을 입력해주세요."
                                value = { this.state.depositOwnerName }
                                style = { form.input_common }
                                placeholderTextColor = '#a2a2a2'
                                // secureTextEntry={true}
                                onChangeText = {(text) => this.setState({depositOwnerName: text.replace(' ' , ''), depositOwnerNameError: null})}
                            />
                            { this.state.depositOwnerNameError != null ?
                                <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.depositOwnerNameError }</Text>
                                </View>
                            :
                                null
                            }
                        </Item>

                        <View style={base.top30}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>계좌번호</Text>
                        </View>
                        <Item rounded style={[this.state.accountNumberError != null ? form.item_common_failed : form.item_common, {position: 'relative'}] }>
                            <Input
                                placeholder = "계좌번호를 입력해주세요."
                                value = { this.state.accountNumber }
                                style = { form.input_common }
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({accountNumber: text.replace(' ' , ''), accountNumberError: null})}
                            />
                            { this.state.accountNumberError != null ?
                                <View style={{flex: 1, flexDirection: 'column' , position: 'absolute' , top: 55}} >
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorRed] }>* { this.state.accountNumberError }</Text>
                                </View>
                            :
                                null
                            }
                        </Item>

                        <View style={[base.top30 , elements.flex_rowAlign]}>
                            <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                            <View style={{marginLeft: 10}}>
                                <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>등록된 카드정보로 정기결제가 진행됩니다.</Text>
                            </View>
                        </View>
                        <View style={[base.top10 , elements.flex_rowAlign]}>
                            <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                            <View style={{marginLeft: 10}}>
                                <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>무료취소 변경 가능시간</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11, {color: '#636363'}] }>-15시 이전 예약시 당일 15시</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11 , {color: '#636363'}] }>-15시 이후 예약시 다음날 15시</Text>
                                <Text style={ [fonts.familyRegular, fonts.size11 , {color: '#636363'}] }>기본료(10,000원)의 100% 위약금:무료 취소시간 이후</Text>
                            </View>
                        </View>
                    </Form>
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnSavePressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>등록</Text>
                    </Button>
                </View>

            </Container>
        );
    }
}

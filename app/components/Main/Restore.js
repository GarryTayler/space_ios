//기간내 재보관
import React from 'react';
import { Dimensions, View, TouchableHighlight, BackHandler, Picker, Image , Keyboard } from 'react-native';
import { Container, Item, Input , Text , Button , CheckBox , Content , Radio, Form } from 'native-base';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import Images from "../../assets/Images";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { _e } from '../../lang';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../Shared/global';
import Postcode from 'react-native-daum-postcode';
import {get_empty_box} from './../Root/api';
import {performNetwork} from './../Shared/global';
import store from './../../store/configuteStore';

let pageTitle = '기간내 재보관';
var self = null;

export default class Returngood extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params: props.params,
            viewWidth: 0, viewHeight: 0,
            loaded: true,
            isSameAddress: false,
            isAddressSearch: false,
            detailAddr: '', addr1: '', addr2: '',
            addressError: null, detailAddrError: null, addr1Error: null, addr2Error: null
        };
    }

    componentDidMount() {
        self = this;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.setState({
            viewWidth: Math.round(Dimensions.get('window').width),
            viewHeight: Math.round(Dimensions.get('window').height)
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

    sameAddressCheck() {
        let isSameAddress = !this.state.isSameAddress;

        let user = store.getState().user;
        this.setState({
            isSameAddress: isSameAddress,
            detailAddr: isSameAddress ? user.detail_addr : '',
            addr1: isSameAddress ? user.addr1 : '',
            addr2: isSameAddress ? user.addr2 : ''
        });
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

    onBtnPayPressed() {
        Keyboard.dismiss();
        if (this.state.detailAddr == '')        { this.setState({ addressError: _e.addressCheck, detailAddrError: 'error' });       return; }
        if (this.state.addr1 == '')             { this.setState({ addressError: _e.addressCheck, addr1Error: 'error' });            return; }
        //if (this.state.addr2 == '')             { this.setState({ addressError: _e.addressCheck, addr2Error: 'error' });            return; }

        this.setState({
            detailAddrError: null,
            addressError: null,
            addr1Error: null,
            addr2Error: null,
        });

        var params = {
            homeComp: this.state.params.homeComp,
            box_id: this.state.params.boxId,
            detail_addr: this.state.detailAddr,
            addr1: this.state.addr1,
            addr2: this.state.addr2,
            key: "restore"
        };

        Actions.push("payment", { params: params });
    }
    
    render() {
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
                        <Form style={form.styleForm}>
                            <TouchableHighlight activeOpacity={ 0.9 } underlayColor='#eee' style={{ padding: 8, paddingLeft: 0 }}
                                onPress={ () => { this.sameAddressCheck() } }>
                                <View style={[{ display:'flex' , flexDirection:'row' , alignItems: 'center' }]}>
                                    <CheckBox checked={ this.state.isSameAddress } color="#27cccd" style= {{marginLeft: -7}} />
                                    <Text style={[fonts.familyMedium, fonts.size14, fonts.colorLightBlack, {marginLeft: 20}]}>보관시 등록 한 주소지와 동일</Text>
                                </View>
                            </TouchableHighlight>
                            
                            <View style={base.top20}>
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

                            <View style={ base.top30 } />
                            <View style={[{ display:'flex' , flexDirection:'row' , alignItems: 'center' }]}>
                                <Radio selected={true} selectedColor="#27cccd" />
                                <Text style={[fonts.familyMedium, fonts.size14, fonts.colorLightBlack, { marginLeft: 8 }]}>일반 택배배송 10,000원</Text>
                            </View>

                            <View style={[base.top30 , elements.flex_rowAlign]}>
                                <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                                <View style={{marginLeft: 10}}>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>물류처리 등에 따른</Text>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>서비스 이용비용(10,000원)이 추가 결제됩니다,</Text>
                                </View>
                            </View>
                        </Form>
                    }
                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>

                { !this.state.isAddressSearch ?
                    <View style={ form.styleForm }>
                        <Button full style={form.submitButton1} onPress={()=>this.onBtnPayPressed()}>
                            <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>결제하기</Text>
                        </Button>
                    </View>
                : null }

            </Container>
        )
    }
}
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

            arrBoxCountData: [],
            curBoxCountIndex: 0,
            curCombinedBoxCount: 0,

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

        this.fetchData();
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

    fetchData() {
        performNetwork(this, this.state.params.homeComp, get_empty_box(
            store.getState().user.apiToken
        )).then((response) => {
            if (response == null) { return; }

            var arrBoxCountData = [];
            for (var i = 1; i <= response.data.box_count; i++) {
                var arrCombinedCount = [];
                for (var j = i; j >= 0; j--) {
                    arrCombinedCount.push([j, i - j]);
                }

                arrBoxCountData.push({
                    box_count: i,
                    text: `${i}box`,
                    arrCombinedBoxCount: arrCombinedCount
                });
            }
            this.setState({ arrBoxCountData: arrBoxCountData });
        });
    }

    _onChange = (value , index , data) => {
        // the full item as defined in the list of items is passed to the onChange handler to give full
        // flexibility on what to do...
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

    _numOfBoxDropDownMenu = null;
    setMenuRef = ref => {
        this._numOfBoxDropDownMenu = ref;
    };
    hideMenu = () => {
        this._numOfBoxDropDownMenu.hide();
    };
    showMenu = () => {
        this._numOfBoxDropDownMenu.show();
    };
    onBoxCountSelected(index) {
        this.hideMenu();

        this.setState({
            curBoxCountIndex: index,
            curCombinedBoxCount: 0
        });
    }

    _combinedNumOfBoxDropDownMenu = null;
    setCombinedNumMenuRef = ref => {
        this._combinedNumOfBoxDropDownMenu = ref;
    };
    hideCombinedNumMenu = () => {
        this._combinedNumOfBoxDropDownMenu.hide();
    };
    showCombinedNumMenu = () => {
        this._combinedNumOfBoxDropDownMenu.show();
    };
    onCombinedBoxCountSelected(index) {
        this.hideCombinedNumMenu();

        this.setState({ curCombinedBoxCount: index });
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
            box_count: this.state.arrBoxCountData[this.state.curBoxCountIndex].box_count,
            combined_box_count: this.state.arrBoxCountData[this.state.curBoxCountIndex].arrCombinedBoxCount[this.state.curCombinedBoxCount],
            key: "restore"
        };

        Actions.push("payment", { params: params });
    }

    getCombinedCountText(item) {
        if (item == null || item.length != 2) { return ""; }

        if (item[1] == 0) {
            return "표준박스 " + item[0] + "개";
        } else if (item[0] == 0) {
            return "의류박스 " + item[1] + "개";
        } else if (item[0] > 0 && item[1] > 0) {
            return "표준박스 " + item[0] + "개 / 의류박스 " + item[1] + "개";
        }
        return "";
    }
    render() {
        let data = [{
            value: '1box',
        }, {
            value: '2box',
        }, {
            value: '3box',
        }];
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

                            <View style={base.top30}>
                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>박스수량</Text>
                            </View>

                            { this.state.arrBoxCountData == null || this.state.arrBoxCountData.length == 0  ? null :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Menu
                                        ref={this.setMenuRef}
                                        button={
                                            <Button bordered
                                                style={{ borderColor: '#e6e6e6', height: 40, paddingEnd: 16 }}
                                                onPress={this.showMenu}>
                                                <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightDarkGray] }>{ this.state.arrBoxCountData[this.state.curBoxCountIndex].text }</Text>
                                                <Image
                                                    style={{ width: 12, height: 7 }}
                                                    source={ Images.ic_dropdown_arrow } />
                                            </Button>
                                        } >
                                        { this.state.arrBoxCountData.map( (item, index) => (
                                            <View>
                                                <MenuItem
                                                    key={ index }
                                                    onPress={ () => { this.onBoxCountSelected(index) } }>
                                                    { item.text }
                                                </MenuItem>
                                                <MenuDivider />
                                            </View>
                                        )) }
                                    </Menu>

                                    <Menu
                                        ref={this.setCombinedNumMenuRef}
                                        button={
                                            <Button bordered
                                                style={{ borderColor: '#e6e6e6', height: 40, paddingEnd: 16 }}
                                                onPress={this.showCombinedNumMenu}>
                                                <Text style={ [fonts.familyRegular, fonts.size15, fonts.colorLightDarkGray] }>
                                                    { this.getCombinedCountText(this.state.arrBoxCountData[this.state.curBoxCountIndex].arrCombinedBoxCount[this.state.curCombinedBoxCount]) }
                                                </Text>
                                                <Image
                                                    style={{ width: 12, height: 7 }}
                                                    source={ Images.ic_dropdown_arrow } />
                                            </Button>
                                        } >
                                        { this.state.arrBoxCountData[this.state.curBoxCountIndex].arrCombinedBoxCount.map( (item, index) => (
                                            <View>
                                                <MenuItem
                                                    key={ index }
                                                    onPress={ () => { this.onCombinedBoxCountSelected(index) } }>
                                                    { this.getCombinedCountText(item) }
                                                </MenuItem>
                                                <MenuDivider />
                                            </View>
                                        )) }
                                    </Menu>
                                </View>
                            }

                            <View style={ base.top30 } />
                            <View style={[{ display:'flex' , flexDirection:'row' , alignItems: 'center' }]}>
                                <Radio selected={true} selectedColor="#27cccd" />
                                <Text style={[fonts.familyMedium, fonts.size14, fonts.colorLightBlack, { marginLeft: 8 }]}>일반 택배배송 10,000원</Text>
                            </View>

                            <View style={[base.top30 , elements.flex_rowAlign]}>
                                <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                                <View style={{marginLeft: 10}}>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>물류처리 등에 따른</Text>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>서비스 이용비용(10,000원)이 추가 결제됩니다.</Text>
                                </View>
                            </View>
                            <View style={[base.top10 , elements.flex_rowAlign]}>
                                <Image source={Images.warning} style={Image_Icon.mypageIcons} />
                                <View style={{marginLeft: 10}}>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>기존 이용하던 박스 종류와 상관없이</Text>
                                    <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>동일 박스 수량내에서 이용가능합니다.</Text>
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

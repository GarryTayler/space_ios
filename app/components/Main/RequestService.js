/*
    Created by Colin (2019-10-02)
*/

import React from 'react';
import { Dimensions, View, Image, TouchableHighlight, BackHandler, FlatList,ScrollView, TouchableOpacity } from 'react-native';
import { Container, List, Form, Item, Text, Button, Card, CardItem, Body, Left, Right, Content, Radio, CheckBox } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import styles, { base, form, tabs, elements, card, dialog, spaces, fonts } from './../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
import { _e } from "../../lang";
import { PRICE_MAIN, PRICE_BOX_PER_MONTH, PRICE_RESTORE } from "../../constants";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast, number_format} from './../Shared/global';
import InputSpinner from "react-native-input-spinner";
import Images from "../../assets/Images";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {Actions} from 'react-native-router-flux';
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { get_coupon_list, getBoxList } from './../Root/api';
import store from "./../../store/configuteStore";
TouchableOpacity.defaultProps = { activeOpacity: 1 };
let pageTitle = '보관수량';

var boxDetailModalVisible = false;

class RequestService extends React.Component {

    _couponDropDownMenu = null;

    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            viewWidth: 0,
            loaded: true,

            arrRequestData: [],
            arrCouponData: [],
            issuedCouponId: 0,
            arrShowingCouponData: [],
            selectedCouponIndex: 0,
            priceBase: 0,
            priceTotal: 0,

            boxDetailModalVisible: false,
            showingDetailBoxIndex: 0,
            isThingCheck: true,
            mainPrice: 0,
            discountPrice: 0
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.setState({ viewWidth: Math.round(Dimensions.get('window').width) });

        this.fetchCouponData();
        this.fetchBoxListData();
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        if (boxDetailModalVisible) {
            boxDetailModalVisible = false;
            return true;
        }

        return false;
    }

    fetchCouponData() {
        performNetwork(this, this.state.params.homeComp, get_coupon_list(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            var arrData = response.data.coupon_list;
            this.setState({ arrCouponData: arrData });
            this.updateCouponMenu();
        });
    }
    fetchBoxListData() {
        performNetwork(this, this.state.params.homeComp, getBoxList()).then((response) => {
            if (response == null) { return; }
            if (response.data.box_list == null || response.data.box_list.length == 0) {
                return;
            }
            let arrData = [];
            let mainPrice = 0;
            response.data.box_list.map(function(data) {
                if(data.type == 1){
                    let temp = ({
                        id: data.id,
                        boxName: data.name,
                        image: [data.image1, data.image2],
                        size: [data.width, data.length, data.height],
                        maxWeight: data.max_weight,
                        expectQty: data.expect_qty,
                        price: data.price,
                        type: data.type,
                        numOfBox: 1,
                        numOfMonth: 1,
                        isSelected: data.name == "표준박스"
                    })
                    arrData.push(temp);
                }else if(data.type == 0){
                    mainPrice = data.price;
                }
            });
            this.setState({mainPrice : mainPrice});
            this.setState({ arrRequestData : arrData });
            this.updatePrice();
        });
    }

    setMenuRef = ref => {
        this._couponDropDownMenu = ref;
    };
    hideMenu = () => {
        this._couponDropDownMenu.hide();
    };
    showMenu = () => {
        this._couponDropDownMenu.show();
    };

    onBoxPressed(index) {
        var arrRequestData = this.state.arrRequestData;
        arrRequestData[index].isSelected = !arrRequestData[index].isSelected;
        this.setState({ arrRequestData: arrRequestData });

        this.updateCouponMenu();
    }
    onBoxImgPressed(index) {
        this.setState({
            boxDetailModalVisible: true,
            showingDetailBoxIndex: index
        });
        boxDetailModalVisible = true;
    }

    onInputSpinnerValueChanged(index, key, updatedNum) {
        var arrData = this.state.arrRequestData;

        if (key == 'box') {
            arrData[index].numOfBox = updatedNum;
        } else if (key == 'month') {
            arrData[index].numOfMonth = updatedNum;
        }
        this.setState({ arrRequestData: arrData });

        this.updateCouponMenu();
    }

    updateCouponMenu() {
        var arrShowingCouponData = [{
            coupon_id: -1,
            description: "해당없음"
        }];

        var isOverThan3 = false, isOverThan6 = false, isOverThan9 = false, isOverThan12 = false;
        
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                if (data.numOfMonth >= 12) {
                    isOverThan12 = true;
                } else if (data.numOfMonth >= 6) {
                    isOverThan6 = true;
                } else if (data.numOfMonth >= 3) {
                    isOverThan3 = true;
                }
            }
        });

        var arrCouponData = this.state.arrCouponData;
        let coupon_issued_value = 0;
        arrCouponData.forEach(data => {
            if (data.used) {
                // Already used, Ignore
            } else {
                if (data.issued) {
                    arrShowingCouponData.push(data);
                } else {
                    if (data.use_months == 3 && isOverThan3) {
                        arrShowingCouponData.push(data);
                        coupon_issued_value = data.coupon_id
                    } else if (data.use_months == 6 && isOverThan6) {
                        arrShowingCouponData.push(data);
                        coupon_issued_value = data.coupon_id
                    } else if (data.use_months == 12 && isOverThan12) {
                        arrShowingCouponData.push(data);
                        coupon_issued_value = data.coupon_id
                    }

                }
            }
        });
        this.setState({
            arrShowingCouponData: arrShowingCouponData,
            selectedCouponIndex: arrShowingCouponData.length == 1 ? 0 : 1,
            issuedCouponId: coupon_issued_value
        });

        this.updatePrice(arrShowingCouponData, arrShowingCouponData.length == 1 ? 0 : 1);
    }

    onCouponItemSelected(index) {
        this.setState({ selectedCouponIndex: index });
        this._couponDropDownMenu.hide();

        this.updatePrice(null, index);
    }

    updatePrice(updatedArrShowingCouponData = null, updatedCouponIndex = null) {
        var priceBase = 0;
        var discountPrice = 0;
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                var numOfBoxDiscount = 0;
                var numOfMonthDiscount = 0;
                
                if(data.numOfBox >= 2 && data.numOfBox <= 5)
                    numOfBoxDiscount = 0.1;
                else if(data.numOfBox >= 6 && data.numOfBox <= 10)
                    numOfBoxDiscount = 0.2;
                else if(data.numOfBox >= 11 && data.numOfBox <= 15)
                    numOfBoxDiscount = 0.3;
                else if(data.numOfBox >= 16)
                    numOfBoxDiscount = 0.4;
                
                if(data.numOfMonth >= 3 && data.numOfMonth <= 5)
                    numOfMonthDiscount = 0.1;
                else if(data.numOfMonth >= 6 && data.numOfMonth <= 8)
                    numOfMonthDiscount = 0.2;
                else if(data.numOfMonth >= 9 && data.numOfMonth <= 11)
                    numOfMonthDiscount = 0.3;
                else if(data.numOfMonth >= 12)
                    numOfMonthDiscount = 0.4;
                priceBase += data.numOfBox * data.numOfMonth * data.price;
                discountPrice += parseInt(data.numOfBox * data.numOfMonth * data.price - (data.numOfBox * data.numOfMonth * data.price * (1 - numOfBoxDiscount) * ( 1 - numOfMonthDiscount)));
            }
        });
        
        var arrShowingCouponData = updatedArrShowingCouponData == null ? this.state.arrShowingCouponData : updatedArrShowingCouponData;

        var couponPrice = 0;
        if (arrShowingCouponData != null && arrShowingCouponData.length > 0) {
            let index = updatedCouponIndex == null ? this.state.selectedCouponIndex : updatedCouponIndex;

            if (arrShowingCouponData[index].coupon_id == -1) {
                couponPrice = 0;
            } else {
                couponPrice = arrShowingCouponData[index].discount;
            }
        }
        // arrShowingCouponData[this.state.selectedCouponIndex].discount

        this.setState({
            priceBase: priceBase,
            priceTotal: priceBase + this.state.mainPrice - couponPrice - discountPrice,
            discountPrice : discountPrice
        });
    }

    onBtnPayPressed() {
        if (this.state.priceTotal < 10000) {
            showToast(_e.shouldMoreThan20KWon);
            return;
        }
        var isSelected = false;
        var numOfTotalBox = 0;
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                isSelected = true;
                numOfTotalBox += data.numOfBox;
            }
        });
        if (!isSelected) {
            showToast(_e.shouldSelectBox);
            return;
        }

        /*
        if(numOfTotalBox > 5) {
            showToast(_e.shouldSelectLessThan5);
            return;
        } */

        var arrSpaceList = [], arrBoxList = [];
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                arrSpaceList.push({
                    box_no: data.id,
                    amount: data.numOfBox,
                    months: data.numOfMonth
                });

                arrBoxList.push({
                    box_id: data.id,
                    name: data.boxName,
                    amount: data.numOfBox,
                    months: data.numOfMonth,
                    price: data.numOfBox * data.numOfMonth * PRICE_BOX_PER_MONTH
                });
            }
        });

        var couponName = "";
        var couponPrice = 0;
        var couponId = 0;
        if (this.state.arrShowingCouponData != null && this.state.arrShowingCouponData.length > 0 && this.state.arrShowingCouponData[this.state.selectedCouponIndex].id != -1) {
            couponName = this.state.arrShowingCouponData[this.state.selectedCouponIndex].description;
            couponPrice = this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount;
            couponId = this.state.arrShowingCouponData[this.state.selectedCouponIndex].coupon_id;
        }
        if(couponPrice == undefined)
            couponPrice = 0;
        var coupon = [];
        this.state.arrShowingCouponData.forEach(data => {
            if (data.coupon_id != -1) {
                coupon.push(data.issued == 1 && data.used == 1 ? {
                    coupon_id: data.coupon_id,
                    used: this.state.arrShowingCouponData[this.state.selectedCouponIndex].coupon_id == data.coupon_id ? 1 : 0
                } : {
                    coupon_id: data.coupon_id,
                    issued: 1,
                    used: this.state.arrShowingCouponData[this.state.selectedCouponIndex].coupon_id == data.coupon_id ? 1 : 0
                });
            }
        });
        var params = {
            homeComp: this.state.params.homeComp,
            space_list: arrSpaceList,
            space_cost: this.state.priceBase,
            main_cost: this.state.mainPrice,
            discount: couponPrice + this.state.discountPrice,
            cost: this.state.priceTotal,
            desc: {
                type: 1,
                box_list: arrBoxList,
                space_cost: this.state.priceBase,
                main_cost: this.state.mainPrice,
                coupon_name: couponName,
                coupon_id: couponId,
                discount: couponPrice + this.state.discountPrice,
                cost: this.state.priceTotal,
                isThingCheck : this.state.isThingCheck,
                issued_coupon_id: this.state.issuedCouponId
            },
            coupon: coupon,
            addr1: this.state.params.addr1,
            addr2: this.state.params.addr2,
            detailAddr: this.state.params.detailAddr,
            isThingCheck : this.state.isThingCheck
        };
        params.key = "request_service";
        Actions.push("payment", { params: params });
    }

    renderPrice() {
        return (
            <Form style={ [form.itemContainer, { borderTopWidth: 1, borderTopColor: '#ededed' }] }>
                <View>
                    <View style={{ flexDirection: 'row' , paddingVertical: 2}}>
                        <Left>
                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>여유공간 금액</Text>
                        </Left>
                        <Right>
                            <Text style={ [fonts.familyBold, fonts.size13, fonts.colorLightBlack] }>{ number_format(this.state.priceBase) }원</Text>
                        </Right>
                    </View>
                    <View style={{ flexDirection: 'row' , paddingVertical: 2}}>
                        <Left>
                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>기본비용 금액</Text>
                        </Left>
                        <Right>
                            <Text style={ [fonts.familyBold, fonts.size13, fonts.colorLightBlack] }>{ number_format(this.state.mainPrice) }원</Text>
                        </Right>
                    </View>
                    <View style={{ flexDirection: 'row' , paddingVertical: 2}}>
                        <Left>
                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>할인 쿠폰</Text>
                        </Left>
                        <Right style={{ flex: 3 }}>
                            { (this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length == 0) ? 
                                <Menu
                                    ref={this.setMenuRef}
                                    button={
                                        <Button bordered
                                            style={{ borderColor: '#e6e6e6', height: 25, paddingHorizontal: 10 }}
                                            onPress={this.showMenu}>
                                            <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray] }>해당 없음</Text>
                                            <Image
                                                style={{ width: 12, height: 7 }}
                                                source={ Images.ic_dropdown_arrow } />
                                        </Button>
                                    } >
                                </Menu>
                            :
                                <Menu
                                    ref={this.setMenuRef}
                                    button={
                                        <Button bordered
                                            style={{ borderColor: '#e6e6e6', height: 25, paddingHorizontal: 10 }}
                                            onPress={this.showMenu}>
                                            <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack] }>
                                                { this.state.arrShowingCouponData[this.state.selectedCouponIndex].description }
                                            </Text>
                                            <Image
                                                style={{ width: 12, height: 7 }}
                                                source={ Images.ic_dropdown_arrow } />
                                        </Button>
                                    } >
                                    { this.state.arrShowingCouponData.map((item, index) => (
                                        <MenuItem key= { index } onPress={ () => { this.onCouponItemSelected(index) } }>{ item.description }</MenuItem>
                                    )) }
                                </Menu>
                            }
                        </Right>
                    </View>
                    <View style={{ flexDirection: 'row' , paddingVertical: 2}}>
                        <Left style={{ flex: 1 }}>
                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>할인 금액</Text>
                        </Left>
                        <Right>
                            <Text style={ [fonts.familyBold, fonts.size13, fonts.colorLightBlack] }>
                            { (this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length <= 1) ? number_format(this.state.discountPrice) :
                                number_format(this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount + this.state.discountPrice)
                            }
                            원</Text>
                        </Right>
                    </View>

                    <View style={{ marginVertical: 8, borderTopWidth: 1, borderTopColor: '#ededed' }} />

                    <View style={{ flexDirection: 'row' , paddingVertical: 2}}>
                        <Left>
                            <Text style={ [fonts.familyMedium, fonts.size16, fonts.colorLightBlack] }>총 금액</Text>
                        </Left>
                        <Right>
                            <Text style={ [fonts.familyBold, fonts.size16, fonts.colorDarkPrimary] }>{ number_format(this.state.priceTotal) }원</Text>
                        </Right>
                    </View>
                    <View>
                        <TouchableHighlight activeOpacity={ 0.9 } underlayColor='#eee' style={{ padding: 4, paddingLeft: 0 }}
                            onPress={ () => { this.isThingCheck() } }>
                            <View style={[{ display:'flex' , flexDirection:'row' , alignItems: 'center' }]}>
                                <CheckBox checked={ this.state.isThingCheck } color="#27cccd" style= {{marginLeft: -7}} onPress={ () => { this.isThingCheck() } } />
                                <Text style={[fonts.familyMedium, fonts.size14, fonts.colorLightBlack, {marginLeft: 20}]}>검수/사진등록</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={ base.top10 } />
                <Text style={ [fonts.familyMedium, fonts.size12, fonts.colorDarkPrimary, { alignSelf: 'center' }] }>기간 종료 후 박스 당X10,000원 / 월 자동결제</Text>
                <View style={ base.top10 } />
                <Button full style={ form.submitButton1 } onPress={ () => this.onBtnPayPressed() }>
                    <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>결제하기</Text>
                </Button>
            </Form>
        );
    }
    renderDialog() {
        let boxImgWidth = (this.state.viewWidth * 0.9 - 30) / 2;

        return ( (this.state.arrRequestData == null || this.state.arrRequestData.length == 0) ? null :
            <Dialog
                visible={ this.state.boxDetailModalVisible }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.9 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ boxDetailModalVisible: false }); }}
                footer={
                    <DialogFooter bordered={ false } style={ dialog.footer }>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="확인"
                                textStyle={ dialog.footerButton }
                                onPress={() => {
                                    this.setState({ boxDetailModalVisible: false });
                                    boxDetailModalVisible = false;
                                }} />
                        ]}
                    </DialogFooter>
                } >
                <DialogContent>
                    <Form style={ dialog.contentTitleContainer }>
                        <Text style={ dialog.contentTitle }>
                            { this.state.arrRequestData[this.state.showingDetailBoxIndex].boxName }
                        </Text>
                    </Form>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Image
                            style={{ width: boxImgWidth, height: boxImgWidth, borderRadius: 8, borderWidth: 1, borderColor: '#ededed' }}
                            source={{ uri: this.state.arrRequestData[this.state.showingDetailBoxIndex].image[0] }}
                            resizeMode='contain' />
                        <View style={{ marginHorizontal: 5 }} />
                        <Image
                            style={{ width: boxImgWidth, height: boxImgWidth, borderRadius: 8, borderWidth: 1, borderColor: '#ededed' }}
                            source={{ uri: this.state.arrRequestData[this.state.showingDetailBoxIndex].image[1] }}
                            resizeMode='contain' />
                    </View>

                    <Form style={{ paddingTop: 10 }}>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ dialog.contentHintText }>규격</Text>
                            <Right style={{ flex: 1 }}>
                                <Text style={ [dialog.contentValueText, {textAlign: 'right'}] }>
                                    가로 { this.state.arrRequestData[this.state.showingDetailBoxIndex].size[0] }cm x 세로 { this.state.arrRequestData[this.state.showingDetailBoxIndex].size[1] }cm x 높이 { this.state.arrRequestData[this.state.showingDetailBoxIndex].size[2] }cm
                                </Text>
                            </Right>
                        </Item>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ dialog.contentHintText }>무게</Text>
                            <Right style={{ flex: 1 }}>
                                <Text style={ [dialog.contentValueText, {textAlign: 'right'}] }>{ this.state.arrRequestData[this.state.showingDetailBoxIndex].maxWeight }</Text>
                            </Right>
                        </Item>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ [dialog.contentHintText, { alignSelf: 'flex-start' }] }>보관 예상량</Text>
                            <Right style={{ flex: 1 }}>
                                <Text style={ [dialog.contentValueText, {textAlign: 'right', lineHeight: 18}] }>{ this.state.arrRequestData[this.state.showingDetailBoxIndex].expectQty }</Text>
                            </Right>
                        </Item>
                    </Form>
                    <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={ [dialog.contentHintText, { paddingEnd: 5 }] }>수량</Text>
                                <InputSpinner
                                    editable={ false } rounded={ false }
                                    style={{ width: 110 }}
                                    fontSize={ 16 } textColor='white' inputStyle={{ borderWidth: 1, borderColor: '#28d2d2', height: 35, padding: 0, borderRadius: 5 }}
                                    colorMax='white' colorMin='white'
                                    color='white' colorPress='white'
                                    buttonFontSize={ 18 }
                                    background="#28d2d2"
                                    buttonTextColor='#808080'
                                    buttonStyle={{ borderWidth: 1, borderColor: '#f8f8f8', height: 35, width: 35 }}
                                    buttonPressTextColor='#808080'
                                    max={ 100 } min={ 1 } step={ 1 }
                                    value={ this.state.arrRequestData[this.state.showingDetailBoxIndex].numOfBox }
                                    buttonLeftText="−"
                                    onChange={ (num) => {
                                        this.onInputSpinnerValueChanged(this.state.showingDetailBoxIndex, 'box', num);
                                    }}
                                />
                        </View>
                        <View style={{ marginHorizontal: 5 }} />
                        
                    </View>
                    {
                        /*<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={ [dialog.contentHintText, { paddingEnd: 5 }] }>기간 (개월)</Text>
                                    <InputSpinner
                                        editable={ false } rounded={ false }
                                        style={{ width: 90 }}
                                        fontSize={ 16 } textColor='#999999' inputStyle={{ borderWidth: 1, borderColor: '#cccccc', height: 30, padding: 0 }}
                                        colorMax='white' colorMin='white'
                                        color='white' colorPress='white'
                                        buttonFontSize={ 15 }
                                        buttonTextColor='#999999'
                                        buttonStyle={{ borderWidth: 1, borderColor: '#cccccc', height: 30, width: 25 }}
                                        buttonPressTextColor='#cccccc'
                                        max={ 100 } min={ 1 } step={ 1 }
                                        value={ this.state.arrRequestData[this.state.showingDetailBoxIndex].numOfMonth }
                                        onChange={ (num) => {
                                            this.onInputSpinnerValueChanged(this.state.showingDetailBoxIndex, 'month', num);
                                        }}
                                    />
                            </View>*/
                    }

                    <Button transparent
                        style={ dialog.closeButton }
                        onPress={ () => {
                            this.setState({ boxDetailModalVisible: false });
                            boxDetailModalVisible = false;
                        }}>
                        <Image style={ elements.size16 } source={ Images.ic_dialog_close } />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    isThingCheck(){
        this.setState({isThingCheck : !this.state.isThingCheck});
    }
    nextScreen() {
        var temp = [];
        this.state.arrRequestData.map((data) => {
            if(data.isSelected)
                temp.push(data)
        })

        if(temp.length < 1) {
            showToast(_e.noselectedBox);
            return;
        }

        Actions.push("request_service_period", {data: temp, homeComp: this.state.params.homeComp, mainPrice: this.state.mainPrice, addr1: this.state.params.addr1, addr2: this.state.params.addr2, detailAddr: this.state.params.detailAddr})
    }
    render() {
        return ( (this.state.arrRequestData == null || this.state.arrRequestData.length == 0) ? null :
            <Container style={{backgroundColor: '#f6f5ff'}}>

                <UserHeader title={ pageTitle } />

                <View style={ spaces.vertical10 } />

                <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row'}}>
                    <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>여유공간 선택</Text>
                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightDarkGray] }>{" "} (박스 당 10,000원 / 월)</Text>
                </View>
                <ScrollView>
                    <FlatGrid
                        itemDimension={ this.state.viewWidth }
                        items={ this.state.arrRequestData }
                        renderItem={({ item, index }) => (
                        <TouchableHighlight activeOpacity={ 1 } underlayColor='#0000' style={{ marginHorizontal: 8, backgroundColor: 'white', borderRadius: 10 }}>
                            <View style={{padding: 15 }}>
                                <View style={{ flexDirection: 'row', marginLeft: 0, paddingVertical: 10 }}>
                                    <Button style={{ width: 80, height: 80, backgroundColor: '#ededed', borderRadius: 8 }}
                                        onPress={ () => this.onBoxImgPressed(index) }>
                                        <Image resizeMethod={"resize"}
                                            style={{  width: 80, height: 80, borderRadius: 8 }}
                                            source={{uri: item.image[0] }} />
                                    </Button>
                                    <View>
                                        <TouchableOpacity onPress={ () => this.onBoxPressed(index) }>
                                            <View style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size16, fonts.colorLightBlack, {marginBottom: 13}] }>{ item.boxName }</Text>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray, {borderBottomColor: '#f0f0f0', borderBottomWidth: 1, paddingVertical: 10}] }>
                                                    가로 { item.size[0] }cm x 세로 { item.size[1] }cm x 높이 { item.size[2] }cm
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{marginTop: 15, paddingLeft: 10 }}>
                                            <View style={{ marginBottom: 8 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorGrey] }>수량</Text>
                                            </View>
                                            <View >
                                                <InputSpinner
                                                    editable={ false } rounded={ false }
                                                    style={{ width: 110 }}
                                                    fontSize={ 16 } textColor='white' inputStyle={{ borderWidth: 1, borderColor: '#28d2d2', height: 35, padding: 0, borderRadius: 5 }}
                                                    colorMax='white' colorMin='white'
                                                    color='white' colorPress='white'
                                                    buttonFontSize={ 18 }
                                                    background="#28d2d2"
                                                    buttonTextColor='#808080'
                                                    buttonStyle={{ borderWidth: 1, borderColor: '#f8f8f8', height: 35, width: 35 }}
                                                    buttonPressTextColor='#808080'
                                                    max={ 100 } min={ 1 } step={ 1 }
                                                    value={ item.numOfBox }
                                                    buttonLeftText="−"
                                                    onChange={ (num) => {
                                                        this.onInputSpinnerValueChanged(index, 'box', num);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                    {
                                        /*<View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                            <Left style={{ flex: 3, alignItems: 'flex-end', paddingEnd: 10 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>기간(개월)</Text>
                                            </Left>
                                            <Right style={{ flex: 1 }}>
                                                <InputSpinner
                                                    editable={ false } rounded={ false }
                                                    style={{ width: 90 }}
                                                    fontSize={ 16 } textColor='#999999' inputStyle={{ borderWidth: 1, borderColor: '#cccccc', height: 30, padding: 0 }}
                                                    colorMax='white' colorMin='white'
                                                    color='white' colorPress='white'
                                                    buttonFontSize={ 15 }
                                                    buttonTextColor='#999999'
                                                    buttonStyle={{ borderWidth: 1, borderColor: '#cccccc', height: 30, width: 25 }}
                                                    buttonPressTextColor='#cccccc'
                                                    max={ 100 } min={ 1 } step={ 1 }
                                                    value={ item.numOfMonth }
                                                    onChange={ (num) => {
                                                        this.onInputSpinnerValueChanged(index, 'month', num);
                                                    }}
                                                />
                                            </Right>
                                        </View>*/
                                    }

                                <Button style={ [elements.size16, { position: 'absolute', alignSelf: 'flex-end', backgroundColor: 'white', right: 13, top: 13, borderRadius: 10, overflow: 'hidden', width: 20, height: 20 }] }
                                    onPress={ () => this.onBoxPressed(index) }>
                                    <Image
                                        style={ [elements.size16, { borderRadius: 10, width: 20, height: 20 }] }
                                        source={ item.isSelected ? Images.ic_checkbox_on : Images.ic_checkbox_off } />
                                </Button>
                            </View>
                        </TouchableHighlight>
                    )} />

                    <View style={{height: 80}}></View>
                </ScrollView>

                { this.renderDialog() }
                
                <Button bordered
                    style={elements.nextBtn}
                    onPress={ () => this.nextScreen() }>
                    <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorWhite] }>다음</Text>
                </Button>                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

            </Container>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(RequestService);

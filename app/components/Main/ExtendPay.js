/*
    Created by Colin (2019-10-02)
*/

import React from 'react';
import { Dimensions, View, Image, TouchableHighlight, BackHandler, FlatList,StyleSheet } from 'react-native';
import { Container, List, Form, Item, Text, Button, Card, CardItem, Body, Left, Right, Content, Radio, CheckBox } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, dialog, spaces, fonts } from './../../assets/styles';
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
import { normalize } from 'react-native-elements';

let pageTitle = '보관연장기간';

var boxDetailModalVisible = false;

class ExtendPay extends React.Component {

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
            discountPrice: 0,
            isShowRequestDialog: false
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

    fetchBoxListData() {
        performNetwork(this, this.state.params.homeComp, getBoxList()).then((response) => {
            if (response == null) { return; }
            if (response.data.box_list == null || response.data.box_list.length == 0) {
                return;
            }
            var arrRequestData = [];
            response.data.box_list.map((data) => {
                if(data.id == this.props.params.saveInfoData.box_no) {
                    let temp = ({
                        id: data.id,
                        boxName: data.name,
                        image: [data.image1, data.image2],
                        size: [data.width, data.length, data.height],
                        maxWeight: data.max_weight,
                        expectQty: data.expect_qty,
                        price: data.price,
                        type: data.type,
                        numOfBox: this.props.params.saveInfoData.box_count,
                        numOfMonth: 1
                    })
                    arrRequestData.push(temp);
                }
            })
            this.setState({arrRequestData})
        });
    }

    fetchCouponData() {
        performNetwork(this, this.props.homeComp, get_coupon_list(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            var arrData = response.data.coupon_list;
            this.setState({ arrCouponData: arrData });
            this.updateCouponMenu();
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
        arrRequestData.splice(index, 1);
        if(arrRequestData.length == 0)
            Actions.pop();
        this.setState({arrRequestData})
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
            if (data.numOfMonth >= 12) {
                isOverThan12 = true;
            } else if (data.numOfMonth >= 6) {
                isOverThan6 = true;
            } else if (data.numOfMonth >= 3) {
                isOverThan3 = true;
            }
        });

        var arrCouponData = this.state.arrCouponData;
        let coupon_issued_value = 0;
        arrCouponData.forEach(data => {
            if (data.used) {
                // Already used, Ignore
            } else {
                if (data.issued) {
                    /* 
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
                    */
                    arrShowingCouponData.push(data);
                    coupon_issued_value = 0;
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
            priceTotal: priceBase - couponPrice - discountPrice,
            discountPrice : discountPrice
        });
    }

    onBtnPayPressed() {
        if (this.state.priceTotal < 10000) {
            this.setState({isShowRequestDialog: false})
            showToast(_e.shouldMoreThan20KWon);
            return;
        }
        
        var numOfTotalBox = 0;
        this.state.arrRequestData.forEach(data => {
            numOfTotalBox += data.numOfBox;
        });

        /*
        if(numOfTotalBox > 5) {
            this.setState({isShowRequestDialog: false})
            showToast(_e.shouldSelectLessThan5);
            return;
        } */

        var arrSpaceList = [], arrBoxList = [];
        var numOfMonth = 1;
        this.state.arrRequestData.forEach(data => {
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
            numOfMonth = data.numOfMonth
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
            homeComp: this.props.homeComp,
            space_list: arrSpaceList,
            space_cost: this.state.priceBase,
            main_cost: 0,
            discount: couponPrice + this.state.discountPrice,
            cost: this.state.priceTotal > 0 ? this.state.priceTotal : 0,
            desc: {
                type: 10,
                box_list: arrBoxList,
                space_cost: this.state.priceBase,
                main_cost: 0,
                coupon_name: couponName,
                coupon_id: couponId,
                discount: couponPrice + this.state.discountPrice,
                cost: this.state.priceTotal > 0 ? this.state.priceTotal : 0,
                issued_coupon_id: this.state.issuedCouponId
            },
            box_id: this.state.params.boxId,
            numOfMonth: numOfMonth,
            coupon: coupon,
        };

        params.key = "extend_pay";
        this.setState({isShowRequestDialog: false})
        setTimeout(function() {
            Actions.push("payment", { params: params });
        }, 300)
        
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
                            <Text style={ [dialog.contentHintText, { paddingEnd: 5 }] }>기간 (개월)</Text>
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
                                    value={ this.state.arrRequestData[this.state.showingDetailBoxIndex].numOfMonth }
                                    buttonLeftText="−"
                                    onChange={ (num) => {
                                        this.onInputSpinnerValueChanged(this.state.showingDetailBoxIndex, 'month', num);
                                    }}
                                />
                        </View>
                    </View>

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
    showRequest() {
        
        let maxMonth = 0;
        this.state.arrRequestData.forEach(data => {
            if(maxMonth < data.numOfMonth)
                maxMonth = data.numOfMonth;
        });

        

        var selectedCouponMonths = 0;

        if (this.state.arrShowingCouponData != null && this.state.arrShowingCouponData.length > 0 && this.state.arrShowingCouponData[this.state.selectedCouponIndex].id != -1) {
            selectedCouponMonths = this.state.arrShowingCouponData[this.state.selectedCouponIndex].use_months;
        }

        if(parseInt(maxMonth) < parseInt(selectedCouponMonths)) {
            showToast("보관기일이 " + selectedCouponMonths + "개월 이상인 박스가 있어야 쿠폰을 사용할 수 있습니다.");
            return;
        }                
        
        this.setState({isShowRequestDialog: !this.state.isShowRequestDialog})
    }
    renderBox() {
        return this.state.arrRequestData.map((data, index) => {
            return <View key={index} style={[styles.formContent, { borderBottomWidth: index != this.state.arrRequestData.length-1 ? 1 : 0}]}>
                <Text style={[fonts.size12, {color: '#979797'}]}>{data.boxName} {data.numOfBox}개/{data.numOfMonth}개월</Text>
                <Text style={[fonts.size12, {color: '#979797'}]}>{number_format(data.price)}원 X {data.numOfBox}개 X {data.numOfMonth}개월</Text>
            </View>
        })
    }
    render() {
        return ( (this.state.arrRequestData == null || this.state.arrRequestData.length == 0) ? null :
            <Container style={{backgroundColor: '#f6f5ff'}}>

                <UserHeader title={ pageTitle } />
                
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
                                    <View style={{ alignSelf: 'flex-start', paddingLeft: 10 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size16, fonts.colorLightBlack, {marginBottom: 13}] }>{ item.boxName }</Text>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray, {borderBottomColor: '#f0f0f0', borderBottomWidth: 1, paddingVertical: 10}] }>
                                            가로 { item.size[0] }cm x 세로 { item.size[1] }cm x 높이 { item.size[2] }cm
                                        </Text>
                                    </View>

                                    <View style={{marginTop: 15, paddingLeft: 10 }}>
                                        <View style={{ marginBottom: 8 }}>
                                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorGrey] }>기간(개월)</Text>
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
                                                value={ item.numOfMonth }
                                                buttonLeftText="−"
                                                onChange={ (num) => {
                                                    this.onInputSpinnerValueChanged(index, 'month', num);
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                )} />

                <View style={{position: 'absolute', width: '100%', bottom: 90}}>
                    <View style={{ marginHorizontal: 17, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 }}>
                        <Text style={ [fonts.familyRegular, fonts.size16, fonts.colorLightBlack, {marginBottom: 13}] }>정액쿠폰제</Text>
                        { (this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length == 0) ? 
                            <Menu
                                ref={this.setMenuRef}
                                button={
                                    <Button bordered style={{ borderColor: '#e6e6e6', height: 45, paddingRight: 10, borderRadius: 10 }}
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
                                    <Button bordered style={{ borderColor: '#e6e6e6', height: 45, paddingRight: 10, borderRadius: 10 }}
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
                    </View>
                </View>
                
                
                { this.renderDialog() }
                <View style={{height: 200}}></View>
                <View style={{position: 'absolute', width: '100%', bottom: 30}}>
                    <Button bordered
                        style={elements.nextBtn1}
                        onPress={() => this.showRequest()}>
                        <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorWhite] }>다음</Text>
                    </Button>                
                </View>

                <Dialog
                    visible={ this.state.isShowRequestDialog }
                    dialogAnimation={ new ScaleAnimation(0) }
                    width={ 0.9 }
                    overlayPointerEvents='none'
                    onHardwareBackPress={ () => { this.setState({ isShowRequestDialog: false }); }}
                >
                    <DialogContent>
                        <Form style={ [dialog.contentTitleContainer, {alignItems: 'flex-start', paddingHorizontal: 0}] }>
                            <Text style={ [dialog.contentTitle, {fontSize: normalize(14), color: '#3b3b3b'}] }>[보관비용]</Text>
                        </Form>

                        <Form style={ [dialog.contentTitleContainer, styles.formContainer] }>
                            {
                                this.renderBox()
                            }
                        </Form>

                        <Form style={ [dialog.contentTitleContainer, styles.formContainer, {marginTop: 10} ] }>
                            <View style={styles.formContent}>
                                <Text style={[fonts.size12, {color: '#979797'}]}>보관비용: </Text>
                                <Text style={[fonts.size12, {color: '#979797'}]}>{number_format(this.state.priceBase)}원</Text>
                            </View>
                            {
                                this.state.discountPrice > 0 ?
                                <View style={[styles.formContent]}>
                                    <Text style={[fonts.size12, {color: '#979797'}]}>수량/기간 할인:</Text>
                                    <Text style={[fonts.size12, {color: '#979797'}]}>
                                        -{ number_format(this.state.discountPrice)}원
                                    </Text>
                                </View>
                                :
                                null
                            }
                            
                            {
                                this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length <= 1 ?
                                null
                                :

                                <View style={[styles.formContent]}>
                                    <Text style={[fonts.size12, {color: '#979797'}]}>할인쿠폰:</Text>
                                    <Text style={[fonts.size12, {color: '#979797'}]}>
                                        -{ number_format(this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount)}원
                                    </Text>
                                </View>
                            }
                            
                            <View style={[styles.formContent, { borderBottomWidth: 0}]}>
                                <Text style={[fonts.size12, {color: '#979797'}]}>보관료 합계: </Text>
                                <Text style={[fonts.size12, {color: '#979797'}]}>{this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length <= 1 ? number_format(this.state.priceBase - this.state.discountPrice > 0 ? this.state.priceBase - this.state.discountPrice : 0) : number_format(this.state.priceBase - this.state.discountPrice - this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount > 0 ? this.state.priceBase - this.state.discountPrice - this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount : 0)}원</Text>
                            </View>
                        </Form>

                        
                        <Form style={ [dialog.contentTitleContainer, styles.formContainer, {marginTop: 10} ] }>
                            <View style={[styles.formContent, { borderBottomWidth: 0}]}>
                                <Text style={[fonts.size12, {color: '#979797', fontWeight: 'bold'}]}>결제금액</Text>
                                <Text style={[fonts.size12, {color: '#979797', fontWeight: 'bold'}]}>{number_format(this.state.priceTotal > 0 ? this.state.priceTotal : 0)}원</Text>
                            </View>
                        </Form>

                        
                        <Text style={ [dialog.contentTitle, {fontSize: normalize(14), color: '#3b3b3b', marginTop: 15}] }>신청하시겠습니까?</Text>

                        <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <TouchableHighlight style={styles.confirmBtn} onPress={() => this.setState({isShowRequestDialog: false})}>
                                <Text>아니요</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={[styles.confirmBtn, {borderColor: '#34dede', backgroundColor: '#34dede'}]} onPress={() => this.onBtnPayPressed()}>
                                <Text style={{color: 'white'}}>예</Text>
                            </TouchableHighlight>
                        </View>

                        <Button transparent
                            style={ dialog.closeButton }
                            onPress={ () => { this.setState({ isShowRequestDialog: false }); }}>
                            <Image style={ elements.size16 } source={ Images.ic_close } />
                        </Button>
                    </DialogContent>
                </Dialog>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

            </Container>
        )
    }

}

const styles = StyleSheet.create({
    confirmBtn: {
        width: '48%', borderWidth: 1, borderColor: '#e9e9e9', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10
    },
    formContainer: {
        alignItems: 'flex-start', paddingHorizontal: 0, paddingVertical: 0, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 10
    },
    formContent: {
        paddingHorizontal: 10, 
        paddingVertical: 15, 
        flexDirection: 'row', justifyContent: 'space-between', 
        borderBottomColor: '#f0f0f0', borderBottomWidth: 1, 
        width: '100%'
    }
});
const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(ExtendPay);

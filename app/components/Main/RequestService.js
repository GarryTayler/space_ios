/*
    Created by Colin (2019-10-02)
*/

import React from 'react';
import { Dimensions, View, Image, TouchableHighlight, BackHandler } from 'react-native';
import { Container, List, Form, Item, Text, Button, Card, CardItem, Body, Left, Right, Content, Radio, CheckBox } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, dialog, spaces, fonts } from './../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
import { _e } from "../../lang";
import { PRICE_MAIN, PRICE_BOX_PER_MONTH, PRICE_DEVLIERY_OF_RETURN_GOOD, PRICE_RESTORE } from "../../constants";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast, number_format} from './../Shared/global';
import InputSpinner from "react-native-input-spinner";
import Images from "../../assets/Images";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {Actions} from 'react-native-router-flux';
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { get_coupon_list, getBoxList } from './../Root/api';
import store from "./../../store/configuteStore";

let pageTitle = '서비스 신청(2/2)';

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
            arrShowingCouponData: [],
            selectedCouponIndex: 0,
            priceBase: 0,
            priceTotal: 0,

            boxDetailModalVisible: false,
            showingDetailBoxIndex: 0
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
            const arrData = response.data.box_list.map(data => ({
                id: data.id,
                boxName: data.name,
                image: [data.image1, data.image2],
                size: [data.width, data.length, data.height],
                maxWeight: data.max_weight,
                expectQty: data.expect_qty,

                numOfBox: 1,
                numOfMonth: 1,
                isSelected: data.name == "표준박스"
            }));
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

        var isOverThan3 = false, isOverThan6 = false;
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                if (data.numOfMonth >= 6) {
                    isOverThan6 = true;
                } else if (data.numOfMonth >= 3) {
                    isOverThan3 = true;
                }
            }
        });

        var arrCouponData = this.state.arrCouponData;
        arrCouponData.forEach(data => {
            if (data.used) {
                // Already used, Ignore
            } else {
                if (data.issued) {
                    arrShowingCouponData.push(data);
                } else {
                    if (data.use_months == 3 && isOverThan3) {
                        arrShowingCouponData.push(data);
                    } else if (data.use_months == 6 && isOverThan6) {
                        arrShowingCouponData.push(data);
                    }
                }
            }
        });

        this.setState({
            arrShowingCouponData: arrShowingCouponData,
            selectedCouponIndex: arrShowingCouponData.length == 1 ? 0 : 1
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
        this.state.arrRequestData.forEach(data => {
            if (data.isSelected) {
                priceBase += data.numOfBox * data.numOfMonth * PRICE_BOX_PER_MONTH;
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
            priceTotal: priceBase + PRICE_MAIN - couponPrice
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

        if(numOfTotalBox > 5) {
            showToast(_e.shouldSelectLessThan5);
            return;
        }

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
        if (this.state.arrShowingCouponData != null && this.state.arrShowingCouponData.length > 0 && this.state.arrShowingCouponData[this.state.selectedCouponIndex].id != -1) {
            couponName = this.state.arrShowingCouponData[this.state.selectedCouponIndex].description;
            couponPrice = this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount;
        }

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
            main_cost: PRICE_MAIN,
            discount: couponPrice,
            cost: this.state.priceTotal,
            desc: {
                type: 1,
                box_list: arrBoxList,
                space_cost: this.state.priceBase,
                main_cost: PRICE_MAIN,
                coupon_name: couponName,
                discount: couponPrice,
                cost: this.state.priceTotal
            },
            coupon: coupon,

            addr1: this.state.params.addr1,
            addr2: this.state.params.addr2,
            detailAddr: this.state.params.detailAddr
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
                            <Text style={ [fonts.familyBold, fonts.size13, fonts.colorLightBlack] }>{ number_format(PRICE_MAIN) }원</Text>
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
                                            style={{ borderColor: '#e6e6e6', height: 32, paddingHorizontal: 10 }}
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
                                            style={{ borderColor: '#e6e6e6', height: 32, paddingHorizontal: 10 }}
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
                            { (this.state.arrShowingCouponData == null || this.state.arrShowingCouponData.length == 0) ? 0 :
                                number_format(this.state.arrShowingCouponData[this.state.selectedCouponIndex].discount)
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
                </View>
                <View style={ base.top20 } />
                <Text style={ [fonts.familyMedium, fonts.size12, fonts.colorDarkPrimary, { alignSelf: 'center' }] }>기간 종료 후 박스 당X10,000원 / 월 자동결제</Text>

                <View style={ base.top20 } />
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
                    <View style={ base.top10 } />
                    <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={ [dialog.contentHintText, { paddingEnd: 5 }] }>수량</Text>
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
                                    value={ this.state.arrRequestData[this.state.showingDetailBoxIndex].numOfBox }
                                    onChange={ (num) => {
                                        this.onInputSpinnerValueChanged(this.state.showingDetailBoxIndex, 'box', num);
                                    }}
                                />
                        </View>
                        <View style={{ marginHorizontal: 5 }} />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
    render() {
        return ( (this.state.arrRequestData == null || this.state.arrRequestData.length == 0) ? null :
            <Container>

                <UserHeader title={ pageTitle } />

                <View style={ spaces.vertical20 } />

                <Item style={{ paddingHorizontal: 16, paddingVertical: 10, borderColor: '#ededed', borderBottomWidth: 1 }}>
                    <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>여유공간 선택</Text>
                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightDarkGray] }>{" "} (박스 당 10,000원 / 월)</Text>
                </Item>

                <FlatGrid
                    itemDimension={ this.state.viewWidth }
                    items={ this.state.arrRequestData }
                    renderItem={({ item, index }) => (
                    <TouchableHighlight activeOpacity={ 1 } underlayColor='#0000' style={{ marginHorizontal: 6 }}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#ededed', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', marginLeft: 0, paddingVertical: 10 }}>
                                <Button style={{ width: 100, height: 100, backgroundColor: '#ededed', borderRadius: 8 }}
                                    onPress={ () => this.onBoxImgPressed(index) }>
                                    <Image
                                        style={{ width: 100, height: 100, borderRadius: 8 }}
                                        source={{ uri: item.image[0] }} />
                                </Button>
                                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 20 }}>
                                    <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>{ item.boxName }</Text>
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray] }>
                                        가로 { item.size[0] }cm x 세로 { item.size[1] }cm x 높이 { item.size[2] }cm
                                    </Text>
                                </View>
                            </View>

                            <View style={{ marginTop: -40 }}>
                                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                    <Left style={{ flex: 3, alignItems: 'flex-end', paddingEnd: 10 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack] }>수량</Text>
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
                                            value={ item.numOfBox }
                                            onChange={ (num) => {
                                                this.onInputSpinnerValueChanged(index, 'box', num);
                                            }}
                                        />
                                    </Right>
                                </View>
                                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
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
                                </View>
                            </View>

                            <Button style={ [elements.size20, { position: 'absolute', alignSelf: 'flex-end', backgroundColor: 'white' }] }
                                onPress={ () => this.onBoxPressed(index) }>
                                <Image
                                    style={ [elements.size20, { position: 'absolute', alignSelf: 'flex-end' }] }
                                    source={ item.isSelected ? Images.ic_checkbox_on : Images.ic_checkbox_off } />
                            </Button>
                        </View>
                    </TouchableHighlight>
                )} />

                { this.renderPrice() }

                { this.renderDialog() }

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

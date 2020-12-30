/*
    Created by Colin (2019-10-01)
*/

import React from 'react';
import { Dimensions, View, SafeAreaView, Image, ScrollView, TouchableHighlight, BackHandler, TouchableOpacity  } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Form, Item, Text, Button, Card, CardItem, Body, Left, Right, Badge } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, fonts, dialog, getScreenHeight } from './../../assets/styles';
import { connect } from "react-redux";
import Images from "../../assets/Images";
import { _e } from "../../lang";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast} from './../Shared/global';
import { Actions } from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import { cancel_request, return_request, get_time_list } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';

var alertDialogVisible = false;
var confirmDialogVisible = false;

class SaveBoxStatisticTab extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            homeComp: props.homeComp,

            loaded: true,

            typeData: props.typeData,
            arrInProgressData: props.arrInProgressData,
            arrFreeSpaceData: props.arrFreeSpaceData,
            arrSavingData: props.arrSavingData,
            arrCompletedData: props.arrCompletedData,

            alertDialogVisible: false, alertDialogMessage: "",
            confirmType: 0, confirmDialogVisible: false, confirmDialogTitle: "", confirmDialogMessage: "",
            selectedRequestId: null , 
            view_height: 0,
            selectedDay: {
                [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`]: {
                  selected: true,
                  selectedColor: '#2E66E7',
                },
              },
            currentDay: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
            requestTime: null,
            timeList: [false,false,false,false]
        }
    }

    componentDidMount() {
        //this.setState({view_height: getScreenHeight()});

        //alert(getScreenHeight());

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (alertDialogVisible) {
            alertDialogVisible = false;
            return true;
        }
        if (confirmDialogVisible) {
            confirmDialogVisible = false;
            return true;
        }

        return false;
    }

    componentWillReceiveProps(props) {
        this.setState({
            typeData: props.typeData,
            arrInProgressData: props.arrInProgressData,
            arrFreeSpaceData: props.arrFreeSpaceData,
            arrSavingData: props.arrSavingData,
            arrCompletedData: props.arrCompletedData
        });
    }

    onInProgressItemAction(item) {
        if (item.detail_type == 1) {        // 신청취소
            this.setState({
                confirmType: item.detail_type,
                selectedRequestId: item.request_id,

                confirmDialogVisible: true,
                confirmDialogTitle: "신청취소",
                confirmDialogMessage: _e.cancelRequestConfirm
            });
            confirmDialogVisible = true;
        } else if (item.detail_type == 2) { // 회송요청
            this.setState({
                confirmType: item.detail_type,
                selectedRequestId: item.request_id,

                confirmDialogVisible: true,
                confirmDialogTitle: "회송요청",
                confirmDialogMessage: _e.requestReturnConfirm
            });
            this.getTimeList(this.state.currentDay)
            confirmDialogVisible = true;
        }
    }

    onBoxItemPressed(boxId, type, extend_pay) {
        Actions.push("save_info", { params: { homeComp: this.state.homeComp, boxId: boxId, type: type, extend_pay: extend_pay } });
    }

    onConfirmDialogButtonPressed() {
        this.setState({ confirmDialogVisible: false });
        confirmDialogVisible = false;

        if (this.state.confirmType == 1) {          // 신청취소
            this.setState({loaded: false});
            cancel_request(store.getState().user.apiToken, this.state.selectedRequestId).then((response) => {
                this.setState({loaded: true});

                if (response.is_logout && this.state.homeComp) {
                    this.state.homeComp.logout(false);
                    return;
                }

                if (response.status == 'fail') {
                    if (response.data != null && response.data.refund_information_required) {
                        Actions.push("refund_account", { params: this.state.homeComp });
                    } else {
                        showToast(response.errMsg);
                    }
                    return;
                }

                this.setState({
                    alertDialogVisible: true,
                    alertDialogMessage: "신청취소가 성공하였습니다."
                });
                alertDialogVisible = true;
            }).catch(err => {
                // alert(err)
                this.setState({loaded: true});
                showToast();
            });
        } else if (this.state.confirmType == 2) {   // 회송요청
            performNetwork(this, this.state.homeComp, return_request(store.getState().user.apiToken, this.state.selectedRequestId, this.state.currentDay,this.state.requestTime)).then((response) => {
                if (response == null) { return; }

                this.setState({
                    alertDialogVisible: true,
                    alertDialogMessage: "3일내 기사님이 방문할 예정입니다."
                });
                alertDialogVisible = true;
            });
        }
    }
    onAlertDialogButtonPressed() {
        this.setState({ alertDialogVisible: false });
        alertDialogVisible = false;

        this.props.parent.fetchSaveBoxInfo();
    }

    renderSavingItems() {
        if (this.state.arrSavingData == null || this.state.arrSavingData.length == 0) {
            return null;
        }

        return (
            <View>
                { this.state.arrSavingData.map( (item, index) => (
                    <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='#eee' onPress={ () => { this.onBoxItemPressed(item.box_list[0].box_id, 'saving', item.box_list[0].rest_days <= 7 ? 'extend_pay' : '') } }>
                        <Card style={ card.itemCard } >
                            <View style={ [card.body, { margin: 0 }] }>
                                <View style={{ flexDirection: 'row', backgroundColor: '#52d6d7', borderBottomWidth: 0, marginLeft: 0, padding: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                    <Left>
                                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>{item.box_list[0].rest_days <= 7 ? '보관종료 예정' : '보관중인 물건'}{/*  - { item.box_list[0].box_id } */}</Text>
                                    </Left>
                                    <Right>
                                        {
                                            item.box_list[0].rest_days <= 7 ?
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>D{item.box_list[0].rest_days >= 0 ? '-' : '+'}{Math.abs(item.box_list[0].rest_days)}일</Text>
                                            :
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>총 {item.total_goods_count}개</Text>
                                        }
                                        
                                    </Right>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: 0, padding: 10 }}>
                                    <Left>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorDeepDarkPrimary] }>{ item.box_list[0].box_name }</Text>
                                    </Left>
                                    <Body style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>1box |</Text>
                                    </Body>
                                    <Right style={{ flex: 1, width: 20 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                    </Right>
                                </View>
                            </View>
                    </Card>
                    </TouchableHighlight>
                )) }
            </View>
        );
    }
    renderCompletedItems() {
        if (this.state.arrCompletedData == null || this.state.arrCompletedData.length == 0) {
            return null;
        }

        return (
            <View>
                { this.state.arrCompletedData.map( (item, index) => (
                    <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='#eee' onPress={ () => { this.onBoxItemPressed(item.box_list[0].box_id, 'completed', '') } }>
                        <Card key={ index } style={ card.itemCard } >
                            <CardItem cardBody style={ [card.body, { backgroundColor: '#ececec'}] }>
                                <Body>
                                    
                                    <View style={{ flexDirection: 'row', marginLeft: 0, paddingHorizontal: 10}}>
                                        <View style={{borderBottomWidth: 1, flex: 1, flexDirection:'row', paddingVertical: 10, borderBottomColor: '#808080'}}>
                                            <Left>
                                                <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>보관종료{/*  - { item.box_list[0].box_id } */}</Text>
                                            </Left>
                                            {
                                                item.box_list[0].rest_days > 0 ?
                                                <Right>
                                                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>남은 기간: { item.box_list[0].rest_days }일</Text>
                                                </Right>
                                                :
                                                null
                                            }
                                        </View>
                                    </View>

                                    <View style={{ borderBottomWidth: 0, padding: 10, flexDirection: 'row' }}>
                                        <Left>
                                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorMiddleDarkGray] }>{ item.box_list[0].box_name }</Text>
                                        </Left>
                                        <Body style={{ flex: 3, alignItems: 'flex-end', paddingEnd: 5 }}>
                                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray] }>1box |</Text>
                                        </Body>
                                        <Right style={{ flex: 1, width: 20 }}>
                                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                        </Right>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>
                    </TouchableHighlight>
                )) }
            </View>
        );
    }
    renderFreeSpace() {
        if (this.state.arrFreeSpaceData == null || this.state.arrFreeSpaceData.length == 0) {
            return null;
        }

        return (
            <View>
                { this.state.arrFreeSpaceData.map( (item, index) => (
                    <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='#eee' onPress={ () => { this.onBoxItemPressed(item.box_list[0].box_id, '', '') } }>
                        <Card style={ card.itemCard } >
                            <View style={ [card.body, { margin: 0 }] }>
                                <View style={{ flexDirection: 'row', backgroundColor: '#52d6d7', borderBottomWidth: 0, marginLeft: 0, padding: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                    <Left>
                                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>이용가능 공간{/*  - { item.box_list[0].box_id } */}</Text>
                                    </Left>
                                    <Right>
                                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>{ item.rest_days }일</Text>
                                    </Right>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: 0, padding: 10 }}>
                                    <Left>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorDeepDarkPrimary] }>{ item.box_list[0].box_name }</Text>
                                    </Left>
                                    <Body style={{ flex: 3, alignItems: 'flex-end', paddingEnd: 5 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>1box |</Text>
                                    </Body>
                                    <Right style={{ flex: 1, width: 20 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                    </Right>
                                </View>
                            </View>
                    </Card>
                    </TouchableHighlight>
                )) }
            </View>
        );
    }
    renderInProgressItems() {
        if (this.state.arrInProgressData == null || this.state.arrInProgressData.length == 0) {
            return null;
        }

        return (
            <View>
                { this.state.arrInProgressData.map( (item, index) => (
                    <View key={ index }>
                        <Card style={ card.itemCard } >
                            <CardItem cardBody style={ card.body }>
                                <Body>
                                    <Item style={{ backgroundColor: '#52d6d7', borderBottomWidth: 0, marginLeft: 0, padding: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                        <Left style={{ flex: 1 }}>
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>진행중</Text>
                                        </Left>
                                        <Body style={{ flex: 3}}>
                                            <Badge style={{ height: 26, borderRadius: 4, backgroundColor: 'white', justifyContent: 'center' }}>
                                                <Text style={ [fonts.familyMedium, fonts.size11, fonts.colorDeepLightPrimary] }>{
                                                    item.detail_type == 1 ? "배송중" : (
                                                    item.detail_type == 2 ? "물품정리중" : (
                                                    item.detail_type == 3 ? "회송중" : (
                                                    item.detail_type == 4 ? "검수중" : "")))
                                                }</Text>
                                            </Badge>
                                        </Body>
                                        <Right style={{ flex: 3 }}>
                                            { item.detail_type != 1 && item.detail_type != 2 ? null :
                                                <Button style={{ height: 30, borderRadius: 15, backgroundColor: '#42adad', paddingVertical: 0 }}
                                                    onPress={ () => { this.onInProgressItemAction(item) } }>
                                                    <Text style={ [fonts.familyBold, fonts.size11, fonts.colorWhite] }>{
                                                        item.detail_type == 1 ? "신청취소" : (
                                                        item.detail_type == 2 ? "회송요청" : "")
                                                    }</Text>
                                                </Button>
                                            }
                                        </Right>
                                    </Item>

                                    { item.box_list.map( (box, index) => (
                                        <Item key={ index } style={{ borderBottomWidth: 0, paddingHorizontal: 10, paddingTop: 10 }}>
                                            <Left>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorDeepDarkPrimary] }>{ box.box_name }</Text>
                                            </Left>
                                            <Body style={{ flex: 3, alignItems: 'flex-end', paddingEnd: 5 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>{ box.amount }box |</Text>
                                            </Body>
                                            <Right style={{ flex: 1, width: 20 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { box.goods_count }개</Text>
                                            </Right>
                                        </Item>
                                    )) }
                                    <View style={ base.top10 } />
                                </Body>
                            </CardItem>
                        </Card>

                        { item.detail_type == 2 ? this.renderNotification() : null }
                    </View>
                )) }
            </View>
        );
    }
    renderNotification() {
        return (
            <Card style={ card.itemCard } >
                <CardItem cardBody style={ card.body }>
                    <Body>
                        <Item style={{ borderBottomWidth: 0, padding: 10, alignSelf: 'center' }}>
                            <Icon color='#42adad' name='ios-information-circle-outline' type='ionicon' />
                            <Text style={ [fonts.familyMedium, fonts.size11, fonts.colorMiddleLightPrimary] }>  회송요청은 박수 수령 후 최대 7일내에 신청해야 합니다.</Text>
                        </Item>
                    </Body>
                </CardItem>
            </Card>
        );
    }

    renderAlertDialog() {
        return (
            <Dialog
                visible={ this.state.alertDialogVisible }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.7 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ alertDialogVisible: false }); }}
                footer={
                    <DialogFooter bordered={ false } style={ dialog.footer }>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="확인"
                                textStyle={ dialog.footerButton }
                                onPress={() => this.onAlertDialogButtonPressed()} />
                        ]}
                    </DialogFooter>
                } >
                <DialogContent>
                    <Form style={ dialog.formWarning }>
                        <Image
                            style={ elements.size60 }
                            source={ Images.ic_dialog_success } />
                    </Form>

                    <View style={ base.top20 }></View>

                    <Form>
                        <Text style={ dialog.formWarningText }>{ this.state.alertDialogMessage }</Text>
                    </Form>
                </DialogContent>
            </Dialog>
        );
    }
    setTimeIndex(index){
        this.setState({requestTime: index});
    }
    getTimeList(request_date){
        this.setState({loaded : false})
        this.setState({timeList : [false,false,false,false]});
        get_time_list(store.getState().user.apiToken, request_date).then((response) => {
            this.setState({loaded : true})
            if (response == null) { return; }
            response['data']['requestCount'].map((val) => {
                if(val['cnt'] >= 3 && val['REQUEST_TIME'] != null){
                    var temp = this.state.timeList;
                    temp[val['REQUEST_TIME']] = true;
                    this.setState({timeList : temp});
                }
            })
        });
    }
    renderConfirmDialog() {
        return (
            <Dialog
                visible={ this.state.confirmDialogVisible }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.8 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ confirmDialogVisible: false }); }}
                footer={
                    <DialogFooter bordered={ false } style={ dialog.footer }>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="확인"
                                textStyle={ dialog.footerButton }
                                onPress={() => { this.onConfirmDialogButtonPressed() }} />
                        ]}
                    </DialogFooter>
                } >
                <DialogContent>
                    {
                        this.state.confirmType == 2 ? 
                        <View>
                            <CalendarList style={{ width: '100%',height: 300,marginTop: 40}}
                                current={this.state.currentDay}
                                minDate={moment().format()}
                                horizontal
                                pastScrollRange={0}
                                pagingEnabled
                                calendarWidth={294}
                                onDayPress={day => {
                                    this.setState({
                                    selectedDay: {
                                        [day.dateString]: {
                                        selected: true,
                                        selectedColor: '#2E66E7',
                                        },
                                    },
                                    currentDay: day.dateString,
                                    });
                                    this.getTimeList(day.dateString);
                                }}
                                monthFormat="yyyy MMMM"
                                hideArrows
                                markingType="simple"
                                theme={{
                                    selectedDayBackgroundColor: '#2E66E7',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#2E66E7',
                                    backgroundColor: '#eaeef7',
                                    calendarBackground: '#eaeef7',
                                    textDisabledColor: '#d9dbe0',
                                    textDayFontSize: 13,
                                    textMonthFontSize: 13,
                                    textDayHeaderFontSize: 13
                                }}
                                markedDates={this.state.selectedDay}
                            />

                            <View style={{display: 'flex', flexDirection: 'row',width: '100%', paddingTop: 10, paddingBottom: 5}}>
                                <View style={{width: '25%'}}>
                                    {
                                        this.state.timeList[0] == false ?
                                        <TouchableOpacity  onPress={() => {this.setTimeIndex(0)}}>
                                            <Text style={this.state.requestTime == 0 ? [form.pickerTime , {backgroundColor: '#52d6d7', marginRight:2}]: [form.pickerTime,{marginRight:2}]}>10 ~ 12</Text>
                                        </TouchableOpacity >
                                        :
                                        <Text style={[form.pickerTime , {backgroundColor: '#6d6d6d', marginRight:2}]}>10 ~ 12</Text>
                                    }

                                </View>

                                <View style={{width: '25%'}}>
                                    {
                                        this.state.timeList[1] == false ?
                                        <TouchableOpacity onPress={() => this.setTimeIndex(1)}>
                                            <Text style={this.state.requestTime == 1 ? [form.pickerTime , {backgroundColor: '#52d6d7', marginRight: 2, marginLeft: 2}]: [form.pickerTime, {marginRight: 2, marginLeft: 2}]}>12 ~ 14</Text>
                                        </TouchableOpacity>
                                        :
                                        <Text style={[form.pickerTime , {backgroundColor: '#6d6d6d', marginRight:2, marginLeft: 2}]}>12 ~ 14</Text>
                                    }

                                </View>

                                <View style={{width: '25%'}}>
                                    {
                                        this.state.timeList[2] == false ?
                                        <TouchableOpacity onPress={() => this.setTimeIndex(2)}>
                                            <Text style={this.state.requestTime == 2 ? [form.pickerTime , {backgroundColor: '#52d6d7', marginRight: 2, marginLeft: 2}]: [form.pickerTime, {marginRight: 2, marginLeft: 2}]}>14 ~ 16</Text>
                                        </TouchableOpacity>
                                        :
                                        <Text style={[form.pickerTime , {backgroundColor: '#6d6d6d', marginRight:2, marginLeft: 2}]}>14 ~ 16</Text>
                                    }
                                    
                                </View>

                                <View style={{width: '25%'}}>
                                    {
                                        this.state.timeList[3] == false ?
                                        <TouchableOpacity onPress={() => this.setTimeIndex(3)}>
                                            <Text style={this.state.requestTime == 3 ? [form.pickerTime , {backgroundColor: '#52d6d7', marginLeft: 2}]: [form.pickerTime, {marginLeft: 2}]}>16 ~ 18</Text>
                                        </TouchableOpacity>
                                        :
                                        <Text style={[form.pickerTime , {backgroundColor: '#6d6d6d', marginLeft: 2}]}>16 ~ 18</Text>
                                    }
                                    
                                </View>
                            </View>


                        </View>
                        :
                        <View>
                            <Form style={ dialog.formWarning }>
                                <Image
                                    style={ elements.size60 }
                                    source={ Images.ic_dialog_success } />
                            </Form>
                            <View style={base.top10}></View>
                            <Form>
                                <Text style={dialog.formWarningText}>{ this.state.confirmDialogMessage }</Text>
                            </Form>
                        </View>
                    }
                    

                    <Button transparent
                        style={ dialog.closeButton }
                        onPress={ () => {
                            this.setState({ confirmDialogVisible: false });
                            confirmDialogVisible = false;
                        }}>
                        <Image style={ elements.size16 } source={ Images.ic_dialog_close } />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    render() {
        let savingItems = this.renderSavingItems();
        let completedItems = this.renderCompletedItems();
        let freeSpaceItems = this.renderFreeSpace();
        let inProgressItems = this.renderInProgressItems();


        var arrItems = null;
        if (this.state.typeData.id == 0) {
            if (savingItems == null && completedItems == null && freeSpaceItems == null && inProgressItems == null) {
                arrItems = (
                    <View style={[{display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                            내역이 없습니다.
                        </Text>
                    </View>
                );
            } else {
                arrItems = (
                    <View>
                        { savingItems }
                        { completedItems }
                        { freeSpaceItems }
                        { inProgressItems }
                    </View>
                );
            }
        } else if (this.state.typeData.id == 1) {
            arrItems = inProgressItems != null ? inProgressItems :
                (<View style={[{display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                        내역이 없습니다.
                    </Text>
                </View>);
        } else if (this.state.typeData.id == 2) {
            arrItems = savingItems != null ? savingItems :
                (<View style={[{display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                        내역이 없습니다.
                    </Text>
                </View>);
        } else if (this.state.typeData.id == 3) {
            arrItems = completedItems != null ? completedItems :
                (<View style={[{display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                        내역이 없습니다.
                    </Text>
                </View>);
        }

        return (
            <Container>
                <ScrollView style={{ margin: 10 }}>
                    { arrItems }
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                { this.renderAlertDialog() }
                { this.renderConfirmDialog() }
            </Container>
        )
    }

}


const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(SaveBoxStatisticTab);

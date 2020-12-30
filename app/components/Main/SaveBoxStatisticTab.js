/*
    Created by Colin (2019-10-01)
*/

import React from 'react';
import { Dimensions, View, SafeAreaView, Image, ScrollView, TouchableHighlight, BackHandler } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Form, Item, Text, Button, Card, CardItem, Body, Left, Right, Badge } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, fonts, dialog } from './../../assets/styles';
import { connect } from "react-redux";
import Images from "../../assets/Images";
import { _e } from "../../lang";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast} from './../Shared/global';
import { Actions } from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import { cancel_request, return_request } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

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
            selectedRequestId: null
        }
    }

    componentDidMount() {
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
            confirmDialogVisible = true;
        }
    }

    onBoxItemPressed(boxId) {
        Actions.push("save_info", { params: { homeComp: this.state.homeComp, boxId: boxId } });
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
            performNetwork(this, this.state.homeComp, return_request(store.getState().user.apiToken, this.state.selectedRequestId)).then((response) => {
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
                    <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='#eee' onPress={ () => { this.onBoxItemPressed(item.box_list[0].box_id) } }>
                        <Card style={ card.itemCard } >
                            <View style={ [card.body, { margin: 0 }] }>
                                <View style={{ flexDirection: 'row', backgroundColor: '#52d6d7', borderBottomWidth: 0, marginLeft: 0, padding: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                    <Left>
                                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>보관중인 물건{/*  - { item.box_list[0].box_id } */}</Text>
                                    </Left>
                                    <Right>
                                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorWhite] }>총 { item.total_goods_count }개</Text>
                                    </Right>
                                </View>

                                <View style={{ flexDirection: 'row', backgroundColor: 0, padding: 10 }}>
                                    <Left>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorDeepDarkPrimary] }>{ item.box_list[0].box_name }</Text>
                                    </Left>
                                    <Body style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>1box |</Text>
                                    </Body>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                    </View>
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
                    <Card key={ index } style={ card.itemCard } >
                        <CardItem cardBody style={ [card.body, { backgroundColor: '#ececec'}] }>
                            <Body>
                                <Item style={{ borderBottomWidth: 0, paddingHorizontal: 10 }}>
                                    <Item style={{ borderColor: '#808080', paddingVertical: 10 }}>
                                        <Left>
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>종료{/*  - { item.box_list[0].box_id } */}</Text>
                                        </Left>
                                        <Right>
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>총 { item.total_goods_count }개</Text>
                                        </Right>
                                    </Item>
                                </Item>

                                <Item style={{ borderBottomWidth: 0, padding: 10 }}>
                                    <Left>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>{ item.box_list[0].box_name }</Text>
                                    </Left>
                                    <Body style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>1box |</Text>
                                    </Body>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                    </View>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>
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
                    <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='#eee' onPress={ () => { this.onBoxItemPressed(item.box_list[0].box_id) } }>
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
                                    <Body style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>1box |</Text>
                                    </Body>
                                    <View>
                                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { item.box_list[0].goods_count }개</Text>
                                    </View>
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
                                        <Body style={{ flex: 3 }}>
                                            <Badge style={{ height: 26, borderRadius: 4, backgroundColor: 'white' }}>
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
                                            <Body style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>{ box.amount }box |</Text>
                                            </Body>
                                            <View>
                                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorMiddleDarkGray] }>물품 { box.goods_count }개</Text>
                                            </View>
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
                    <Form style={ dialog.formWarning }>
                        <Image
                            style={ elements.size60 }
                            source={ Images.ic_dialog_success } />
                    </Form>

                    <View style={base.top10}></View>

                    <Form>
                        <Text style={dialog.formWarningText}>{ this.state.confirmDialogMessage }</Text>
                    </Form>

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
                return (
                    <Container>
                        <View style={[{flex: 1, justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                                내역이 없습니다.
                            </Text>
                        </View>

                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                        { this.renderAlertDialog() }
                        { this.renderConfirmDialog() }
                    </Container>
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
            if (inProgressItems != null) {
                arrItems = inProgressItems;
            } else {
                return (
                    <Container>
                        <View style={[{flex: 1, justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                                내역이 없습니다.
                            </Text>
                        </View>

                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                        { this.renderAlertDialog() }
                        { this.renderConfirmDialog() }
                    </Container>
                );
            }
        } else if (this.state.typeData.id == 2) {
            if (savingItems != null) {
                arrItems = savingItems;
            } else {
                return (
                    <Container>
                        <View style={[{flex: 1, justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                                내역이 없습니다.
                            </Text>
                        </View>

                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                        { this.renderAlertDialog() }
                        { this.renderConfirmDialog() }
                    </Container>
                );
            }
        } else if (this.state.typeData.id == 3) {
            if (completedItems != null) {
                arrItems = completedItems;
            } else {
                return (
                    <Container>
                        <View style={[{flex: 1, justifyContent: 'center' , alignItems: 'center'} , base.tabHeight]}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                                내역이 없습니다.
                            </Text>
                        </View>

                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />

                        { this.renderAlertDialog() }
                        { this.renderConfirmDialog() }
                    </Container>
                );
            }
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

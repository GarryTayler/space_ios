/*
    Created by Colin (2019-09-30)
*/

import React from 'react';
import {Image, View, BackHandler } from 'react-native';
import {Button, Container, Form, Item, ScrollableTab, Tab, Tabs, Text} from 'native-base';
import UserHeader from './../Shared/UserHeader';
import {base, dialog, elements, fonts, form, tabs} from './../../assets/styles';
import {connect} from 'react-redux';
import Images from '../../assets/Images';
import Dialog, {DialogButton, DialogContent, DialogFooter, ScaleAnimation} from 'react-native-popup-dialog';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import SaveBoxTab from './SaveBoxTab';
import {Actions} from 'react-native-router-flux';
import store from './../../store/configuteStore';
import {get_available_box_list, get_goods_list} from './../Root/api';
import { PRICE_SERVICE_USE } from '../../constants';
import {performNetwork, showToast, number_format} from './../Shared/global';

let pageTitle = '보관함';

var returnWarningDialogVisible = false;

class SaveBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: true,

            curTabIndex: 0,
            arrSaveBoxData: [],
            arrNumOfSelectedItems: [],
            selectedType: 0,

            returnWarningDialogVisible: false,
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.fetchBoxData();
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (returnWarningDialogVisible) {
            returnWarningDialogVisible = false;
            return true;
        }

        return false;
    }

    fetchBoxData() {
        this.setState({loaded: false});
        get_available_box_list(store.getState().user.apiToken)
        .then((response) => {
            this.setState({loaded: true});

            if (response.is_logout) {
                this.state.params.homeComp.logout(false);
                return;
            }

            if(response.status == 'fail') {
                showToast(response.errMsg);
                return;
            }

            let arrBoxData = response.data.box_list;

            var arrNumOfSelectedItems = [];
            arrBoxData.forEach(() => {
                arrNumOfSelectedItems.push(0);
            });

            var self = this;
            this.setState({loaded: false});
            this.fetchItemData(arrBoxData, 0, Array(0), function(isSuccess, errMsg, arrUpdatedBoxData) {
                self.setState({loaded: true});
                if (!isSuccess) {
                    showToast(errMsg != null ? errMsg : '');
                    return;
                }

                var index = 0;
                if (self.state.params.boxId != null) {
                    for (var i = 0; i < arrUpdatedBoxData.length; i++) {
                        if (arrUpdatedBoxData[i].box_id == self.state.params.boxId) {
                            index = i;
                        }
                    }
                }

                self.setState({
                    arrSaveBoxData: arrUpdatedBoxData,
                    arrNumOfSelectedItems: arrNumOfSelectedItems
                });

                setTimeout(function(index) {
                    self.setState({ curTabIndex: index });
                }, 10, index);
            });
        })
        .catch((err) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    fetchItemData(arrBoxData, index, arrUpdatedBoxData, callback) {
        if (index == arrBoxData.length) {
            callback(true, null, arrUpdatedBoxData);
            return;
        }

        var arrTemp = arrUpdatedBoxData;
        get_goods_list(store.getState().user.apiToken, arrBoxData[index].box_id)
        .then((response) => {
            if(response.status == 'fail') {
                callback(false, response.errMsg, null);
                return;
            }

            if (response.is_logout) {
                Actions.reset("home");
                return;
            }

            var goods_list = response.data.goods_list;
            goods_list.forEach(item => {
                item.isSelected = false;
            });
            arrTemp.push({
                box_no: arrBoxData[index].box_no,
                box_id: arrBoxData[index].box_id,
                goods_list: goods_list
            });

            this.fetchItemData(arrBoxData, index + 1, arrTemp, callback);
        })
        .catch((err) => {
            callback(false, null, null);
            return;
        });
    }

    onItemSelected(numOfSelectedItems) {
        var arrNumOfSelectedItems = this.state.arrNumOfSelectedItems;
        arrNumOfSelectedItems[this.state.curTabIndex] = numOfSelectedItems;
        this.setState({arrNumOfSelectedItems: arrNumOfSelectedItems});
    }

    onItemTypeSelected(type) {
        this.setState({selectedType: type})
    }

    onBtnReturnItemPressed() {
        if (this.state.arrSaveBoxData == null || this.state.arrSaveBoxData.length == 0) {
            return;
        }

        if (this.state.arrNumOfSelectedItems[this.state.curTabIndex] == 0) {
            showToast("한개이상의 물품을 선택하셔야 합니다.");
        } else if (this.state.arrNumOfSelectedItems[this.state.curTabIndex] == this.state.arrSaveBoxData[this.state.curTabIndex].goods_list.length) {
            this.setState({returnWarningDialogVisible: true});
            returnWarningDialogVisible = true;
        } else {
            this.gotoReturnGoods();
        }
    }

    gotoReturnGoods() {
        let box_id = this.state.arrSaveBoxData[this.state.curTabIndex].box_id;
        var good_ids = [];
        var goods_list = [];
        this.state.arrSaveBoxData[this.state.curTabIndex].goods_list.forEach(good => {
            if (good.isSelected) {
                good_ids.push(good.goods_id);
                goods_list.push({ goods_name: good.goods_name, goods_id: good.goods_id });
            }
        });

        Actions.push('returngood', { params: {
            homeComp: this.state.params.homeComp,
            box_id: box_id,
            good_ids: good_ids,
            goods_list: goods_list,
            selectedType: this.state.selectedType
        }});
    }
    gotoCompleteSave() {
        this.setState({returnWarningDialogVisible: false});
        returnWarningDialogVisible = false;
        
        Actions.push("complete_save", { params: { homeComp: this.state.params.homeComp, boxId: this.state.arrSaveBoxData[this.state.curTabIndex].box_id } });
    }

    renderTabs() {
        if (this.state.arrSaveBoxData == null || this.state.arrSaveBoxData.length == 0) {
            return (
                <Form style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray, { alignSelf: 'center', justifyContent: 'center' }] }>
                        보관중인 물품이 없습니다.
                    </Text>
                </Form>
            );
        }

        let arrTab = this.state.arrSaveBoxData.map((item, index) => (
            <Tab key={index}
                 tabStyle={tabs.tab}
                 textStyle={tabs.text}
                 activeTabStyle={tabs.tab}
                 activeTextStyle={tabs.activeText}
                 heading={item.box_id}>
                <SaveBoxTab onRef={ref => (this[`child${index}`] = ref)} parent={this} saveBoxData={item}/>
            </Tab>
        ));

        return (
            <Tabs
                // initialPage={ this.state.curTabIndex }
                page={ this.state.curTabIndex }
                renderTabBar={() => <ScrollableTab style={{ backgroundColor: 'white' }}/>}
                tabBarUnderlineStyle={tabs.tabBarUnderline}
                onChangeTab={(obj) => {
                    this.setState({curTabIndex: obj.i});
                }}>
                {arrTab}
            </Tabs>
        );
    }

    renderReturnWarningDialog() {
        return (
            <Dialog
                visible={this.state.returnWarningDialogVisible}
                dialogAnimation={new ScaleAnimation(0)}
                width={0.8}
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ returnWarningDialogVisible: false }); }}
                footer={
                    <DialogFooter bordered={false} style={dialog.footer}>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="보관종료"
                                textStyle={dialog.footerButton}
                                onPress={() => this.gotoCompleteSave()}/>
                        ]}
                    </DialogFooter>
                }>
                <DialogContent>
                    <Form style={dialog.formWarning}>
                        <Image
                            style={elements.size60}
                            source={Images.ic_dialog_warning}/>
                    </Form>

                    <View style={base.top20}></View>

                    <Form>
                        <Text style={dialog.formWarningText}>
                            중도에 찾으시는 경우 남은 보관기간은 재이용이 가능하며 물류처리 등에 따른 서비스 이용비용({ number_format(PRICE_SERVICE_USE) }원)이 추가 결제됩니다. 남은 기간에 대한 환불은 불가합니다.
                        </Text>
                    </Form>

                    <Button transparent
                        style={ dialog.closeButton }
                        onPress={ () => {
                            this.setState({ returnWarningDialogVisible: false });
                            returnWarningDialogVisible = false;
                        }}>
                        <Image style={ elements.size16 } source={ Images.ic_dialog_close } />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle}/>

                {this.renderTabs()}

                {this.state.arrNumOfSelectedItems[this.state.curTabIndex] == null || this.state.arrNumOfSelectedItems[this.state.curTabIndex] == 0 ?
                    <Form style={form.itemContainer}>
                        <Button full style={form.submitButton1} onPress={() => this.onBtnReturnItemPressed()}>
                            <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>개별 물건 찾기</Text>
                        </Button>
                    </Form>
                    :
                    <Item style={[form.itemContainer, {borderBottomWidth: 0, alignSelf: 'center'}]}>
                        <Button full style={[form.submitButton1, {flex: 1}]}
                                onPress={() => this[`child${this.state.curTabIndex}`].unselectItems()}>
                            <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>선택취소</Text>
                        </Button>
                        <View style={base.horizontal10}></View>
                        {
                            this.state.selectedType == 0 ?
                            <Button full style={[form.submitButton1, {flex: 1}]} onPress={() => this.onBtnReturnItemPressed()}>
                                <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>{this.state.arrNumOfSelectedItems[this.state.curTabIndex]}개 물건 찾기</Text>
                            </Button>
                            :
                            <Button full style={[form.submitButton1, {flex: 1}]} onPress={() => this.onBtnReturnItemPressed()}>
                                <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>다시보관하기</Text>
                            </Button>
                        }
                        
                    </Item>}

                {this.renderReturnWarningDialog()}

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={''}
                    overlayColor={'rgba(0, 0, 0, 0.5)'}/>
            </Container>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return {};
};
export default connect(null, mapDispatchToProps)(SaveBox);

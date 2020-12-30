/*
    Created by Colin (2019-10-01)
*/

import React from 'react';
import { Dimensions, View } from 'react-native';
import { Container, Tab, Tabs, ScrollableTab, Form, Item, Text, Button, Card, CardItem, Body, Left, Right } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, fonts } from './../../assets/styles';
import { connect } from "react-redux";
import { _e } from "../../lang";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast} from './../Shared/global';
import {Actions} from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { get_boxstorage_info } from './../Root/api';

import SaveBoxStatisticTab from './SaveBoxStatisticTab';

let pageTitle = '보관함';
let arrTypes = [{
    id: 0,
    title: "전체"
}, {
    id: 1,
    title: "진행중"
}, {
    id: 2,
    title: "보관중"
}, {
    id: 3,
    title: "종료"
}];

class SaveBoxStatistic extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            params: props.params,
            loaded: true,

            arrInProgressData: [],          // 진행중
            arrFreeSpaceData: [],           // 이용가능 공간
            arrSavingData: [],              // 보관중
            arrCompletedData: [],           // 종료
        }
    }

    componentDidMount() {
        this.fetchSaveBoxInfo();
    }
    fetchSaveBoxInfo() {
        performNetwork(this, this.state.params.homeComp, get_boxstorage_info(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            
            let arrData = response.data.data_list;

            var arrInProgressData = [];
            var arrFreeSpaceData = [];
            var arrSavingData = [];
            var arrCompletedData = [];
            arrData.forEach(data => {
                if (data.box_list == null || data.box_list.length == 0) {
                } else {
                    if (data.type == 1) {               // 진행중
                        arrInProgressData.push(data);
                    } else if (data.type == 2) {        // 이용가능 공간
                        arrFreeSpaceData.push(data);
                    } else if (data.type == 3) {        // 보관중
                        arrSavingData.push(data);
                    } else if (data.type == 4) {        // 종료
                        arrCompletedData.push(data);
                    }
                }
            });

            this.setState({
                arrInProgressData: arrInProgressData,
                arrFreeSpaceData: arrFreeSpaceData,
                arrSavingData: arrSavingData,
                arrCompletedData: arrCompletedData
            });
        });
    }

    onBtnCheckMyItemPressed() {
        Actions.push("save_box", { params: { homeComp: this.state.params.homeComp } });
        // Actions.reset("home", { push_action: "save_box" });
    }
    onBtnRequestSavingPressed() {
        Actions.reset("home", { params: { push_action: "addressrequest" }});
    }

    renderTabs() {
        let arrTab = arrTypes.map((item, index) => (
            <Tab key={ index }
                heading={ item.title }
                tabStyle={ tabs.tab }
                textStyle={ tabs.text }
                activeTabStyle={ tabs.tab }
                activeTextStyle={ tabs.activeText } >
                <SaveBoxStatisticTab
                    homeComp={ this.state.params.homeComp }
                    parent={ this }
                    typeData={ item }
                    arrInProgressData={ this.state.arrInProgressData }
                    arrFreeSpaceData={ this.state.arrFreeSpaceData }
                    arrSavingData={ this.state.arrSavingData }
                    arrCompletedData={ this.state.arrCompletedData }
                />
            </Tab>
        ));

        return (
            <Tabs tabBarUnderlineStyle={ tabs.tabBarUnderline }>
                { arrTab }
            </Tabs>
        );
    }
    render() {
        return (
            <Container>
                <UserHeader title={ pageTitle } />

                { this.renderTabs() }

                <Form style={ form.itemContainer }>
                    <Button full style={ form.submitButton1 } onPress={ () => this.onBtnCheckMyItemPressed() }>
                        <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>나의 물품 확인</Text>
                    </Button>
                    <View style={ base.top10 } />
                    <Button full style={ form.submitButton1 } onPress={ () => this.onBtnRequestSavingPressed() }>
                        <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>보관 신청 하기</Text>
                    </Button>
                </Form>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
            </Container>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(SaveBoxStatistic);

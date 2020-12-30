import React from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Container, Form, Item, Input , Text , Button , Textarea , Content, Left, Body, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import {performNetwork, showToast} from '../Shared/global';
import Spinner_bar from 'react-native-loading-spinner-overlay';

import { get_estimate_list } from './../Root/api';

let pageTitle = '견적문의';

export default class Budget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,
            loaded: false,
            arrData: []
        };
    }

    componentDidMount() {
        this.fetchBudgetData();
    }
    fetchBudgetData() {
        performNetwork(this, this.state.params.homeComp, get_estimate_list(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            var arrData = response.data;
            arrData.forEach(data => {
                let estimateDate = new Date(data.estimate_time * 1000);
                data.date = "" +
                    ("" + estimateDate.getFullYear()).substr(-2) + "." +
                    ("0" + (estimateDate.getMonth() + 1)).substr(-2) + "." +
                    ("0" + estimateDate.getDate()).substr(-2);

                data.contentVisible = false;
            });
            this.setState({ arrData: arrData });
        });
    }

    itemPreessed(ID) {
        Actions.push("viewbudget", { params: { ID: ID}})
    }

    gotoCreateBudget() {
        Actions.push("createbudget", { params: { homeComp: this.state.params.homeComp, parent: this } });
    }

    refreshData() {
        this.fetchBudgetData();
    }

    renderEstimate() {
        if (this.state.arrData == null || this.state.arrData.length == 0) {
            return null;
        }
        return this.state.arrData.map((item, index) => (
            <View key={ index }>
                <TouchableHighlight onPress={ () => { this.itemPreessed(item.ID) } }>
                    <View style={{borderBottomColor: '#ededed', backgroundColor: 'white', borderBottomWidth: 1, padding: 16, paddingRight: 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Body style={{ flex: 5, alignItems: 'flex-start' }}>
                                <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorLightBlack] }>{ item.name }</Text>
                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray] }>{ item.date }</Text>
                            </Body>
                            <Right style={{ flex: 1 }}>
                                <Icon name={ 'chevron-right'} type='evilicon' size={44} color='#a2a2a2' />
                            </Right>
                        </View>
                    </View>
                </TouchableHighlight>

                
            </View>
        ));
    }
    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={base.whiteBg}>
                    { (this.state.arrData == null || this.state.arrData.length == 0) ?
                    (
                        <View style={[{display: 'flex' , flexDirection: 'row' , justifyContent: 'center', alignItems: 'center'} , base.inquiryHeight]}>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray] }>
                                내역이 없습니다.
                            </Text>
                        </View>
                    )
                        :
                        this.renderEstimate()
                    }
                </Content>
                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.gotoCreateBudget()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>견적문의작성</Text>
                    </Button>
                </View>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        );
    }
}

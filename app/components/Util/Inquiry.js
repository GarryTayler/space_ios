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

import { get_inquiry_list } from './../Root/api';

let pageTitle = '1:1문의';

export default class Inquiry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: false,
            arrData: []
        };
    }

    componentDidMount() {
        this.fetchInquiryData();
    }
    fetchInquiryData() {
        performNetwork(this, this.state.params.homeComp, get_inquiry_list(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }
            
            var arrData = response.data;
            arrData.forEach(data => {
                let inquiryDate = new Date(data.inquiry_time * 1000);
                data.date = "" + 
                    ("" + inquiryDate.getFullYear()).substr(-2) + "." +
                    ("0" + (inquiryDate.getMonth() + 1)).substr(-2) + "." +
                    ("0" + inquiryDate.getDate()).substr(-2);

                data.contentVisible = false;
            });
            this.setState({ arrData: arrData });
        });
    }

    itemPreessed(index) {
        var arrData = this.state.arrData;
        arrData[index].contentVisible = !arrData[index].contentVisible;
        this.setState({ arrData: arrData });
    }

    gotoCreateInquiry() {
        Actions.push("createinquiry", { params: { homeComp: this.state.params.homeComp, parent: this } });
    }

    refreshData() {
        this.fetchInquiryData();
    }

    renderInquiry() {
        if (this.state.arrData == null || this.state.arrData.length == 0) {
            return null;
        }
        return this.state.arrData.map((item, index) => (
            <View key={ index }>
                <TouchableHighlight onPress={ () => { this.itemPreessed(index) } }>
                    <View style={[item.contentVisible ? {borderBottomColor: 'white'} : {borderBottomColor: '#ededed'}, { backgroundColor: 'white', borderBottomWidth: 1, padding: 16, paddingRight: 0 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <Left style={{ flex: 1.5, alignSelf: 'flex-start' }}>
                                <View style={{ backgroundColor: '#f5f5f5', paddingHorizontal: 3, paddingVertical: 2, borderColor: '#a2a2a2', borderWidth: 0.5, borderRadius: 4}}>
                                    <Text style={[ fonts.familyBold, fonts.size12, { color: '#666666' }] }>{ item.status }</Text>
                                </View>
                            </Left>
                            <Body style={{ flex: 5, alignItems: 'flex-start' }}>
                                <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorLightBlack] }>{ item.title }</Text>
                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray] }>{ item.date }</Text>
                            </Body>
                            <Right style={{ flex: 1 }}>
                                <Icon name={ item.contentVisible ? 'chevron-up' : 'chevron-down' } type='evilicon' size={44} color='#a2a2a2' />
                            </Right>
                        </View>
                    </View>
                </TouchableHighlight>

                { item.contentVisible ?
                <View>
                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorLightBlack, { lineHeight: 20, padding: 16 }] }>{ item.contents }</Text>

                    { (item.answer == null || item.answer == '') ? null :
                    <View style={{ paddingBottom: 20, paddingHorizontal: 16, backgroundColor: '#f6f6f6', borderTopWidth: 1, borderTopColor: '#ededed' }}>
                        <View style={ base.top10 } />

                        <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorLightBlack] }>여유공간 고객센터에서 답변드립니다.</Text>

                        <View style={ base.top10 } />

                        <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack, { lineHeight: 18 }] }>{ item.answer }</Text>
                    </View> }
                </View>
                : null }
            </View>
        ));
    }
    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={base.whiteBg}>
                    { this.renderInquiry() }
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.gotoCreateInquiry()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>문의작성</Text>
                    </Button>
                </View>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        );
    }
}

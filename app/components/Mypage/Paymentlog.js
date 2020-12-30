import React from 'react';
import { View, TouchableOpacity , Image, TouchableHighlight } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Content } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements , Image_Icon, fonts, card } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import Images from "../../assets/Images";
import { get_transaction_history } from './../Root/api.js';
import store from "./../../store/configuteStore";
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {performNetwork , number_format} from '../Shared/global';

let pageTitle = '결제내역';

export default class Paymentlog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: true,

            arrData: []
        };
    }

    componentDidMount() {
        this.fetchTransactionHistoryData();
    }

    fetchTransactionHistoryData() {
        performNetwork(this, this.state.params.homeComp, get_transaction_history(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }

            var arrData = response.data.payment_log;
            arrData.forEach(data => {
                let date = new Date(data.payment_time * 1000);
                data.date = "" +
                    ("" + date.getFullYear()) + "-" +
                    ("0" + (date.getMonth() + 1)).substr(-2) + "-" +
                    ("0" + date.getDate()).substr(-2) + " " +
                    ("0" + date.getHours()).substr(-2) + ":" +
                    ("0" + date.getMinutes()).substr(-2);
            });
            this.setState({ arrData });
        });
    }

    historyItemPressed(historyItem) {
        Actions.push("paymentdetail", { historyData: historyItem });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content contentContainerStyle={[base.whiteBg , form.styleForm]} >

                    { this.state.arrData == null || this.state.arrData.length == 0 ? null : 
                        this.state.arrData.map((item, index) => (
                        <View>
                            <TouchableHighlight activeOpacity={ 0.9 } underlayColor='#ddd' onPress={ () => { this.historyItemPressed(item) } }>
                                <View style={[elements.flex_columnAlign , card.itemCard , {borderRadius:5}]}>
                                    <View style={[elements.flex_rowAlign , {borderTopLeftRadius: 5 , borderTopRightRadius: 5 , backgroundColor: '#27cccd' , paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' , justifyContent: 'space-between'}]}>
                                        <Text style={[fonts.familyMedium, fonts.size14, fonts.colorWhite]}>결제일</Text>
                                        <Text style={[fonts.familyMedium, fonts.size14, fonts.colorWhite]}>{ item.date }</Text>
                                    </View>
                                    <View style={{borderBottomLeftRadius: 5 , borderBottomRightRadius: 5 , backgroundColor: '#fff' , paddingVertical: 8, paddingHorizontal: 16 , paddingTop: 12 , paddingBottom: 12 }}>
                                        <View style={[elements.flex_rowAlign, { alignItems: 'center' , justifyContent: 'space-between' }]}>
                                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorDeepDarkPrimary]}>결제금액</Text>
                                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray]}>{ number_format(item.cost) + '원' }</Text>
                                        </View>
                                        <Text style={[fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray, { flex: 1, paddingTop: 16, textAlign: 'right' }]}>{ item.payment_type }</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <View style={base.top10} />
                        </View>
                    )) }

                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>
            </Container>
        );
    }
}

import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, ImageBackground, TouchableHighlight } from 'react-native';
import { Container, Content , Item, Input , Text, Form , Button, Left, Right} from 'native-base';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast, number_format} from './../Shared/global';
import Images from "../../assets/Images";
import store from "./../../store/configuteStore";
import { get_coupon_list } from './../Root/api';

let pageTitle = '쿠폰';

export default class Coupon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: true,
            viewWidth: 0,
            arrData: []
        }
    }
    componentDidMount() {
        this.setState({ viewWidth: Math.round(Dimensions.get('window').width) });

        this.fetchCouponData();
    }

    fetchCouponData() {
        performNetwork(this, this.state.params.homeComp, get_coupon_list(store.getState().user.apiToken)).then((response) => {
            if (response == null) { return; }

            var arrShowingData = [];
            const arrData = response.data.coupon_list;
            arrData.forEach(data => {
                let validDate = new Date(data.use_date * 1000);
                data.validDate = data.use_date == null ? "-" : "" +
                    ("" + validDate.getFullYear()) + "." +
                    ("0" + (validDate.getMonth() + 1)).substr(-2) + "." +
                    ("0" + validDate.getDate()).substr(-2);
                
                if (data.issued) {
                    arrShowingData.push(data);
                }
            });

            this.setState({ arrData: arrShowingData });
        });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={ [base.whiteBg, { paddingVertical: 20 }] }>

                    { this.state.arrData == null || this.state.arrData.length == 0 ? 
                        <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkGray, { alignSelf: 'center', justifyContent: 'center' }] }>
                            보관중인 쿠폰이 없습니다.
                        </Text>
                    :
                        <View>
                            <View style={ base.top20 } />
                            { this.state.arrData.map((item, index) => (
                                <TouchableHighlight key={ index } activeOpacity={ 1 } underlayColor='white'>
                                    <View style={{ alignSelf: 'center', marginTop: -20 }}>
                                        <ImageBackground source={ !item.used ? Images.coupon_container_white : Images.coupon_container_gray } style={{ width: this.state.viewWidth - 16, height: 150 }} resizeMode='contain'>
                                            <View style={{ flexDirection: 'row', flex: 1, margin: 16, marginTop: -4 }}>
                                                <Left style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={ [fonts.familyBold, fonts.size50, !item.used ? fonts.colorDarkPrimary : { color: '#bfbfbf' }] }>{ item.use_months }</Text>
                                                    <Text style={ [fonts.familyBold, fonts.size15, !item.used ? fonts.colorDarkPrimary : { color: '#bfbfbf' }, { marginBottom: -30 }] }>개월</Text>
                                                </Left>
                                                <Right style={{ flex: 2.7, alignItems: 'flex-start', marginLeft: 16 }}>
                                                    <View style={ base.top10 } />
                                                    <Text style={ [fonts.familyRegular, fonts.size14, !item.used ? fonts.colorLightBlack : { color: '#bfbfbf' }] }>{ item.description }</Text>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={ [fonts.familyRegular, fonts.size12, !item.used ? fonts.colorLightBlack : { color: '#bfbfbf' }, { paddingRight: 8 }] }>사용일</Text>
                                                        <Text style={ [fonts.familyMedium, fonts.size12, !item.used ? fonts.colorLightBlack : { color: '#bfbfbf' }] }>{ item.used ? item.validDate : '-' }</Text>
                                                    </View>
                                                    <View style={ base.top10 } />
                                                    <Text style={ [fonts.familyBold, fonts.size16, !item.used ? fonts.colorDarkPrimary : { color: '#bfbfbf' }] }>{ number_format(item.discount) + '원' }</Text>
                                                </Right>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </TouchableHighlight>
                            ))}
                        </View>
                    }

                    <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </Content>
            </Container>
        );
    }
}

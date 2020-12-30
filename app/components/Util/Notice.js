import React from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Content, Left, Body, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { get_notice_list } from './../Root/api';
import {performNetwork, showToast} from '../Shared/global';
import DeviceInfo from 'react-native-device-info';

let pageTitle = '공지사항';

export default class Notice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: false,
            arrData: []
        };
    }

    componentDidMount() {
        let uniqueId = DeviceInfo.getUniqueId();
        performNetwork(this, this.state.params.homeComp, get_notice_list(uniqueId)).then((response) => {
            if (response == null) { return; }
            const arrData = response.data;
            arrData.forEach(data => {
                let inquiryDate = new Date(data.notice_time * 1000);
                data.date = "" +
                    ("" + inquiryDate.getFullYear()).substr(-2) + "." +
                    ("0" + (inquiryDate.getMonth() + 1)).substr(-2) + "." +
                    ("0" + inquiryDate.getDate()).substr(-2);

                data.contentVisible = false;
            });
            this.setState({ arrData  });
        });
    }

    itemPreessed(index) {
        var arrData = this.state.arrData;
        arrData[index].contentVisible = !arrData[index].contentVisible;
        this.setState({ arrData: arrData });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={base.whiteBg}>
                    { this.state.arrData == null || this.state.arrData.length == 0 ? null :
                        this.state.arrData.map((item, index) => (
                        <View key={ index }>
                            <TouchableHighlight onPress={ () => { this.itemPreessed(index) } }>
                                <View style={{ backgroundColor: 'white', borderBottomColor: '#ededed', borderBottomWidth: 1, padding: 16, paddingRight: 0 }}>
                                        <View style={{ flexDirection: 'row' }}>
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

                            { item.contentVisible?
                            <View style={{ paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#f6f6f6' }}>
                                <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightBlack, { lineHeight: 20 }] }>{ item.contents }</Text>
                            </View>
                            :
                            null }
                        </View>
                    )) }
                </Content>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        );
    }
}

import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Content, Body, Right , Tabs , Tab , ScrollableTab } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements , tabsStyles, fonts, tabs } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Faq_container from './Faq_container';
import {performNetwork, showToast} from '../Shared/global';

import { get_faq_list } from './../Root/api';

let pageTitle = '자주묻는 질문';

export default class Faq extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: false,
            arrData: []
        };
    }

    componentDidMount() {
        performNetwork(this, this.state.params.homeComp, get_faq_list()).then((response) => {
            if (response == null) { return; }
            
            let arrFaqData = response.data.faq_list;
            this.setState({ arrData: arrFaqData });
        });
    }

    itemPreessed(index) {
        var arrData = this.state.arrData;
        arrData[index].contentVisible = !arrData[index].contentVisible;
        if(arrData[index].contentVisible) {
            for( let i = 0; i < arrData.length; i ++ ) {
                if(i == index)
                    continue;
                arrData[i].contentVisible = false;
            }
        }
        this.setState({ arrData: arrData });
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content>
                { this.state.arrData == null || this.state.arrData.length == 0 ? null :
                    this.state.arrData.map((item, index) => (
                        <View key={ index }>

                            <TouchableHighlight onPress={ () => { this.itemPreessed(index) } }>
                                <View style={{ backgroundColor: 'white', borderBottomColor: '#ededed', borderBottomWidth: 1, padding: 16, paddingRight: 0 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Body style={{ flex: 5, alignItems: 'flex-start' }}>
                                            <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorLightBlack] }>{ item.title }</Text>
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
                ))}
                </Content>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        );
    }
}

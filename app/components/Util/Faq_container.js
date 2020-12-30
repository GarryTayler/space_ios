import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Content, Body, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';

export default class Faq_container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            arrData: props.arrFaqList
        };
    }

    itemPreessed(index) {
        var arrData = this.state.arrData;
        arrData[index].contentVisible = !arrData[index].contentVisible;
        this.setState({ arrData: arrData });
    }

    renderNotice() {
        if (this.state.arrData == null || this.state.arrData.length == 0) {
            return null;
        }
        return this.state.arrData.map((item, index) => (
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
        ));
    }
    render() {
        return (
            <Container>
                <Content style={base.whiteBg}>
                    { this.renderNotice() }
                </Content>
            </Container>
        );
    }
}
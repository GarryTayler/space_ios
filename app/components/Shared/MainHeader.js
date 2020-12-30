import React from 'react';
import { TouchableOpacity , Image, Card, CardItem} from 'react-native';
import {Header , View , Text , Left , Right , Body} from 'native-base';
import { Icon } from 'react-native-elements';
import { shared , base , Image_Icon } from './../../assets/styles';

import { Actions } from 'react-native-router-flux';
import Images from './../../assets/Images';

export default class MainHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
           <Header style={[shared.home_header, { paddingBottom: 8, height: 70 }]} androidStatusBarColor='#999999' iosBarStyle="light-content" >
                <Left style={{ paddingLeft: 16 }}>
                    <Image source={Images.home_logo} style={Image_Icon.home_logo} /> 
                </Left>
                <Right>
                    <TouchableOpacity onPress={() => Actions.drawerOpen()} >
                        <Icon name='navicon' type='evilicon' size={32} color='black' />
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
}
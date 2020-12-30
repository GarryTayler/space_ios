import React from 'react';
import { TouchableOpacity } from 'react-native';
import {Header , View , Text , Left , Right , Body} from 'native-base';
import { Icon } from 'react-native-elements';
import { shared , base } from './../../assets/styles';
import { Actions } from 'react-native-router-flux';
export default class UserHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    backButtonPressed() {
        if (this.props.comp != null && this.props.comp.state.isAddressSearch) {
            this.props.comp.setState({ isAddressSearch: false });
        } else {
            Actions.pop();
        }
    }

    render() {
        return (
           <Header style={[shared.header , {display:'flex' , flexDirection:'row' , alignItems:'flex-end' , justifyContent: 'center', paddingBottom: 12, height: 70}]} androidStatusBarColor='#27cccd' iosBarStyle="light-content" >
                <View style={{ position: 'absolute' , left: 0, paddingBottom: 8 }}>
                    <TouchableOpacity onPress={() => this.backButtonPressed()} style={{ alignItems: 'flex-start' }} >
                        <Icon name='chevron-left' type='evilicon' size={42} color='white' />
                    </TouchableOpacity>
               </View>
               <View style={{textAlign: 'center'}}>
                   <Text style={shared.userHeaderText}>{this.props.title}</Text>
               </View>
            </Header>
        )
    }
}
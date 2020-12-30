import React from 'react';
import { TouchableOpacity } from 'react-native';
import {Header , View , Text , Left , Right , Body} from 'native-base';
import { Icon } from 'react-native-elements';
import { shared , base } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
export default class LoginHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
           <Header style={[shared.header , {display:'flex' , flexDirection:'row' , alignItems:'flex-end' , justifyContent: 'center', paddingBottom: 8, height: 70}]} androidStatusBarColor='#27cccd' iosBarStyle="light-content" >
                <View style={{ position: 'absolute' , right: 15, paddingBottom: 8 }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ alignItems: 'flex-start' }} >
                        <Icon name='close' type='evilicon' size={32} color='white' />
                    </TouchableOpacity>
               </View>
               <View style={{textAlign: 'center'}}>
                   <Text style={shared.userHeaderText}>{this.props.title}</Text>
               </View>
            </Header>
        )
    }
}
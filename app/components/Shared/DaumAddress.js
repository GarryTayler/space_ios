//서비스신청(2/1)
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Container, Item, Input , Text , Button , CheckBox , Content, Form } from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import store from "./../../store/configuteStore";

let pageTitle = '서비스 신청(1/2)';

export default class DaumAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           detailAddr: '',
           addr1: '',
           addr2: ''
        };
    }
    handleAddress = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
        if (data.bname !== '') {
            extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
    }
    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content style={base.whiteBg}>
                </Content>
            </Container>
        )
    }
}
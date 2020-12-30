import React from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { Container, Content, Text , Button} from 'native-base';
import { base , form, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import { SliderBox } from 'react-native-image-slider-box';
import { SERVICE_IMGS } from './../../constants';

let pageTitle = '서비스 비용';

export default class ServicePrice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params
        };
    }

    componentDidMount() {
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
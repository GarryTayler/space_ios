import React from 'react';
import { View, TouchableOpacity , Keyboard} from 'react-native';
import { Container, Item, Form, Input , Text , Button , Textarea , Content } from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import { get_estimate_info } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {performNetwork, showToast} from '../Shared/global';

let pageTitle = '견적문의';

export default class Createbudget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,
            loaded: true,
            estimate : ''
        };
    }

    componentDidMount(){
        performNetwork(this, this.state.params.homeComp, get_estimate_info(store.getState().user.apiToken,this.state.params.ID)).then((response) => {
            if (response == null) { return; }
            var arrData = response.data;
            this.setState({ estimate: arrData[0] });
        });
    }

    render() {
        
        return (
            <Container>
                <UserHeader title={pageTitle} />

                <Content style={base.whiteBg}>
                    <Form style={form.styleForm}>
                        <View>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>보관하실 물품 설명</Text>
                        </View>
                        <Textarea
                            rowSpan={5}
                            bordered 
                            style = { form.textarea_common }
                            value = { this.state.estimate.query }
                            disabled={true}
                        />

                        <View style={base.top10}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>이름</Text>
                        </View>
                        <Item rounded style={ form.item_common }>
                            <Input
                                value = { this.state.estimate.name }
                                style = { form.input_common, fonts.size16 }
                                editable={false}
                            />
                        </Item>
                        
                        <View style={base.top10}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>연락처</Text>
                        </View>
                        <Item rounded style={ form.item_common }>
                            <Input
                                value = { this.state.estimate.contact }
                                style = { form.input_common, fonts.size16 }
                                editable={false}
                            />
                        </Item>

                        <View style={base.top10}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>내용</Text>
                        </View>
                        <Textarea
                            rowSpan={5}
                            bordered 
                            style = { form.textarea_common }
                            value = { this.state.estimate.answer }
                            disabled={true}
                        />
                        
                    </Form>
                </Content>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        )
    }
}

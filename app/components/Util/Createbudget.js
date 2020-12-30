import React from 'react';
import { View, TouchableOpacity , Keyboard} from 'react-native';
import { Container, Item, Form, Input , Text , Button , Textarea , Content } from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import { create_estimate } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {performNetwork, showToast} from '../Shared/global';

let pageTitle = '견적문의';

export default class Createbudget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: true,
            name: '',
            contact: '',
            query: ''
        };
    }

    onBtnRegisterEstimatePressed() {
        Keyboard.dismiss();
        performNetwork(this, this.state.params.homeComp, create_estimate(store.getState().user.apiToken, this.state.name, this.state.contact,this.state.query)).then((response) => {
            if (response == null) { return; }
            showToast("문의를 등록하였습니다.", 'success');
            this.state.params.parent.refreshData();
            Actions.pop();
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
                            bordered placeholder="문의할 내용가로x세로x 높이 포함 보관하실 물품에 대한 설명을 부탁드립니다.
                            고객님께 맞는 견적을 드리겠습니다"
                            style = { form.textarea_common }
                            placeholderTextColor = '#a2a2a2'
                            value = { this.state.query }
                            onChangeText = {(text) => this.setState({query: text})}
                        />

                        <View style={base.top10}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>이름</Text>
                        </View>
                        <Item rounded style={ form.item_common }>
                            <Input
                                placeholder = "이름"
                                value = { this.state.name }
                                style = { form.input_common }
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({name: text})}
                            />
                        </Item>

                        <View style={base.top10}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>연락처</Text>
                        </View>
                        <Item rounded style={ form.item_common }>
                            <Input
                                placeholder = "연락처"
                                value = { this.state.contact }
                                style = { form.input_common }
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({contact: text})}
                            />
                        </Item>
                        
                    </Form>
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnRegisterEstimatePressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>문의등록</Text>
                    </Button>
                </View>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        )
    }
}

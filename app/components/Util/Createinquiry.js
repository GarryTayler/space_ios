import React from 'react';
import { View, TouchableOpacity , Keyboard} from 'react-native';
import { Container, Item, Form, Input , Text , Button , Textarea , Content } from 'native-base';
import { base , form , elements, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import store from "./../../store/configuteStore";
import { create_inquiry } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {performNetwork, showToast} from '../Shared/global';

let pageTitle = '1:1문의 작성';

export default class Createinquiry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,

            loaded: true,
            title: '',
            contents: ''
        };
    }

    onBtnRegisterInquiryPressed() {
        Keyboard.dismiss();
        performNetwork(this, this.state.params.homeComp, create_inquiry(store.getState().user.apiToken, this.state.title, this.state.contents)).then((response) => {
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
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>제목</Text>
                        </View>
                        <Item rounded style={ form.item_common }>
                            <Input
                                placeholder = "문의할 제목 작성"
                                value = { this.state.title }
                                style = { form.input_common }
                                placeholderTextColor = '#a2a2a2'
                                onChangeText = {(text) => this.setState({title: text})}
                            />
                        </Item>

                        <View style={base.top20}>
                            <Text style={ [fonts.familyRegular, fonts.size14, fonts.colorLightBlack] }>내용</Text>
                        </View>
                        <Textarea
                            rowSpan={7}
                            bordered placeholder="문의할 내용"
                            style = { form.textarea_common }
                            placeholderTextColor = '#a2a2a2'
                            value = { this.state.contents }
                            onChangeText = {(text) => this.setState({contents: text})}
                        />
                    </Form>
                </Content>

                <View style={ form.styleForm }>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnRegisterInquiryPressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>문의등록</Text>
                    </Button>
                </View>

                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />

            </Container>
        )
    }
}

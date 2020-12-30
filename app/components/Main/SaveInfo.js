/*
    Created by Colin (2019-10-01)
*/
import React from 'react';
import { Dimensions, View } from 'react-native';
import { Container, Form, Item, Text, Button, Card, CardItem, Body, Left, Right } from 'native-base';
import UserHeader from './../Shared/UserHeader';
import { base, form, tabs, elements, card, fonts, spaces } from './../../assets/styles';
import { connect } from "react-redux";
import { _e } from "../../lang";
import { FlatGrid } from 'react-native-super-grid';
import {performNetwork, showToast , number_format} from './../Shared/global';
import { Actions } from 'react-native-router-flux';
import { PRICE_BOX_PER_MONTH } from '../../constants';
import store from "./../../store/configuteStore";
import { storage_detail_info } from './../Root/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
let pageTitle = '보관 정보';
class SaveInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            homeComp: props.params.homeComp,
            boxId: props.params.boxId,

            loaded: true,

            viewWidth: 0,
            saveInfoData: null
        }
    }

    componentDidMount() {
        
        this.setState({ viewWidth: Math.round(Dimensions.get('window').width) });
        this.fetchData();
    }

    fetchData() {
        if (this.state.boxId == null || this.state.boxId == '') {
            return;
        }
        performNetwork(this, this.state.homeComp, storage_detail_info(store.getState().user.apiToken, this.state.boxId)).then((response) => {
            if (response == null) { return; }
            var saveInfoData = response.data.box_list[0];

            console.log("[saveInfoData]=============", saveInfoData);

            let startDate = new Date(saveInfoData.start_date);
            let endDate = new Date(saveInfoData.end_date);
            let extensionDate = new Date(saveInfoData.end_date);
            extensionDate.setDate(endDate.getDate() + 1);

            saveInfoData.start_date = "" + ("" + startDate.getFullYear()) + "." + ("0" + (startDate.getMonth() + 1)).substr(-2) + "." + ("0" + startDate.getDate()).substr(-2);
            saveInfoData.end_date = "" + ("" + endDate.getFullYear()) + "." + ("0" + (endDate.getMonth() + 1)).substr(-2) + "." + ("0" + endDate.getDate()).substr(-2);
            saveInfoData.extension_date = "" + ("" + extensionDate.getFullYear()) + "년 " + ("0" + (extensionDate.getMonth() + 1)).substr(-2) + "월 " + ("0" + extensionDate.getDate()).substr(-2) + "일";

            saveInfoData.total_count = saveInfoData.storage_count + saveInfoData.delivery_count + saveInfoData.finish_count;
            this.setState({ saveInfoData: saveInfoData });
        });;
    }

    onActionButtonPressed() {
        if (this.state.saveInfoData.storage_count == 0) {     // 재보관하기
            Actions.push("restore", { params: { homeComp: this.state.homeComp, boxId: this.state.boxId } });
        } else {                                            // 나의 물품 확인
            Actions.push("save_box", { params: { homeComp: this.state.homeComp, boxId: this.state.boxId } });
        }
    }

    //연장결제
    onExtendPayPressed() {
        Actions.push("extend_pay", { params: { homeComp: this.state.homeComp, boxId: this.state.boxId, saveInfoData: this.state.saveInfoData } });
    }

    //보관종료
    onBtnExitSavingPressed() {
        Actions.push("complete_save", { params: { homeComp: this.state.homeComp, boxId: this.state.boxId } });
    }

    render() {
        return (
            <Container>
                <UserHeader title={ pageTitle } />

                <Form style={ [form.styleForm, { flex: 1 }] }>
                    { this.state.saveInfoData == null ? null :
                        <Card style={ card.itemCard } >
                            <CardItem cardBody style={ card.body }>
                                <Body>
                                    <Item style={{ borderBottomWidth: 0, paddingHorizontal: 10 }}>
                                        <Item style={{ paddingVertical: 10, borderBottomColor: '#ededed' }}>
                                            <Left>
                                                <Text style={ card.headerText }>{ this.state.saveInfoData.box_name }</Text>
                                            </Left>
                                            <Right>
                                                <Text style={ card.headerText }>1box</Text>
                                            </Right>
                                        </Item>
                                    </Item>

                                    <Form style={{ alignSelf: 'center', alignItems: 'center' }}>
                                        <View style={ spaces.vertical10 }/>
                                        {
                                            this.props.params.type != 'completed' ?
                                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorMiddleDarkPrimary] }>물품 수량</Text>
                                            :
                                            null
                                        }
                                        {
                                            this.props.params.type != 'completed' ?
                                            <Text style={ [fonts.familyMedium, fonts.size34, fonts.colorLightBlack] }>{ this.state.saveInfoData.total_count }개</Text>
                                            :
                                            null
                                        }
                                        <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray] }>보관기간: { this.state.saveInfoData.start_date + " ~ " + this.state.saveInfoData.end_date }</Text>
                                    </Form>

                                    <View style={ spaces.vertical10 }/>
                                    {
                                        this.props.params.type != 'completed' ?
                                        <Item style={{ borderBottomWidth: 0, padding: 10 }}>
                                            <Left style={{ alignItems: 'flex-end' }}>
                                                <View style={{ flexDirection: 'column', width: 80, height: 80, borderRadius: 40, backgroundColor: '#52d6d7', alignItems: 'center' }}>
                                                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorWhite, { flex: 1, textAlignVertical: 'bottom' }] }>보관중</Text>
                                                    <Text style={ [fonts.familyRegular, fonts.size21, fonts.colorWhite,  { flex: 1, textAlignVertical: 'top' }] }>{ this.state.saveInfoData.storage_count }</Text>
                                                </View>
                                            </Left>
                                            <Body>
                                                <View style={{ flexDirection: 'column', width: 80, height: 80, borderRadius: 40, backgroundColor: '#52d6d7', alignItems: 'center' }}>
                                                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorWhite, { flex: 1, textAlignVertical: 'bottom' }] }>배송중</Text>
                                                    <Text style={ [fonts.familyRegular, fonts.size21, fonts.colorWhite,  { flex: 1, textAlignVertical: 'top' }] }>{ this.state.saveInfoData.delivery_count }</Text>
                                                </View>
                                            </Body>
                                            <Right style={{ alignItems: 'flex-start' }}>
                                                <View style={{ flexDirection: 'column', width: 80, height: 80, borderRadius: 40, backgroundColor: '#52d6d7', alignItems: 'center' }}>
                                                    <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorWhite, { flex: 1, textAlignVertical: 'bottom' }] }>배송완료</Text>
                                                    <Text style={ [fonts.familyRegular, fonts.size21, fonts.colorWhite,  { flex: 1, textAlignVertical: 'top' }] }>{ this.state.saveInfoData.finish_count }</Text>
                                                </View>
                                            </Right>
                                        </Item>
                                        :
                                        null
                                    }
                                    

                                    <View style={ spaces.vertical10 } />
                                    <Item style={{ borderBottomWidth: 0, paddingHorizontal: 10, paddingTop: 10 }}>
                                        <Left>
                                            <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorMiddleDarkPrimary] }>자동 결제 예정 금액</Text>
                                        </Left>
                                        <Right>
                                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray] }>{ number_format(this.state.saveInfoData.cost) }원</Text>
                                        </Right>
                                    </Item>
                                    <View style={ spaces.vertical10 } />
                                    <Item style={{ borderBottomWidth: 0, paddingHorizontal: 10, paddingBottom: 20 }}>
                                        <Left>
                                            <Text style={ [fonts.familyMedium, fonts.size13, fonts.colorMiddleDarkPrimary] }>자동 결제 및 연장일</Text>
                                        </Left>
                                        <Right>
                                            <Text style={ [fonts.familyRegular, fonts.size13, fonts.colorMiddleDarkGray] }>{ this.state.saveInfoData.extension_date }</Text>
                                        </Right>
                                    </Item>
                                </Body>
                            </CardItem>
                        </Card>
                    }
                </Form>

                {
                    this.props.params.type != 'completed' ?
                    <View style={ form.itemContainer }>
                        <Button full style={ form.submitButton1 } onPress={ () => this.onActionButtonPressed() }>
                            <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>
                                { this.state.saveInfoData == null || this.state.saveInfoData.storage_count == 0 ? "재보관 하기" : "나의 물품 확인" }
                            </Text>
                        </Button>
                        <View style={ base.top10 } />
                        
                        <Button full style={ form.submitButton1 } onPress={ () => this.onExtendPayPressed() }>
                            <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>
                                연장결제
                            </Text>
                        </Button>
                    
                        <View style={ base.top10 } />
                        
                        <Button full style={ form.submitButton1 } onPress={ () => this.onBtnExitSavingPressed() }>
                            <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>보관종료</Text>
                        </Button>
                    </View>
                    :
                    ( this.state.saveInfoData != null && this.state.saveInfoData.restore ? 
                        <View style={ form.itemContainer }>
                            <Button full style={ form.submitButton1 } onPress={ () => this.onActionButtonPressed() }>
                                <Text style={ [fonts.familyBold, fonts.size15, fonts.colorWhite] }>
                                    재보관 하기
                                </Text>
                            </Button>
                        </View>
                        :
                        null
                    )  
                }
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
            </Container>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(SaveInfo);

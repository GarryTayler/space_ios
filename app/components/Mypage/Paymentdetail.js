import React from 'react';
import { View, TouchableOpacity , Image } from 'react-native';
import { Container, Item, Input , Text , Button , Textarea , Form, Content } from 'native-base';
import { Icon } from 'react-native-elements';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import Images from "../../assets/Images";
import {number_format} from '../Shared/global';


let pageTitle = '결제상세';

export default class Paymentdetail extends React.Component {
    constructor(props) {
        super(props);

        let oldData = props.historyData;
        let desc = JSON.parse(oldData.desc.replace(/'/g, '"'));

        this.state = {
            historyData: props.historyData,
            detailData: desc
        };
    }

    componentDidMount() {
    }

    renderServiceRequestHistory() {
        return (
            <View style={{ flex: 1 }}>
                { this.state.detailData.box_list == null || this.state.detailData.box_list.length == 0 ? null :
                    <Content style={ [{ backgroundColor: '#f6f6f6' }] } >
                        { this.state.detailData.box_list.map((item, index) => (
                            <View>
                                <View style={[elements.flex_rowAlign , {backgroundColor: 'white', alignItems:'center' , justifyContent:'space-between' , paddingVertical: 30, paddingHorizontal: 16}]}>
                                    <View>
                                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>{ item.name }</Text>
                                        <Text style={[fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray]}>{ item.amount }box/{ item.months }개월</Text>
                                    </View>
                                    <View>
                                    <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ number_format(item.price) }원</Text>
                                    </View>
                                </View>
                                <View style={{borderTopWidth: 1 , borderColor: '#ededed'}}></View>
                            </View>
                        )) }
                    </Content>
                }

                <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>

                    <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}}></View>

                    <View style={[elements.flex_columnAlign , {paddingVertical: 20}]}>
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>여유공간 금액</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ number_format(this.state.detailData.space_cost) }원</Text>
                        </View>
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>기본비용 금액</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ number_format(this.state.detailData.main_cost) }원</Text>
                        </View>
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>할인 쿠폰</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.coupon_name }</Text>
                        </View>
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between'}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>할인금액</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ number_format(this.state.detailData.discount) }원</Text>
                        </View>
                    </View>

                    <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}} />
                    <View style={ base.top20 } />
                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>총금액</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.cost) }원</Text>
                    </View>

                </Form>
            </View>
        );
    }
    renderReturnGoodHistory() {
        return (
            <View style={{ flex: 1 }}>
                { this.state.detailData.goods_list == null || this.state.detailData.goods_list.length == 0 ? null :
                    <Content style={ [{ backgroundColor: '#f6f6f6' }] } >
                        { this.state.detailData.goods_list.map((item, index) => (
                            <View>
                                <View style={[elements.flex_rowAlign , {backgroundColor: 'white', alignItems:'center' , justifyContent:'space-between' , paddingVertical: 30, paddingHorizontal: 16}]}>
                                    <View>
                                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>{ item.goods_name }</Text>
                                        <Text style={[fonts.familyRegular, fonts.size12, fonts.colorLightDarkGray]}>{ item.goods_id }</Text>
                                    </View>
                                </View>
                                <View style={{borderTopWidth: 1 , borderColor: '#ededed'}}></View>
                            </View>
                        )) }
                    </Content>
                }

                <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>

                    <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}}></View>

                    <View style={[elements.flex_columnAlign , {paddingVertical: 20}]}>
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>박스 아이디</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.box_id }</Text>
                        </View>
                    </View>

                    <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}} />
                    <View style={ base.top20 } />

                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>서비스이용비용</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.service_use_price) }원</Text>
                    </View>

                </Form>
            </View>
        );
    }
    renderRestore() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>

                <View style={[elements.flex_columnAlign , {paddingVertical: 20}]}>
                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>박스 수량</Text>
                        <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.box_count } 개</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#eeeeee', marginBottom: 10 }} />

                    { this.state.detailData.combined_box_count == null || this.state.detailData.combined_box_count.length != 2 || this.state.detailData.combined_box_count[0] == 0 ? null :
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>표준 박스</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.combined_box_count[0] } 개</Text>
                        </View>
                    }
                    { this.state.detailData.combined_box_count == null || this.state.detailData.combined_box_count.length != 2 || this.state.detailData.combined_box_count[1] == 0 ? null :
                        <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                            <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>의류 박스</Text>
                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.combined_box_count[1] } 개</Text>
                        </View>
                    }
                </View>

                <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}} />
                <View style={ base.top20 } />

                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                    <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>일반택배비용</Text>
                    <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.delivery_price) }원</Text>
                </View>

            </Form>
        );
    }
    renderAutoPay() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>

                <View style={[elements.flex_columnAlign , {paddingVertical: 20}]}>
                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                        <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>박스 아이디</Text>
                        <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.box_id }</Text>
                    </View>
                </View>

                <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}} />
                <View style={ base.top20 } />

                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                    <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>자동결제금액</Text>
                    <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.auto_pay_price) }원</Text>
                </View>

            </Form>
        );
    }
    renderCancel() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>
                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>환불금액</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.cost) }원</Text>
                </View>
            </Form>
        )
    }
    renderCancelbox() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>
                <View style={[elements.flex_columnAlign , {paddingVertical: 20}]}>
                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                        <Text style={[fonts.familyRegular, fonts.size13, fonts.colorLightBlack]}>박스 아이디</Text>
                        <Text style={[fonts.familyBold, fonts.size13, fonts.colorLightBlack]}>{ this.state.detailData.boxid }</Text>
                    </View>
                </View>

                <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}} />
                <View style={ base.top20 } />
                
                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>환불금액</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.cost) }원</Text>
                </View>
            </Form>
        )
    }
    renderCancelPayment() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>
                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>결제취소금액</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.cost) }원</Text>
                </View>
            </Form>
        )
    }
    renderCancelReturn() {
        return (
            <Form style={{ paddingHorizontal: 16, paddingBottom: 25 }}>
                <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' }]}>
                        <Text style={[fonts.familyMedium, fonts.size16, fonts.colorLightBlack]}>환불금액</Text>
                        <Text style={[fonts.familyBold, fonts.size16, {color: '#177a77'}]}>{ number_format(this.state.detailData.cost) }원</Text>
                </View>
            </Form>
        )
    }
    render() {
        if (this.state.historyData == null || this.state.detailData == null) { return null; }

        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Form style={{ paddingHorizontal: 16, paddingTop: 30 }}>
                    <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack, { paddingVertical: 20 }]}>
                    { this.state.detailData.type == 1 ?
                        "서비스 신청"
                    : (this.state.detailData.type == 2 ?
                        "개별물건 찾기"
                    : (this.state.detailData.type == 3 ?
                        "기간내 재보관"
                    : (this.state.detailData.type == 4 ?
                        "자동결제"
                    : (this.state.detailData.type == 5 ?
                        "환불(신청취소)"
                    : (this.state.detailData.type == 6 ?
                        "환불(검수불가)"
                    : (this.state.detailData.type == 7 ?
                        "결제취소"
                    : (this.state.detailData.type == 8 ?
                        "회송불가"
                    : "" ))))))) }
                    </Text>
                    <View style={[elements.flex_rowAlign , {alignItems:'center' , justifyContent:'space-between' , marginBottom: 10}]}>
                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightBlack]}>결제일</Text>
                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightDarkGray]}>{ this.state.historyData.date }</Text>
                    </View>
                    <View style={{borderTopWidth: 1 , borderColor: '#ededed' , marginLeft: -30 , marginRight: -30}}></View>
                </Form>
                { this.state.detailData.type == 1 ?
                    this.renderServiceRequestHistory()
                : (this.state.detailData.type == 2 ?
                    this.renderReturnGoodHistory()
                : (this.state.detailData.type == 3 ?
                    this.renderRestore()
                : (this.state.detailData.type == 4 ?
                    this.renderAutoPay()
                : (this.state.detailData.type == 5 ?
                    this.renderCancel()
                : (this.state.detailData.type == 6 ?
                    this.renderCancelbox()
                : (this.state.detailData.type == 7 ?
                    this.renderCancelPayment()
                : (this.state.detailData.type == 8 ?
                    this.renderCancelReturn() : null ))))))) }
            </Container>
        );
    }
}

import React from 'react';
import { Dimensions, View, TouchableOpacity, BackHandler } from 'react-native';
import { Container, Content, Text , Button} from 'native-base';
import { base , form, fonts , shared } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import { SliderBox } from 'react-native-image-slider-box';
import { SERVICE_IMGS } from './../../constants';
import { Icon } from 'react-native-elements';
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton , DialogTitle } from 'react-native-popup-dialog';
import store from "./../../store/configuteStore";
import { showToast} from './../Shared/global';

let pageTitle = '서비스 이용방법';

var isDialogOpen = false;

export default class Service extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,
            images: SERVICE_IMGS ,
            viewHeight: 0, viewWidth: 0,
            isDialogOpen: false,
            width: 0
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.setState({ 
            viewWidth: Math.round(Dimensions.get('window').width),
            viewHeight: Math.round(Dimensions.get('window').height),
        });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        if (isDialogOpen) {
            isDialogOpen = false;
            return true;
        }

        return false;
    }

    onBtnRequestServicePressed() {
        if (store.getState().user.apiToken == null) {
            //showToast(_e.shouldLogin);
            Actions.push("login");
            return;
        }

        Actions.reset("home", { params: { push_action: "addressrequest" }});
    }

    onBtnShowServicePricePressed() {
        //Actions.push("service_price", { params: { homeComp: this.state.params.homeComp } });
        this.setState({isDialogOpen:true});
        isDialogOpen = true;
    }

    renderDialog() {
        let boxImgWidth = (this.state.viewWidth * 0.9 - 30) / 2;

        return (
            <Dialog
                visible={ this.state.isDialogOpen }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.9 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ isDialogOpen: false }); }}
            >
                <DialogContent>
                    <View style={[{display:'flex' , flexDirection:'row' , alignItems:'center' , justifyContent: 'center' , backgroundColor: '#27cccd' , marginLeft: -20 , marginRight: -20 , paddingTop:7 , paddingBottom: 7}]}>
                        <View style={{ position: 'absolute' , right: 15 }}>
                                <TouchableOpacity onPress={() => { this.setState({isDialogOpen: false }); isDialogOpen = false; }} style={{ alignItems: 'flex-start' }} >
                                    <Icon name='close' type='evilicon' size={28} color='white' />
                                </TouchableOpacity>
                        </View>
                        <View style={{textAlign: 'center'}}>
                            <Text style={shared.userHeaderText}>서비스비용</Text>
                        </View> 
                    </View>
                    <View>
                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]} >· 서비스 1회 이용요금 10,000원</Text>
                        </View>
                        <View style={{marginLeft: 10 , marginTop: 6}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>(보관박스 제공, 택배비, 물류 처리비용,</Text>
                        </View>
                        <View style={{marginLeft: 10}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a', lineHeight: 18}]}>배상보험비용 포함) 보관박스 사전 배송 후 센터로 회송</Text>
                        </View>


                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]}>·월 이용료 10,000원(여유공간BOX, 의류BOX)</Text>
                        </View>
                        <View style={{marginLeft: 10 , marginTop: 6}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>→ 비용예시 :  서비스 기본료(1회) 10,000원</Text>
                        </View>
                        <View style={{marginLeft: 10}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>+ 보관료(1달,1박스) 10,000원 X N</Text>
                        </View>

                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]}>·수시찾기 비용 : 5,000원</Text>
                        </View>
                        <View style={{marginLeft: 10  , marginTop: 6}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>- 찾기/보관신청시 택배/물류처리비</Text>
                        </View>

                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]}>·첫 6개월 이상 보관시</Text>
                        </View>
                        <View>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a', lineHeight: 18}]}>30,000원 할인 쿠폰 제공(결제시 당일에 바로 사용가능)</Text>
                        </View>
                        <View style={{marginLeft: 10 , marginTop: 6}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>첫 3개월 이상 보관시 10,000원 할인 쿠폰 제공</Text>
                        </View>

                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]}>·보관기간 만료 후에는</Text>
                        </View>
                        <View>
                            <Text style={[fonts.familyBold , fonts.size12 , {color: '#177a7a'}]}>매달 1달 비용 자동 결제(BOX당 월 1만원)</Text>
                        </View>
                        <View style={{marginLeft: 10 , marginTop: 6}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>- 보관기간 종료전에 취소시 자동결제 중지</Text>
                        </View>
                        <View style={{marginLeft: 10}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {color: '#177a7a'}]}>- 물품보관 종료시 일반 택배로 반송</Text>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        );
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };

    render() {
        let sliderHeight = Math.floor(this.state.viewHeight * 0.65);
        let imageWidth = Math.floor(sliderHeight * 0.7);

        return (
            <Container>
                <UserHeader title={pageTitle} />

                <View style={[base.whiteBg, { flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: 16 }]}>
                    <View style={{display:'flex' , flexDirection: 'row' , justifyContent:'center'}}>
                        <View onLayout={this.onLayout}  style={{width: imageWidth}}>
                            <SliderBox
                                images = {this.state.images}
                                sliderBoxHeight = {sliderHeight}
                                dotColor="#27cccd"
                                inactiveDotColor="#e6e6e6"
                                parentWidth={imageWidth}
                                paginationBoxVerticalPadding={0}
                            />
                        </View>
                    </View>
                </View>
                <View style={[form.styleForm, { paddingTop: 8 }]}>
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnShowServicePricePressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>서비스 비용보기</Text>
                    </Button>
                    <View style={ base.top10 } />
                    <Button full style={form.submitButton1} onPress={()=>this.onBtnRequestServicePressed()}>
                        <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>보관 신청하기</Text>
                    </Button>
                </View>
                { this.renderDialog() }
            </Container>
        )
    }
}
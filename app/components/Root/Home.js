import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Image, View, TouchableOpacity , TouchableHighlight, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input , Text, Left, Right} from 'native-base';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { fonts, base , form , elements , Image_Icon, spaces , getScreenWidth } from '../../assets/styles';
import { Icon } from 'react-native-elements';
import Images from "../../assets/Images";
import { SliderBox } from 'react-native-image-slider-box';
import ImageSlider from 'react-native-image-slider';
import MainHeader from './../Shared/MainHeader';
import { _e } from '../../lang'
import {performNetwork, showToast} from '../Shared/global';
import { getHomeData, log_out } from './../Root/api';
import store from "./../../store/configuteStore";
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import { logOut } from '../../actions';

let images = [];

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
            ],
            width: getScreenWidth(),
            loaded: false,
            requestCount: 0,
            boxCount: 0,
        };
    }

    componentDidMount() {
        if (typeof this.props.params !== 'undefined'){
            if( this.props.params.push_action != null) {
                if(this.props.params.push_action != 'notice' && (store.getState().user.apiToken == "" || store.getState().user.apiToken == null)) {
                    Actions.push("login");
                }else{
                    Actions.push(this.props.params.push_action, { params: { homeComp: this } });
                }
            }
        }
        
        performNetwork(this, this, getHomeData(store.getState().user.apiToken), true, true).then((response) => {
            if (response == null) { return; }
            this.setState({
                requestCount: response.data.requestCount,
                boxCount: response.data.boxCount,
                images: response.data.banner
            });
        });
    }

    logout(isFromHome, isReload) {
        this.setState({loaded: false});
        log_out(
            store.getState().user.apiToken
        ).then((response) => {
            this.setState({loaded: true});

            // alert(JSON.stringify(response))

            showToast("로그아웃되었습니다. 다시 로그인해주세요.");

            this.props.logOut({});
            if (!isFromHome || isReload) {
                Actions.reset('home');
            }
        }).catch( err => {
            this.setState({loaded: true});
            showToast();
        });
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };
    gotoMainPage(page) {
        if(store.getState().user.apiToken == '' || store.getState().user.apiToken == null)
            Actions.push('login');
        Actions.push(page, { params: { homeComp: this } });
    }
    gotoServiceManual() {
        Actions.push("service", { params: { homeComp: this } });
    }
    gotoFaq() {
        Actions.push("faq", { params: { homeComp: this } });
    }
    render() {
        return(
            <Container>
                <MainHeader />
                <Content style={{backgroundColor:'#f5f5f5'}}>
                    {
                        !this.state.loaded ?
                        <View style={{width: this.state.width , height: this.state.width , backgroundColor: '#27cccd'}}>
                        </View>
                        :
                        <View onLayout={this.onLayout}>
                            <ImageSlider
                                images = {this.state.images}
                                
                                loop = {false}
                                autoPlayWithInterval = {4000}
                                customSlide={({ index, item, style, width }) => (
                                    // It's important to put style here because it's got offset inside
                                    <View key={index} style={[style, styles.customSlide]}>
                                      <Image source={{ uri: item }} style={{height: this.state.width}} />
                                    </View>
                                )}
                                customButtons={(position, move) => (
                                    <View style={{display: 'flex', flexDirection: 'row', bottom: 80, alignItems: 'center', justifyContent: 'center'}}>
                                      {this.state.images.map((image, index) => {
                                        return (
                                          <TouchableHighlight
                                            key={index}
                                            underlayColor="#ccc"
                                            onPress={() => move(index)}
                                            style={styles.button}
                                          >
                                            <View style={position == index ? styles.buttonSelected: styles.buttonNoSelected}>
                                            </View>
                                          </TouchableHighlight>
                                        );
                                      })}
                                    </View>
                                )} 
                            />
                        </View>
                    }
                    <View style={[elements.flex_rowAlign , {justifyContent:'center' , marginTop:-60, paddingHorizontal: 16}]}>

                        <TouchableHighlight style={{ flex: 1 }} onPress={()=>this.gotoMainPage('addressrequest')}>
                            <View style={{ alignItems: 'center' , backgroundColor:'white' , borderRightWidth:1 , borderColor: '#ededed' , paddingTop: 30, paddingBottom: 20 }}>
                                <Image source={ Images.request } style={ Image_Icon.home_icon } />
                                <View style={ spaces.vertical10 }></View>
                                <Text style={ [fonts.familyBold, fonts.size14, fonts.colorDarkGray] }>보관신청하기</Text>
                                {
                                    store.getState().user.apiToken == '' || store.getState().user.apiToken == null
                                    ?
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightPrimary] }>로그인후 확인해보세요.</Text>
                                    :
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightPrimary] }>총 {this.state.requestCount}번의 보관신청</Text>
                                }
                                <View style={ spaces.vertical10 }></View>
                                <Icon name='md-arrow-forward' type='ionicon' color='#4f4f4f' size={ 20 } />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight style={{ flex: 1 }} onPress={()=>this.gotoMainPage('save_box')}>
                            <View style={{ alignItems: 'center' , backgroundColor:'white' , borderRightWidth:1 , borderColor: '#ededed' , paddingTop: 30, paddingBottom: 20 }}>
                                <Image source={ Images.mygoods } style={Image_Icon.home_icon} />
                                <View style={ spaces.vertical10 }></View>
                                <Text style={ [fonts.familyBold, fonts.size14, fonts.colorDarkGray] }>나의 물품확인</Text>
                                {
                                    store.getState().user.apiToken == '' || store.getState().user.apiToken == null
                                    ?
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightPrimary] }>로그인후 확인해보세요.</Text>
                                    :
                                    <Text style={ [fonts.familyRegular, fonts.size12, fonts.colorLightPrimary] }>현재 {this.state.boxCount}개의 박스 보관중</Text>
                                }
                                <View style={ spaces.vertical10 }></View>
                                <Icon name='md-arrow-forward' type='ionicon' color='#4f4f4f' size={ 20 } />
                            </View>
                        </TouchableHighlight>

                    </View>

                    <View style={[elements.flex_columnAlign , {justifyContent:'center' , marginTop:20 , paddingHorizontal: 16 , marginRight: -16 , marginLeft: 16}]}>
                        <TouchableHighlight onPress={()=>this.gotoServiceManual()}>
                            <View style={[elements.flex_rowAlign , {backgroundColor: '#27cccd' , paddingVertical:30, paddingHorizontal: 16, justifyContent:'space-between' , alignItems: 'center'}]}>
                                <Left style={{ flex: 7 }}>
                                    <View style={[elements.flex_rowAlign , { alignItems: 'center', paddingHorizontal: 8 }]}>
                                        <Image source={Images.service_manual} style={[Image_Icon.home_icon_1 , {marginRight: 10}]} />
                                        <View style={[elements.flex_columnAlign]}>
                                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorWhite]}>서비스 이용방법</Text>
                                            <Text style={[fonts.familyRegular, fonts.size10, fonts.colorWhite]}>여유공간만의 서비스 이용방법을 확인해보세요.</Text>
                                        </View>
                                    </View>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <Icon name='md-arrow-forward' type='ionicon' color='white' size={24} />
                                </Right>
                            </View>
                        </TouchableHighlight>

                        <View style={base.top20}></View>

                        <TouchableHighlight onPress={()=>this.gotoFaq()}>
                            <View style={[elements.flex_rowAlign , {backgroundColor: '#fff' , paddingVertical:30, paddingHorizontal: 16,justifyContent:'space-between' , alignItems: 'center'}]}>
                            <Left style={{ flex: 7 }}>
                                    <View style={[elements.flex_rowAlign , {alignItems: 'center', paddingHorizontal: 8}]}>
                                        <Image source={Images.question} style={[Image_Icon.home_icon_1 , {marginRight: 10}]} />
                                        <View style={[elements.flex_columnAlign]}>
                                            <Text style={[fonts.familyBold, fonts.size13, fonts.colorDarkGray]}>궁금한 내용</Text>
                                            <Text style={[fonts.familyRegular, fonts.size10, fonts.colorDarkGray]}>여유공간에서 도와드립니다.</Text>
                                        </View>
                                    </View>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <Icon name='md-arrow-forward' type='ionicon' color='#4f4f4f' size={24} />
                                </Right>
                            </View>
                        </TouchableHighlight>
                        <View style={base.top25}></View>
                    </View>
                </Content>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    slider: { backgroundColor: '#000', height: 350 },
    
    buttons: {
      zIndex: 1,
      height: 15,
      marginTop: -25,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    button: {
      margin: 3,
      width: 15,
      height: 15,
      opacity: 0.9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSelected: {
      width: 10, height: 10,
      backgroundColor : '#d4f5f5',
    },
    buttonNoSelected: {
      width: 8, height: 8,
      backgroundColor: '#68dbdc'
    },
    
    customImage: {
      width: 100,
      height: 100,
    },
  });

const mapDispatchToProps = dispatch => {
    return {
        logOut : state => { dispatch(logOut(state)) }
    }
}

export default connect(null,mapDispatchToProps)(Home)
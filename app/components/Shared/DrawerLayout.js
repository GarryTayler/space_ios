import React from 'react';
import {View, Text, Item} from 'native-base';
import {ImageBackground , TouchableOpacity, TouchableHighlight} from "react-native";
import { drawer , elements , fonts } from "./../../assets/styles";
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import { _e } from '../../lang';
import store from './../../store/configuteStore';
import Images from './../../assets/Images';
import { showToast } from './../Shared/global';
import { connect } from "react-redux";
import { logOut } from '../../actions';
import { log_out } from '../Root/api';

class DrawerLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    logout(isFromHome, isReload) {
        this.setState({loaded: false});
        log_out(
            store.getState().user.apiToken
        ).then((response) => {
            this.setState({loaded: true});

            // alert(JSON.stringify(response))

            if (!this.props.isRemoveAccount) {
                showToast("로그아웃되었습니다. 다시 로그인해주세요.");
            }
            
            this.props.logOut({});
            if (!isFromHome || isReload) {
                Actions.reset('home');
            }
        }).catch( err => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    moveAnotherPage(page) {
        if(page == 'home')
            Actions.reset(page);
        else {
            if(store.getState().user.apiToken == "" || store.getState().user.apiToken == null) {
                if(page != 'service' && page != 'login' && page != 'notice') {
                    //showToast(_e.shouldLogin);
                    Actions.push("login");
                    return;
                }
            }
            Actions.push(page, { params: { homeComp: this } });
        }
    }
    render() {
        return (
            <View style={drawer.container}>
                <View>
                    {
                        store.getState().user.apiToken == null || store.getState().user.apiToken == '' ?
                        <View style={[drawer.logoContainer , elements.flex_columnAlign]}>
                            <View>
                                <Text style={[fonts.familyBold, fonts.size16, fonts.colorLightDarkGray]}>로그인 해주세요</Text>
                            </View>
                            <TouchableOpacity onPress={()=>this.moveAnotherPage('login')}>
                                <View style={[elements.flex_rowAlign , {alignItems:'center'}]}>
                                    <View>
                                        <Text style={[fonts.familyRegular, fonts.size14, fonts.colorLightDarkGray]}>로그인</Text>
                                    </View>
                                    <Icon name='chevron-right' type='evilicon' size={32} color='#a2a2a2' />
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={[drawer.login_logoContainer , elements.flex_columnAlign]}>
                            <View style={[elements.flex_rowAlign , {justifyContent: 'space-between' , alignItems: 'center' , paddingTop: 12 , paddingBottom: 12 , position: 'relative'}]}>
                                <Text style={[elements.font16 , {color:'#fff' , fontWeight:'bold'}]}>{store.getState().user.userid} 님</Text>
                                <View style={{borderWidth: 0.5 , borderColor: '#fff' , borderRadius: 4 , padding: 2}}>
                                    <Text style={[elements.font12 , {color:'#fff'}]}>MY</Text>
                                </View>
                                <Text style={[{position: 'absolute' , color: '#fff' , top: 50} , elements.font12]}>{store.getState().user.mobile}</Text>
                            </View>
                            <View style={{borderBottomWidth: 1 , borderColor: 'white' , width: 15}}>
                            </View>
                        </View>
                    }
                    <TouchableHighlight onPress={()=>this.moveAnotherPage('home')}>
                        <View style={[drawer.item]}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon type="ionicon" name="md-home" style={drawer.itemIcon} size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_home}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={()=>this.moveAnotherPage('addressrequest')}>
                        <View style={drawer.item}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon type="ionicon" name="md-create" style={drawer.itemIcon} size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_request}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.moveAnotherPage('save_box_statistic')}>
                        <View style={drawer.item}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon type="ionicon" name="ios-list" style={drawer.itemIcon} size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_save_box}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.moveAnotherPage('service')}>
                        <View style={drawer.item}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon name="ios-phone-portrait" style={drawer.itemIcon} type="ionicon" size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_service}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.moveAnotherPage('inquiry')}>
                        <View style={drawer.item}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon name="ios-call" style={drawer.itemIcon} type="ionicon" size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_inquiry}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.moveAnotherPage('notice')}>
                        <View style={drawer.item}>
                            <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                <Icon name="ios-book" style={drawer.itemIcon} type="ionicon" size={16} color='#27ccce' />
                            </View>
                            <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_notice}</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        !(store.getState().user.apiToken == null || store.getState().user.apiToken == '') ?
                        <TouchableOpacity onPress={()=>this.moveAnotherPage('mypage')}>
                            <View style={drawer.item}>
                                <View style={{width:20 , display: 'flex' , flexDirection: 'row' , justifyContent: 'flex-start'}}>
                                    <Icon name="ios-grid" style={drawer.itemIcon} type="ionicon" size={16} color='#27ccce' />
                                </View>
                                <Text style={ [fonts.familyMedium, fonts.size14, fonts.colorLightDarkGray] }>{_e.menu_mypage}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View></View>
                    }
                </View>
                <View style={{marginBottom:40 , display: 'flex' , justifyContent: 'center' ,  flexDirection:'row' , width: '100%'}}>
                    <ImageBackground source={Images.menu_footer} style={[drawer.imageFooter]}>
                    </ImageBackground>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logOut : state => { dispatch(logOut(state)) }
    }
}

export default connect(null,mapDispatchToProps)(DrawerLayout)
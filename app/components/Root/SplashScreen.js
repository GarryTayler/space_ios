import React from 'react';
import { StatusBar, Image, Dimensions } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Container , Spinner, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import styles from './../../assets/styles';
import { setIsConnected } from "../../actions/network";
import { _e } from "../../lang";
import store from "./../../store/configuteStore";
import { showToast , global_variable } from './../Shared/global';
import { auto_login } from './api';
import OneSignal from 'react-native-onesignal';

import Images from '../../assets/Images';

const {
    width: windowWidth,
    height: windowHeight
} = Dimensions.get('window');

class SplashScreen extends React.Component {
    rendered = false;
    constructor(props) {
        super(props);
        OneSignal.init(
            '9dc5d130-ec07-4ed1-bab5-a9cabde7bc24',
            {kOSSettingsKeyAutoPrompt: false},
        );
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.enableVibrate(true);
        OneSignal.inFocusDisplaying(2);
    }

    onReceived(notification) {
        // console.log('Notification received: ', notification);
    }

    onOpened(openResult) {
        // console.log('Message: ', openResult.notification.payload.body);
        // console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);
        // console.log('openResult: ', openResult);
        
        if (openResult.notification.payload.additionalData.page == "save_box") {
            Actions.reset("home", { params: {push_action: "save_box_statistic" }});
        }
        else if(openResult.notification.payload.additionalData.page == "no_page") {
            Actions.reset("home");
        }
        else if(openResult.notification.payload.additionalData.page == "admin_push") {
            Actions.reset("home", { params: {push_action: "notice" }});
        }
    }

    onIds(device) {
        //device_id = device.userId;
        global_variable.device_id = device.userId;
    }

    componentDidMount() {
        this.props.dispatch(setIsConnected({isConnected: true}));
        NetInfo.isConnected.addEventListener('connectionChange', this._handleChange);
        let v = this;
        setTimeout(()=>{
            if(!v.rendered) {
                Actions.reset('root');
            }
        } , 2500);
    }
    _handleChange = (isConnected) => {
        if(!isConnected && isConnected != store.getState().network.isConnected.isConnected){
            showToast(_e.connectionError,"danger")
        }
        else if(isConnected && isConnected != store.getState().network.isConnected.isConnected && store.getState().network.isConnected.isConnected != undefined){
            showToast(_e.connectionSuccess, "success")
        }
        this.props.dispatch(setIsConnected({isConnected: isConnected}));
    }
    render() {
        const style = styles.index;
        if( this.props.isConnected ) {
            if( this.props.rehydrated === true ) {
                /*this.CheckUserLogin().then(response => {
                    if(response.hasOwnProperty("status"))  {
                        if(response.status == "success")
                            Actions.reset('root');
                        else
                            Actions.reset('login');
                    }
                    else {
                            Actions.reset('login');
                    }
                }).catch((error) => {
                    Actions.reset('login');
                    showToast();
                }); */
                this.rendered = true;
                Actions.reset('root');
            }
        }
        return (
            <Container style={style.splashContainer}>
                <Image style={{ height: windowHeight }} source={ Images.splash_back } resizeMode='contain' />

                {/* <StatusBar backgroundColor="#999999" barStyle="light-content"/>
                <Text style={style.splashText}>{ _e.splashText }</Text>
                <Spinner color={'white'} /> */}
            </Container>
        )
    }
    async CheckUserLogin()  {
        try {
            let apiToken = this.props.user.apiToken;
            return apiToken === null
            ? false
            : await auto_login(apiToken);
        } catch(error) {
            console.log(error);
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.user,
        rehydrated : state.rehydrated,
        isConnected: state.network.isConnected
    }
}
export default connect(mapStateToProps , null)(SplashScreen);
//서비스 신청 2단계
import React, { Component } from 'react';
import {Dimensions, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Container , View , Text, Spinner, Toast } from 'native-base';
import UserHeader from "./../Shared/UserHeader";
import { Actions } from 'react-native-router-flux';
import { categories, form } from './../../assets/styles';
import { _e } from '../../lang';
import {base, elements} from "../../assets/styles";
import Images from "../../assets/Images";
import { connect } from "react-redux";
import store from './../../store/configuteStore';
import { showToast } from './../Shared/global.js';

const {
    width: windowWidth
} = Dimensions.get('window');

class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeData: null,
            loaded: true
        };
    }
    
    componentDidMount() {
        if(store.getState().network.isConnected.isConnected) {
            //get store box for user via apis
        }
        else {
            this.setState({loaded:true , storeData: {}});
            showToast();    
        }
    }    

    render() {
        let open = this.props.hasOwnProperty('open') ? this.props : store.getState().vendor.open;
        let box_id = this.props.hasOwnProperty('box_id') ? this.props.box_id : store.getState().user.box_id;        

        return (
            <Container>
                <UserHeader title="보관함"/>
                <ScrollView>
                { this.state.loaded ?
                        <View style={elements.roundBox}>
                            <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={base.boldPrimary}>{ this.state.storeData.title }</Text>
                                </View>
                            </View>
                            <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={[base.mediumText, base.headingText]}>{ this.state.storeData.address }</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Text style={[base.mediumText,base.primary]}>{_e[lang].store_address}:</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Image source={Images.icoPin} resizeMode="contain" style={elements.icons}/>
                                </View>
                            </View>
                            <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={[base.mediumText, base.headingText]}> از { this.state.storeData.working_start } الی { this.state.storeData.working_end }</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Text style={[base.mediumText,base.primary]}>{_e[lang].working_hours}:</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Image source={Images.icoClock} resizeMode="contain" style={elements.icons}/>
                                </View>
                            </View>
                            <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={[base.mediumText, base.headingText]}>{ this.state.storeData.distance } کیلومتر </Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Text style={[base.mediumText,base.primary]}>{_e[lang].distance}:</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Image source={Images.icoDistance} resizeMode="contain" style={elements.icons}/>
                                </View>
                            </View>
                            <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={[base.mediumText, base.headingText]}>{ this.state.storeData.delivery_time }</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Text style={[base.mediumText,base.primary]}>{_e[lang].delivery_time}:</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Image source={Images.icoShipment} resizeMode="contain" style={elements.icons}/>
                                </View>
                            </View>
                            <View style={categories.hiddenBox}>
                                <View>
                                    <Text style={[base.mediumText, categories.redColor]}>{(this.state.storeData.open===1)?_e[lang].open:_e[lang].closed}</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={[base.mediumText, base.headingText]}>{ this.state.storeData.cover_info }</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Text style={[base.mediumText,base.primary]}>{_e[lang].free_delivery}:</Text>
                                </View>
                                <View style={{flex:0, justifyContent:'center'}}>
                                    <Image source={Images.icoFree} resizeMode="contain" style={elements.icons}/>
                                </View>
                            </View>
                            <TouchableOpacity onPress = {() => Actions.push('home', { store_id: store_id , product_type : "all" })}>
                            <View style={{backgroundColor:'#f1f1f1', marginTop:10, borderRadius:5, borderColor:'#e3e3e3', borderWidth:1, padding:10, alignItems:'center', flex:1, justifyContent:'center'}}>
                                <View style={categories.hiddenBox}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={base.normalText}>{_e[lang].view_store_products}</Text>
                                </View>
                                </View>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {() => Actions.push('categories', { store_id: store_id })}>
                                <View style={{backgroundColor:'#f1f1f1', marginTop:10, borderRadius:5, borderColor:'#e3e3e3', borderWidth:1, padding:10, alignItems:'center', flex:1, justifyContent:'center'}}>
                                    <View style={categories.hiddenBox}>
                                        <View style={{flex:1, justifyContent:'center'}}>
                                            <Text style={base.normalText}>{_e[lang].view_categories}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {() => Actions.push('home', { store_id: store_id, product_type:"sale" })}>
                                <View style={{backgroundColor:'#f1f1f1', marginTop:10, borderRadius:5, borderColor:'#e3e3e3', borderWidth:1, padding:10, alignItems:'center', flex:1, justifyContent:'center'}}>
                                    <View style={categories.hiddenBox}>
                                        <View style={{flex:1, justifyContent:'center'}}>
                                            <Text style={base.normalText}>{_e[lang].view_offers}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    :
                        <Spinner color={ '#852c50' } />
                    }
                </ScrollView>
            </Container>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return { setUser : user => { dispatch(setUser(user)) } }
}

export default connect(null, mapDispatchToProps)(Request)
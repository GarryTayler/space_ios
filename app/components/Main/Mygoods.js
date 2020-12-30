import React from 'react';
import {ScrollView, Dimensions, TouchableOpacity, TouchableHighlight, Image , Alert} from 'react-native';
import { Root } from "native-base";
import { Container , View , Text , SwipeRow, Left , Button , Right , Content , Icon, Input, Item, Spinner, Label , Toast } from 'native-base';
import UserHeader from "../Shared/UserHeader";
import { base, elements, form } from './../../assets/styles';
import {showToast } from './../Shared/global.js';
import { Actions } from 'react-native-router-flux';
import store from './../../store/configuteStore';
import {_e} from "../../lang";

const {
    width: windowWidth,
    height: windowHeight
} = Dimensions.get('window');

const imageSize       = windowWidth * 0.4;
const pageTitle = "나의 물품확인";

export default class Mygoods extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading : false, 
            total_box_count: 0,
            total_goods: 0,
            warning_good_id: -1
        } 
    }    

    componentDidMount() {
        //get boxid list and goods id  from api
    }

    _renderFooter() {
        if(this.state.loading)
            return (
                <View style={elements.footerAlt}>
                    <View style={elements.footerBoxesLeft}>
                        <TouchableOpacity style={elements.buyButton} onPress={()=>Actions.push('set_address')}>
                            <Text style={elements.buttonText}>{_e[lang].save_continue}</Text>
                        </TouchableOpacity>
                    </View>
                </View>        
            );
    }

    _renderTotalGoods() {
        if(this.state.loading)
            return (
                <View>
                  <View style={{flex:1, flexDirection:'column', justifyContent:'flex-start', padding:5, backgroundColor:'white' }}>
                    <View style={{flex:1, padding:5}}>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10}}>
                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start',}}>
                                <Text style={[base.normalText,{justifyContent:'flex-start', textAlign:'left'}]}>{this.state.goods_name}</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start'}}>
                                <Text style={base.normalText}>보관시작일</Text>
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10}}>
                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start',}}>
                                <Text style={[base.normalText,{justifyContent:'flex-start', textAlign:'left', color:'#b52025'}]}> ({this.state.store_discount} {_e[lang].currency_sym})</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start'}}>
                                <Text style={base.normalText}></Text>
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10}}>

                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start',}}>
                                <Text style={[base.normalText,{justifyContent:'flex-start', textAlign:'left'}]}>{this.state.total_price_new} {_e[lang].currency_sym}</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start'}}>
                                <Text style={base.normalText}></Text>
                            </View>
                        </View>

                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10}}>
                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
                                <Text style={[base.normalText,{justifyContent:'flex-start', textAlign:'left', color:'#b52025'}]}>
                                    ({this.state.coupon_title != ""?this.state.coupon_discount:'0'} {_e[lang].currency_sym})
                                    </Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start'}}>
                                <Text style={base.normalText}></Text>
                            </View>
                        </View>

                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10, paddingTop:5, borderTopWidth:1, borderTopColor:'#bababa'}}>
                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start',}}>
                                <Text style={[base.boldBlack,{justifyContent:'flex-start', textAlign:'left'}]}>{this.state.final_price} {_e[lang].currency_sym}</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start'}}>
                                <Text style={base.boldBlack}></Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{height:80, backgroundColor:'#fff'}}></View>
                </View>
            );       
    }
    _renderPopup() {
        if(this.state.loading)        
            return (
                <View style={{flex:1, flexDirection:'column', justifyContent:'flex-start', padding:0, backgroundColor:'white', marginBottom:1 }}>
                                    <View style={{flex:1, padding:5, backgroundColor:'#efefef'}}>
                                        {
                                                    this.state.good_title == '' ?
                                                <View style={{flexDirection:'column', justifyContent:'center'}}>
                                                    <Text style={base.boldBlack}>물품명</Text>
                                                </View>
                                                :
                                                <View style={{flexDirection:'column', justifyContent:'center'}}>
                                                    <Text style={base.boldPrimary}>물품명</Text>
                                                </View>

                                                }
                                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',marginTop:10, marginBottom:10}}>
                                            <View  style={{flex:1, flexDirection:'row', justifyContent:'flex-start', height:40, padding:0, margin:0}}>
                                                {
                                                    this.state.coupon_title == '' ?
                                                <TouchableOpacity  style={elements.buyButton} onPress={()=>this.apply_coupon()} >
                                                    <View style={{flexDirection:'column', justifyContent:'center', paddingLeft:10, paddingRight:10}}>
                                                        <Text style={elements.buttonText}>ID</Text>
                                                    </View>
                                                </TouchableOpacity>:
                                                <TouchableOpacity style={elements.buyButton} onPress={()=>this.apply_coupon()}>
                                                    <View style={{flexDirection:'column', justifyContent:'center', paddingLeft:10, paddingRight:10}}>
                                                    <Text style={elements.buttonText}>ID</Text>
                                                </View>
                                                </TouchableOpacity>
                                                }
                                                <View style={{flex:1, justifyContent:'flex-start',  alignItems:'center' }}>
                                                    <Item rounded style={[form.item, {alignItems:'center'}]} >
                                                        <Input
                                                        style={form.input}
                                                        maxLength = {11}
                                                        value={this.state.total_goods}
                                                        editable = {this.state.coupon_title == '' ? true : false}
                                                        onChangeText={ (text) => this.setState({total_goods:text})}
                                                        />
                                                    </Item>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                    <Spinner_bar color={'#852c50'} visible={!this.state.loading} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                    </View>
            );
    }

    _renderSpinner() {
        //* this makes slowly */
        if(!this.state.loaded) {
            return (
                <View style={{height:240}}>
                    <Spinner color={ '#852c50' } />
                </View>
            )
        } else {
            if(this.state.basket_data.length < 1)
                return (
                    <View style={categories.hiddenBox}>
                        <View style={[categories.headingBox,{flex:1}]}>
                            <Text style={base.boldPrimary}>  </Text>
                        </View>
                    </View>
                )
        }
    }

    render () {
        return (
            <Root>
                <Container>
                    <UserHeader title={pageTitle} />
                    <Content>
                        <ScrollView>
                            <Spinner_bar color={'#852c50'} visible={this.state.changeStock}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                            {this._renderTotalGoods()}
                            {this._renderPopup()}         
                            {this._renderSpinner()}
                        </ScrollView>
                    </Content>
                    {this._renderFooter()}
                </Container>
            </Root>
        )
    }
}
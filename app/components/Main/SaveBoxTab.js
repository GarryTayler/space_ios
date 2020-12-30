/*
    Created by Colin (2019-09-30)
*/

import React from 'react';
import { Dimensions, Image, View, BackHandler } from 'react-native';
import { Container, Form, Text, Button, Grid, Col, Row, Item, Card, CardItem, Body, Radio, Left, Right } from 'native-base';
import { base, form, elements, card, dialog, fonts } from './../../assets/styles';
import { connect } from "react-redux";
import { _e } from "../../lang";
import { FlatGrid } from 'react-native-super-grid';
import Images from "../../assets/Images";
import Dialog, { ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

var itemDetailModalVisible = false;

class SaveBoxTab extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            boxData: props.saveBoxData,
            viewWidth: 0,
            numOfSelectedItems: 0,

            isSelectingMode: false,

            itemDetailModalVisible: false,
            tappedItemIndex: 0
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.setState({ viewWidth: Math.round(Dimensions.get('window').width) });
        
        this.props.onRef(this);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

        this.props.onRef(undefined);
    }

    handleBackButton() {
        if (itemDetailModalVisible) {
            itemDetailModalVisible = false;
            return true;
        }

        return false;
    }

    componentWillReceiveProps(props) {
        this.setState({
            boxData: props.saveBoxData,
            itemDetailModalVisible: false,
            tappedItemIndex: 0
        });

        itemDetailModalVisible = false;
    }

    onBtnSelectAllPressed() {
        this.setState({ isSelectingMode: true });
        
        var boxData = this.state.boxData;
        boxData.goods_list.forEach(item => {
            item.isSelected = true;
        });

        this.setState({ boxData: boxData, numOfSelectedItems: boxData.goods_list.length });
        
        this.props.parent.onItemSelected(boxData.goods_list.length);
    }
    onItemPressed(index) {
        if (this.state.isSelectingMode) {
            this.selectItem(index);
        } else {
            this.setState({
                itemDetailModalVisible: true,
                tappedItemIndex: index
            });
            itemDetailModalVisible = true;
        }
    }
    onItemLongPressed(index) {
        if (this.state.isSelectingMode) {
            return;
        }

        this.setState({ isSelectingMode: true });
        this.selectItem(index);
    }
    selectItem(index) {
        var boxData = this.state.boxData;
        boxData.goods_list[index].isSelected = !boxData.goods_list[index].isSelected;

        this.setState({ boxData: boxData });

        var numOfSelectedItems = 0;
        boxData.goods_list.forEach(item => {
            if (item.isSelected) {
                numOfSelectedItems ++;
            }
        });
        this.setState({ numOfSelectedItems: numOfSelectedItems });

        this.props.parent.onItemSelected(numOfSelectedItems);
    }

    unselectItems() {
        this.setState({ isSelectingMode: false });

        let boxData = this.state.boxData;
        boxData.goods_list.forEach(item => {
            item.isSelected = false;
        });

        this.setState({ boxData: boxData, numOfSelectedItems: 0 });
        
        this.props.parent.onItemSelected(0);
    }

    renderDialog() {
        if (this.state.boxData == null || this.state.boxData.goods_list == null || this.state.boxData.goods_list.length == 0) {
            return null;
        }

        let selectedItem = this.state.boxData.goods_list[this.state.tappedItemIndex];

        let date = new Date(selectedItem.start_date);
        startDate = "" + ("" + date.getFullYear()) + "-" + ("0" + (date.getMonth() + 1)).substr(-2) + "-" + ("0" + date.getDate()).substr(-2);

        return (
            <Dialog
                visible={ this.state.itemDetailModalVisible }
                dialogAnimation={ new ScaleAnimation(0) }
                width={ 0.9 }
                overlayPointerEvents='none'
                onHardwareBackPress={ () => { this.setState({ itemDetailModalVisible: false }); }}
                footer={
                    <DialogFooter bordered={ false } style={ dialog.footer }>
                        {[
                            <DialogButton
                                key="dismiss"
                                text="확인"
                                textStyle={ dialog.footerButton }
                                onPress={() => {
                                    this.setState({ itemDetailModalVisible: false });
                                    itemDetailModalVisible = false;
                                }}/>
                        ]}
                    </DialogFooter>
                } >
                <DialogContent>
                    <Form style={ dialog.contentTitleContainer }>
                        <Text style={ dialog.contentTitle }>물건정보</Text>
                    </Form>

                    <Form>
                        <Card style={ card.itemCard } >
                            <CardItem cardBody style={ card.body } >
                                <Image
                                    style={ card.bodyItemImg }
                                    source={{ uri: selectedItem.image }}
                                    resizeMode='stretch' />
                            </CardItem>
                        </Card>
                    </Form>

                    <Form style={{ paddingTop: 10 }}>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ dialog.contentHintText }>물품명:  </Text>
                            <Text style={ dialog.contentValueText }>{ selectedItem.goods_name }</Text>
                        </Item>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ dialog.contentHintText }>ID:  </Text>
                            <Text style={ dialog.contentValueText }>{ selectedItem.goods_id }</Text>
                        </Item>
                        <Item style={ dialog.contentDetailContainer }>
                            <Text style={ dialog.contentHintText }>보관 시작일:  </Text>
                            <Text style={ dialog.contentValueText }>{ startDate }</Text>
                        </Item>
                    </Form>

                    <Button transparent
                        style={ dialog.closeButton }
                        onPress={ () => {
                            this.setState({ itemDetailModalVisible: false });
                            itemDetailModalVisible = false;
                        }}>
                        <Image style={ elements.size16 } source={ Images.ic_dialog_close } />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }
    render() {
        if (this.state.boxData == null || this.state.boxData.goods_list == null || this.state.boxData.goods_list.length == 0) {
            return (<Container />);
        }

        return (
            <Container>
                <Form style={{ height: 50 }}>
                    <View style={ [form.itemContainer, { flexDirection: 'row', flex: 1, paddingVertical: 10, position: 'absolute' }] }>
                        <Left>
                            <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorLightBlack] }>물건 수  { this.state.boxData.goods_list.length }</Text>
                        </Left>
                        <Right>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorLightDarkGray] }>선택 { this.state.numOfSelectedItems }  |  </Text>
                                <Text style={ [fonts.familyMedium, fonts.size15, fonts.colorPrimary] } onPress={ () => this.onBtnSelectAllPressed() }>전체선택</Text>
                            </View>
                        </Right>
                    </View>
                </Form>
                
                <FlatGrid
                    itemDimension={ (this.state.viewWidth - 80) / 2 }
                    items={ this.state.boxData.goods_list }
                    renderItem={({ item, index }) => (
                        <Card style={ card.itemCard } >
                            <Image
                                style={ card.itemCardImg }
                                source={{ uri: item.image }} />

                            <CardItem button style={ card.itemCardItem }
                                onPress={() => this.onItemPressed(index) }
                                onLongPress={ () => this.onItemLongPressed(index)}>
                            </CardItem>
                            
                            { this.state.isSelectingMode ? 
                                <View style={ card.itemSelectionRadio }>
                                    <Image
                                    style={{ width: 20, height: 20 }}
                                    source={ item.isSelected ? Images.ic_radio_on : Images.ic_radio_off } />
                                </View>

                            // <Radio disabled
                            //     color={ '#b1b1b1' }
                            //     selectedColor={ '#27cccd' }
                            //     selected={ item.isSelected }
                            //     style={ card.itemSelectionRadio } />
                            : <View />}
                        </Card>
                    )} />

                { this.renderDialog() }

            </Container>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(null, mapDispatchToProps)(SaveBoxTab);
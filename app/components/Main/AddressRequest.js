//서비스신청(2/1)
import React from 'react';
import {
  Dimensions,
  Image,
  BackHandler,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
} from 'react-native';
import {
  Container,
  Item,
  Input,
  Text,
  Button,
  CheckBox,
  Content,
  Form,
  ActionSheet,
} from 'native-base';
import {base, form, elements, dialog, fonts} from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import {Icon} from 'react-native-elements';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {_e} from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
import Postcode from 'react-native-daum-postcode';
import store from './../../store/configuteStore';
import Images from '../../assets/Images';
import Dialog, {
  ScaleAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import {setUser} from '../../actions';
import {connect} from 'react-redux';
import {register_address} from './../Root/api';

let pageTitle = '서비스 신청(1/2)';

var regAddrSuccessDialogVisible = false;
var self = null;

class AddressRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: props.params,

      viewWidth: 0,
      viewHeight: 0,

      loaded: true,
      isAddressAlreadyExist: false,
      isSameAddress: false,
      isAddressSearch: false,
      detailAddr: '',
      addr1: '',
      addr2: '',
      addressError: null,
      detailAddrError: null,
      addr1Error: null,
      addr2Error: null,

      regAddrSuccessDialogVisible: false,
    };
  }

  componentDidMount() {
    self = this;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.setState({
      viewWidth: Math.round(Dimensions.get('window').width),
      viewHeight: Math.round(Dimensions.get('window').height),
    });

    let user = store.getState().user;
    if (user.detail_addr != null && user.addr1 != null && user.addr2 != null) {
      this.setState({isAddressAlreadyExist: true});
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    if (regAddrSuccessDialogVisible) {
      regAddrSuccessDialogVisible = false;
      return true;
    }

    if (self.state.isAddressSearch) {
      self.setState({isAddressSearch: false});
      return true;
    }

    return false;
  }

  sameAddressCheck() {
    let isSameAddress = !this.state.isSameAddress;

    let user = store.getState().user;
    this.setState({
      isSameAddress: isSameAddress,
      detailAddr: isSameAddress ? user.detail_addr : '',
      addr1: isSameAddress ? user.addr1 : '',
      addr2: isSameAddress ? user.addr2 : '',
    });
  }

  searchAddressButtonPressed() {
    this.setState({
      loaded: false,
      isAddressSearch: true,
    });

    var self = this;
    setTimeout(() => {
      this.setState({
        loaded: true,
      });
    }, 3000);
  }
  searchAddressValueUpdated(data) {
    let address = data.address;
    let jibunAddress = data.jibunAddress;
    let userSelectedType = data.userSelectedType;
    let buildingName = data.buildingName;
    let zonecode = data.zonecode;

    let addr1 = '';
    if (userSelectedType == 'J') {
      addr1 = jibunAddress + (buildingName == '' ? '' : ', ') + buildingName;
    } else {
      addr1 = address + (buildingName == '' ? '' : ', ') + buildingName;
    }

    this.setState({
      detailAddr: zonecode,
      //addr1: query + (roadname == '' ? '' : ' ') + roadname,
      //addr2: jibunAddress + (roadname == '' ? '' : ", ") + roadname + (buildingName == '' ? '' : ", ") + buildingName,
      addr1: addr1,
      addr2: '',
      isAddressSearch: false,
    });
  }

  onBtnNextPressed() {
    Keyboard.dismiss();

    if (this.state.detailAddr == '') {
      this.setState({addressError: _e.addressCheck, detailAddrError: 'error'});
      return;
    }
    if (this.state.addr1 == '') {
      this.setState({addressError: _e.addressCheck, addr1Error: 'error'});
      return;
    }
    //   if (this.state.addr2 == '')             { this.setState({ addressError: _e.addressCheck, addr2Error: 'error' });            return; }

    this.setState({
      detailAddrError: null,
      addressError: null,
      addr1Error: null,
      addr2Error: null,
    });

    if (!this.state.isAddressAlreadyExist) {
      this.setState({regAddrSuccessDialogVisible: true});
      regAddrSuccessDialogVisible = true;
    } else {
      this.moveToRequestServicePage();
    }
  }

  onRegAddrConfButtonPressed() {
    this.setState({regAddrSuccessDialogVisible: false});
    regAddrSuccessDialogVisible = false;
    performNetwork(
      this,
      this.state.params.homeComp,
      register_address(
        store.getState().user.apiToken,
        this.state.addr1,
        this.state.addr2,
        this.state.detailAddr,
      ),
    ).then(response => {
      if (response == null) {
        return;
      }

      let user = store.getState().user;
      this.props.setUser({
        userid: user.userid,
        email: user.email,
        mobile: user.mobile,
        addr1: this.state.addr1,
        addr2: this.state.addr2,
        detail_addr: this.state.detailAddr,
        username: user.username,
        userno: user.userno,
        apiToken: user.apiToken,
        push_flag: user.push_flag,
        user_type: user.user_type,
      });
      this.moveToRequestServicePage();
    });
  }

  moveToRequestServicePage() {
    let params = {
      homeComp: this.props.params.homeComp,
      addr1: this.state.addr1,
      addr2: this.state.addr2,
      detailAddr: this.state.detailAddr,
    };
    Actions.push(
      'request_service',
      {params: params},
      {homeComp: this.state.params.homeComp},
    );
  }

  render() {
    return (
      <Container>
        <UserHeader title={pageTitle} comp={this} />

        <Content
          style={[
            base.whiteBg,
            {backgroundColor: this.state.loaded ? 'white' : '#efefef'},
          ]}>
          {this.state.isAddressSearch ? (
            <Form style={form.styleForm}>
              <Postcode
                style={{
                  width: this.state.viewWidth - 32,
                  height: this.state.viewHeight - 200,
                }}
                jsOptions={{animation: true}}
                onSelected={data => this.searchAddressValueUpdated(data)}
              />
            </Form>
          ) : (
            <Form style={form.styleForm}>
              {this.state.isAddressAlreadyExist ? (
                <TouchableHighlight
                  activeOpacity={0.9}
                  underlayColor="#eee"
                  style={{padding: 8, paddingLeft: 0}}
                  onPress={() => {
                    this.sameAddressCheck();
                  }}>
                  <View
                    style={[
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}>
                    <CheckBox
                      checked={this.state.isSameAddress}
                      color="#27cccd"
                      style={{marginLeft: -7}}
                      onPress={() => {
                        this.sameAddressCheck();
                      }}
                    />
                    <Text
                      style={[
                        fonts.familyMedium,
                        fonts.size14,
                        fonts.colorLightBlack,
                        {marginLeft: 20},
                      ]}>
                      보관시 등록 한 주소지와 동일
                    </Text>
                  </View>
                </TouchableHighlight>
              ) : null}

              <View style={base.top20}>
                <Text
                  style={[
                    fonts.familyRegular,
                    fonts.size14,
                    fonts.colorLightBlack,
                  ]}>
                  주소
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Item
                  rounded
                  style={[
                    this.state.detailAddrError != null
                      ? form.item_common_failed
                      : form.item_common,
                    {flex: 1},
                  ]}>
                  <Input
                    placeholder="상세주소를 입력하세요."
                    value={this.state.detailAddr}
                    style={form.input_common}
                    placeholderTextColor="#a2a2a2"
                    onChangeText={text =>
                      this.setState({
                        detailAddr: text,
                        addressError: null,
                        detailAddrError: null,
                      })
                    }
                  />
                </Item>
                <Button
                  style={[form.vbutton, {marginLeft: 8, width: 40, height: 40}]}
                  onPress={() => {
                    this.searchAddressButtonPressed();
                  }}>
                  <Icon color="#fff" name="md-search" type="ionicon" />
                </Button>
              </View>
              <Item
                rounded
                style={
                  this.state.addr1Error != null
                    ? form.item_common_failed
                    : form.item_common
                }>
                <Input
                  placeholder="서울특별시 서대문구 연희로"
                  value={this.state.addr1}
                  style={form.input_common}
                  placeholderTextColor="#a2a2a2"
                  onChangeText={text =>
                    this.setState({
                      addr1: text,
                      addressError: null,
                      addr1Error: null,
                    })
                  }
                />
              </Item>
              <Item
                rounded
                style={
                  this.state.addr2Error != null
                    ? form.item_common_failed
                    : form.item_common
                }>
                <Input
                  placeholder="지번,도로명,건물명을 입력하세요."
                  value={this.state.addr2}
                  style={form.input_common}
                  placeholderTextColor="#a2a2a2"
                  onChangeText={text =>
                    this.setState({
                      addr2: text,
                      addressError: null,
                      addr2Error: null,
                    })
                  }
                />
                {this.state.addressError != null ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      position: 'absolute',
                      top: 55,
                    }}>
                    <Text
                      style={[
                        fonts.familyRegular,
                        fonts.size12,
                        fonts.colorRed,
                      ]}>
                      * {this.state.addressError}
                    </Text>
                  </View>
                ) : null}
              </Item>
            </Form>
          )}
          <Spinner_bar
            color={'#27cccd'}
            visible={!this.state.loaded}
            textContent={''}
            overlayColor={'rgba(0, 0, 0, 0.5)'}
          />
        </Content>

        {!this.state.isAddressSearch ? (
          <View style={form.styleForm}>
            <Button
              full
              style={form.submitButton1}
              onPress={() => this.onBtnNextPressed()}>
              <Text style={[fonts.familyBold, fonts.size15, fonts.colorWhite]}>
                다음
              </Text>
            </Button>
          </View>
        ) : null}

        {/*===== Warning Dialog =====*/}
        <Dialog
          visible={this.state.regAddrSuccessDialogVisible}
          dialogAnimation={new ScaleAnimation(0)}
          width={0.7}
          overlayPointerEvents="none"
          onHardwareBackPress={() => {
            this.setState({regAddrSuccessDialogVisible: false});
          }}
          footer={
            <DialogFooter bordered={false} style={dialog.footer}>
              {[
                <DialogButton
                  key="dismiss"
                  text="확인"
                  textStyle={dialog.footerButton}
                  onPress={() => this.onRegAddrConfButtonPressed()}
                />,
              ]}
            </DialogFooter>
          }>
          <DialogContent>
            <Form style={dialog.formWarning}>
              <Image
                style={elements.size60}
                source={Images.ic_dialog_success}
              />
            </Form>

            <View style={base.top20} />

            <Form>
              <Text style={dialog.formWarningText}>
                나의 주소에 등록되었으며, 마이페이지에서 주소지 수정이
                가능합니다.
              </Text>
            </Form>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch(setUser(user));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(AddressRequest);

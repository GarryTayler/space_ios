import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Text,
  Header,
} from 'native-base';
import {Icon} from 'react-native-elements';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {
  base,
  form,
  elements,
  Image_Icon,
  fonts,
  shared,
} from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import Images from '../../assets/Images';
import {_e} from '../../lang';
import {user_signin, check_sns} from './../Root/api';
import {showToast, global_variable} from './../Shared/global';
import {connect} from 'react-redux';
import {setUser} from '../../actions';
import store from './../../store/configuteStore';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import KakaoLogins from '@react-native-seoul/kakao-login';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
const initials = {
  kConsumerKey: 'YXVt2VuEDasVWwJdyE_1',
  kConsumerSecret: '4JVN21CoIG',
  kServiceAppName: '네이버 아이디로 로그인하기',
  kServiceAppUrlScheme: 'sparespace', // only for iOS
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: false,
      pwdError: false,
      loaded: true,
      theToken: '',
    };
  }
  componentDidMount() {
    LoginManager.logOut();
    NaverLogin.logout();

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '705753806469-fm8818be3v7t0ibp6lcb54naf755kaup.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
      iosClientId:
        '705753806469-vfeecukscojndh6msh9gibutbgf7m9ec.apps.googleusercontent.com',
    });
    this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
      console.warn('Credential Revoked');
      this.fetchAndUpdateCredentialState().catch(error =>
        this.setState({credentialStateForUser: `Error: ${error.code}`}),
      );
    });

    this.fetchAndUpdateCredentialState()
      .then(res => this.setState({credentialStateForUser: res}))
      .catch(error =>
        this.setState({credentialStateForUser: `Error: ${error.code}`}),
      );
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.authCredentialListener();
  }

  appleSignIn = async () => {
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      this.user = newUser;

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({credentialStateForUser: res}))
        .catch(error =>
          this.setState({credentialStateForUser: `Error: ${error.code}`}),
        );
      //   console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
      this.trySignIn(7, this.user, email);
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        showToast('Apple Sign in cancelled');
      } else {
        showToast(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({credentialStateForUser: 'N/A'});
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user,
      );
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        this.setState({credentialStateForUser: 'AUTHORIZED'});
      } else {
        this.setState({credentialStateForUser: credentialState});
      }
    }
  };

  trySignIn(user_type, social_id, email) {
    this.setState({loaded: false});
    check_sns(user_type, social_id, global_variable.device_id)
      .then(response => {
        this.setState({loaded: true});
        if (response.status == 'fail') {
          showToast(response.errMsg);
          return;
        }

        if (response.is_login) {
          this.props.setUser({
            userid: response.data.userid,
            email: response.data.email,
            mobile: response.data.mobile,
            addr1: response.data.addr1,
            addr2: response.data.addr2,
            detail_addr: response.data.detail_addr,
            username: response.data.username,
            userno: response.data.userno,
            apiToken: response.data.apitoken,
            user_type: response.data.user_type,
            device_id: global_variable.device_id,
            push_flag: true,
          });
          Actions.reset('root');
        } else {
          let params = {
            user_type: user_type,
            social_id: social_id,
            email: email,
          };
          Actions.push('signup_sms', {params: params});
        }
      })
      .catch(error => {
        this.setState({loaded: true});
        showToast();
      });
  }
  trySocialLogin(socialType) {
    if (socialType == 'google') this.googleSignIn();
    else if (socialType == 'naver') this.naverLoginStart();
    else if (socialType == 'kakao') this.kakaoLogin();
    else if (socialType == 'facebook') this.facebookLogin();
    else if (socialType == 'apple') this.appleSignIn();
  }
  googleSignIn = async () => {
    let __this = this;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      __this.trySignIn(1, userInfo['user']['id'], userInfo['user']['email']);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //   showToast(_e.googleCancel);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // showToast(_e.googleCancel);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast(_e.googleNotAvailable);
      } else {
        showToast(_e.googleOtherError);
      }
    }
  };
  naverLoginStart = async () => {
    NaverLogin.login(initials, (err, token) => {
      this.setState({theToken: token});
      if (err) {
        //   showToast(_e.naverOtherError);
        return;
      }
      this.fetchProfile();
    });
  };
  fetchProfile = async () => {
    const profileResult = await getProfile(this.state.theToken);
    if (profileResult.resultcode === '024') {
      //Alert.alert('로그인 실패', profileResult.message);
      // showToast(_e.naverOtherError);
      return;
    }
    this.trySignIn(
      3,
      profileResult['response']['id'],
      profileResult['response']['email'],
    );
  };
  kakaoLogin = async () => {
    KakaoLogins.login()
      .then(result => {
        KakaoLogins.getProfile()
          .then(result => {
            if (!(result.hasOwnProperty('email') && result['email'] != '')) {
              showToast(_e.kakaoOtherError);
            } else {
              this.trySignIn(4, result['id'], result['email']);
            }
          })
          .catch(err => {
            // alert(`Get Profile Failed:${err.code} ${err.message}`);
            showToast(_e.kakaoOtherError);
          });
      })
      .catch(err => {
        if (err.code === 'E_CANCELLED_OPERATION') {
          // alert(`Login Cancelled:${err.message}`);
          showToast(_e.kakaoOtherError);
        } else {
          // alert(`Login Failed:${err.code} ${err.message}`);
          showToast(_e.kakaoOtherError);
        }
      });
  };
  //userID
  facebookLogin() {
    let __this = this;
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          // showToast(_e.facebookCancel);
        } else {
          AccessToken.getCurrentAccessToken()
            .then(data => {
              __this
                .fetchFacebookProfile()
                .then(profile => {
                  __this.trySignIn(2, profile['id'], profile['email']);
                })
                .catch(err => {
                  showToast(_e.facebookOtherError);
                });
            })
            .catch(err => {
              showToast(_e.facebookOtherError);
            });
        }
      },
      function(error) {
        showToast(_e.facebookOtherError);
      },
    );
  }
  async fetchFacebookProfile(callback) {
    const requestManager = new GraphRequestManager();
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me?fields=email,name,friends',
        null,
        (error, result) => {
          if (result) {
            const profile = result;
            profile.avatar = `https://graph.facebook.com/${result.id}/picture`;
            resolve(profile);
          } else {
            reject(error);
          }
        },
      );
      requestManager.addRequest(request).start();
    });
  }
  onBtnSigninPressed() {
    Keyboard.dismiss();
    if (this.state.email == '') {
      this.setState({emailError: true});
      return;
    } else this.setState({emailError: false});
    if (this.state.password == '') {
      this.setState({pwdError: true});
      return;
    } else this.setState({pwdError: false});

    this.setState({loaded: false});
    user_signin(
      this.state.email,
      this.state.password,
      global_variable.device_id,
    )
      .then(response => {
        this.setState({loaded: true});
        if (response.status == 'fail') {
          showToast(response.errMsg);
          return;
        }
        this.props.setUser({
          userid: response.data.userid,
          email: this.state.email,
          mobile: response.data.mobile,
          addr1: response.data.addr1,
          addr2: response.data.addr2,
          detail_addr: response.data.detail_addr,
          username: response.data.username,
          userno: response.data.userno,
          apiToken: response.data.apitoken,
          user_type: response.data.user_type,
          device_id: global_variable.device_id,
          push_flag: true,
        });
        Actions.reset('root');
      })
      .catch(error => {
        this.setState({loaded: true});
        showToast();
      });
  }
  onChangeText(text, type) {
    if (type == 'email') {
      this.setState({email: text.replace(' ', '')});
      if (this.state.email != '') this.setState({emailError: false});
    } else {
      this.setState({password: text});
      if (this.state.password != '') this.setState({pwdError: false});
    }
  }
  render() {
    return (
      <Container>
        <Header
          style={[
            shared.header,
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 8,
              height: 70,
            },
          ]}
          androidStatusBarColor="#27cccd"
          iosBarStyle="light-content">
          <View style={{position: 'absolute', left: 0, paddingBottom: 8}}>
            <TouchableOpacity
              onPress={() => Actions.pop()}
              style={{alignItems: 'flex-start'}}>
              <Icon
                name="chevron-left"
                type="evilicon"
                size={42}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </Header>

        <Container style={{backgroundColor: '#00cdcc'}}>
          <Content
            contentContainerStyle={[
              base.contentBg,
              {
                flexGrow: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
              form.styleForm,
            ]}>
            <View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 30,
                }}>
                <Image
                  source={Images.logo}
                  style={Image_Icon.login_logo_Image}
                />
              </View>
              <Item
                rounded
                style={
                  this.state.emailError
                    ? [form.item, form.invalid, {position: 'relative'}]
                    : [form.item, {position: 'relative'}]
                }>
                <Icon
                  color={this.state.emailError ? 'red' : 'white'}
                  name="ios-mail"
                  type="ionicon"
                />
                <Input
                  placeholder={_e.emailPlaceholder}
                  value={this.state.email}
                  style={[form.input, {paddingLeft: 20}]}
                  onChangeText={text => this.onChangeText(text, 'email')}
                  placeholderTextColor="white"
                />
                {this.state.emailError ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      position: 'absolute',
                      top: 55,
                    }}>
                    <Text style={form.errLabel}>* {_e.emailPlaceholder}</Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </Item>
              {this.state.emailError ? (
                <View style={base.top20}></View>
              ) : (
                <View></View>
              )}
              <Item
                rounded
                style={
                  this.state.pwdError
                    ? [
                        form.item,
                        form.invalid,
                        {position: 'relative', paddingLeft: 16},
                      ]
                    : [form.item, {position: 'relative', paddingLeft: 16}]
                }>
                <Icon
                  name="ios-lock"
                  type="ionicon"
                  color={this.state.pwdError ? 'red' : 'white'}
                />
                <Input
                  secureTextEntry={true}
                  placeholder={_e.passwordPlaceholder}
                  value={this.state.password}
                  style={[form.input, fonts.size15, {paddingLeft: 21}]}
                  onChangeText={text => this.onChangeText(text, 'password')}
                  placeholderTextColor="white"
                />
                {this.state.pwdError ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      position: 'absolute',
                      top: 55,
                    }}>
                    <Text style={form.errLabel}>
                      * {_e.passwordPlaceholder}
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </Item>
              {this.state.pwdError ? (
                <View style={base.top20}></View>
              ) : (
                <View></View>
              )}
              <Button
                full
                style={form.submitButton}
                onPress={() => this.onBtnSigninPressed()}>
                <Text
                  style={[fonts.familyBold, fonts.size15, {color: '#56ccc8'}]}>
                  {_e.signin}
                </Text>
              </Button>
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                }}>
                <View
                  style={[
                    base.top20,
                    {flexDirection: 'row', justifyContent: 'center'},
                  ]}>
                  <Text
                    onPress={() => {
                      Keyboard.dismiss();
                      Actions.push('signup');
                    }}
                    style={[
                      fonts.familyRegular,
                      fonts.size14,
                      fonts.colorWhite,
                      {marginRight: 10},
                    ]}>
                    {_e.signup}
                  </Text>
                  <Text style={base.normalText}>|</Text>
                  <Text
                    onPress={() => {
                      Keyboard.dismiss();
                      Actions.push('findpassword');
                    }}
                    style={[
                      fonts.familyRegular,
                      fonts.size14,
                      fonts.colorWhite,
                      {marginLeft: 10},
                    ]}>
                    {_e.search_password}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <View style={base.top10}></View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    height: 1,
                    width: '35%',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={[fonts.familyBold, fonts.size14, fonts.colorWhite]}>
                  {_e.social_login}
                </Text>
                <View
                  style={{
                    height: 1,
                    width: '35%',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 15
                }}>
                <AppleButton
                  style={{width: '100%', height: 50, margin: 10}}
                  cornerRadius={5}
                  buttonStyle={AppleButton.Style.WHITE}
                  buttonType={AppleButton.Type.CONTINUE}
                  onPress={() => this.trySocialLogin('apple')}
                />
              </View>
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  },
                  base.top20,
                ]}>
                <TouchableOpacity
                  onPress={() => this.trySocialLogin('facebook')}>
                  <Image
                    source={Images.facebook}
                    style={Image_Icon.socialIcons}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.trySocialLogin('naver')}>
                  <Image source={Images.naver} style={Image_Icon.socialIcons} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.trySocialLogin('kakao')}>
                  <Image source={Images.kakao} style={Image_Icon.socialIcons} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.trySocialLogin('google')}>
                  <Image
                    source={Images.google}
                    style={Image_Icon.socialIcons}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Content>
          <Spinner_bar
            color={'#27cccd'}
            visible={!this.state.loaded}
            textContent={''}
            overlayColor={'rgba(0, 0, 0, 0.5)'}
          />
        </Container>
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

export default connect(null, mapDispatchToProps)(Login);

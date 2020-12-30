import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions, Platform, PixelRatio, StyleSheet} from 'react-native';
import { func } from 'prop-types';
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');

const scale =  SCREEN_WIDTH / 360;
const halfSize = SCREEN_WIDTH / 2;
const oneThird = SCREEN_WIDTH / 3;
const oneFourth = SCREEN_WIDTH / 4;
const oneFifth = SCREEN_WIDTH / 5;
let size_scale = scale;
if (scale > 2) {
    size_scale = scale * 0.666;
}
export function normalize(size) {
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size)) + 2;
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size))
    }
}

export function getScreenHeight() {
    return SCREEN_HEIGHT - normalize(60);
}

export function getScreenWidth() {
    return SCREEN_WIDTH;
}

export const fonts = EStyleSheet.create({
    familyRegular: { fontFamily: '$fontNotoSansRegular' },
    familyMedium: { fontFamily: '$fontNotoSansMedium' },
    familyBold: { fontFamily: '$fontNotoSansBold' },

    weight700: { fontWeight: '700' },
    weightBold: { fontWeight: 'bold' },

    size9 : { fontSize: normalize(9), lineHeight: normalize(10), paddingTop: normalize(4) },
    size10 : { fontSize: normalize(10), lineHeight: normalize(10), paddingTop: normalize(4) },
    size11 : { fontSize: normalize(11), lineHeight: normalize(10), paddingTop: normalize(4) },
    size12 : { fontSize: normalize(12), lineHeight: normalize(10), paddingTop: normalize(4) },
    size13 : { fontSize: normalize(13), lineHeight: normalize(11), paddingTop: normalize(4) },
    size14 : { fontSize: normalize(14), lineHeight: normalize(12), paddingTop: normalize(4) },
    size15 : { fontSize: normalize(15), lineHeight: normalize(14), paddingTop: normalize(5) },
    size16 : { fontSize: normalize(16), lineHeight: normalize(15), paddingTop: normalize(5) },
    size17 : { fontSize: normalize(17), lineHeight: normalize(17), paddingTop: normalize(5) },
    size21 : { fontSize: normalize(21), lineHeight: normalize(16), paddingTop: normalize(10) },
    size34 : { fontSize: normalize(34), lineHeight: normalize(30), paddingTop: normalize(15) },
    size50 : { fontSize: normalize(50), lineHeight: normalize(50), paddingTop: normalize(25) },

    colorDeepLightPrimary: { color: '#52d6d7' },
    colorLightPrimary: { color: '#74c3ba' },
    colorMiddleLightPrimary: { color: '#42adad' },
    colorPrimary: { color: '#27cccd' },
    colorMiddleDarkPrimary: { color: '#26afb0' },
    colorDeepDarkPrimary: { color: '#1e9495' },
    colorDarkPrimary: { color: '#177a7a' },

    colorWhite: { color: 'white' },
    colorLightDarkGray: { color: '#a2a2a2' },
    colorMiddleDarkGray: { color: '#808080' },
    colorDarkGray: { color: '#4f4f4f' },
    colorLightBlack: { color: '#1f1f1f'},
    colorBlack: { color: 'black' },

    colorRed: { color: '#fe0000' }
});

export const spaces = EStyleSheet.create({
    vertical10: { marginTop: normalize(10) },
    vertical20: { marginTop: normalize(20) },
    vertical30: { marginTop: normalize(30) }
});

export const base = EStyleSheet.create({
    // header: {
    //     paddingTop: getStatusBarHeight(),
    //     height: 54 + getStatusBarHeight()
    // },
    screenHeight: {
        height: getScreenHeight()
    },
    contentBg: {
        backgroundColor: '$primaryColor'
    },
    whiteBg: {
        backgroundColor: '$sWhiteColor'
    },
    top10: {
        marginTop: normalize(10),
    },
    top15: {
        marginTop: normalize(15),
    },
    top20: {
        marginTop: normalize(20),
    },
    top25: {
        marginTop: normalize(20),
    },
    top30: {
        marginTop: normalize(30),
    },
    top35: {
        marginTop: normalize(35),
    },
    top40: {
        marginTop: normalize(40),
    },
    top45: {
        marginTop: normalize(45),
    },
    horizontal10: {
        marginLeft: normalize(5),
        marginRight: normalize(5)
    },
    normalText: {
        color: '$sWhiteColor',
        fontSize: normalize(13),
        fontFamily: '$IS'
    },
    boldText: {
        fontFamily: '$fontNotoSansBold'
    },
    menuIcon: {
        color: '$sWhiteColor',
        paddingLeft:normalize(10),
        paddingRight:normalize(10),
        paddingTop:normalize(3),
    }
});

export const elements = EStyleSheet.create({ 
    box : {
        borderBottomColor: "$sGreyColor"
    } ,
    font10 : {
        fontSize: normalize(10)
    },
    font11 : {
        fontSize: normalize(11)
    },
    font12 : {
        fontSize: normalize(12)
    },
    font13 : {
        fontSize: normalize(13)
    },
    font14 : {
        fontSize: normalize(14)
    },
    font15 : {
        fontSize: normalize(15)
    },
    font16 : {
        fontSize: normalize(16)
    },
    font17 : {
        fontSize: normalize(17)
    },
    colorPrimary: {
        color: '$primaryColor'
    },
    colorLabelColor4: {
        color: '$sLabelColor4'
    },

    size60: {
        width: 60,
        height: 60
    },
    size16: {
        width: 16,
        height: 16
    },
    size20: {
        width: 18,
        height:18
    },
    flex_rowAlign : {
        display: 'flex',
        flexDirection: 'row'
    },
    flex_columnAlign : {
        display: 'flex',
        flexDirection: 'column'
    },
    inquiry_padding : {
        paddingLeft: normalize(16) ,
        paddingRight: normalize(16) ,
    },
    inquiry_detail_padding : {
        paddingTop: normalize(16) ,
        paddingBottom: normalize(16) ,
    },
    faq_padding : {
        paddingTop: normalize(12) ,
        paddingBottom: normalize(12) ,
    },
    mypage_row : {
        paddingVertical: normalize(10),
        paddingLeft: normalize(16) ,  
        borderBottomWidth: 1 , 
        borderColor: '#ececec' , 
        alignItems: 'center' , 
        justifyContent: 'space-between'
    },
    coupon_left_side : {
        height: normalize(90) ,
        width:'30%' ,
        backgroundColor:'#ededed' ,
        borderTopLeftRadius : 8,
        borderBottomLeftRadius : 8,
        borderRightColor: '#a2a2a2' ,
        borderRightWidth: 1 ,
        borderStyle: 'dashed'
    },
    coupon_right_side : {
        height: normalize(90) ,
        width:'70%' , 
        borderTopRightRadius : 8,
        borderBottomRightRadius : 8,
        backgroundColor:'#ededed' 
    },
    boxShadow : {
        borderWidth: 1,
        borderColor: '#eee',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 12 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    }
});

export const Image_Icon = EStyleSheet.create({
    login_logo_Image : {
        width: SCREEN_WIDTH - 64,
        height : normalize(172)
    }    ,
    socialIcons : {
        width: normalize(45),
        height: normalize(45)
    } ,
    mypageIcons : {
        width: normalize(18),
        height: normalize(18)
    } ,
    home_logo : {
        width: normalize(89),
        height: normalize(30)
    } ,
    home_icon : {
        width: normalize(24),
        height: normalize(24)
    } ,
    home_icon_1 : {
        width: normalize(20),
        height: normalize(22)
    }
});

export const form = EStyleSheet.create({
    styleForm : {
        paddingTop: normalize(30),
        paddingBottom: normalize(25),
        paddingHorizontal: normalize(16)
    },
    generalForm : {
        paddingBottom: normalize(25)
    },
    input: {
        fontFamily: '$IS',
        fontSize: normalize(15), lineHeight: normalize(15),
        color: '$sWhiteColor' ,
        textAlignVertical: 'center'
    },
    input_common: {
        fontFamily: '$IS',
        fontSize: normalize(13),
        //color: '$sGreyColor'
    },
    textarea_common: {
        fontSize: normalize(13) ,
        fontFamily: '$IS',
        // color: '$sGreyColor',
        borderColor:'$sInputBoundaryColor',
        borderRadius: 5
    },
    item : {
        borderRadius : normalize(30),
        marginBottom: normalize(10),
        paddingRight: normalize(5),
        paddingLeft: normalize(13),
        height: normalize(40),
        backgroundColor: '$sInputboxBackgroundColor',
        borderColor:'$sInputboxBackgroundColor',
    },
    item_common : {
        borderRadius : normalize(5),
        marginTop: normalize(5),
        marginBottom: normalize(5),
        paddingRight: normalize(5),
        paddingLeft: normalize(5),
        height: normalize(40),
        backgroundColor: '$sWhiteColor',
        borderColor:'$sInputBoundaryColor',
        paddingRight: 8,
    },
    item_common_failed : {
        borderRadius : normalize(5),
        marginTop: normalize(5),
        marginBottom: normalize(5),
        paddingRight: normalize(5),
        paddingLeft: normalize(5),
        height: normalize(40),
        backgroundColor: '$sWhiteColor',
        borderColor:'red',
        paddingRight: 8,
    },
    submitButton : {
        borderRadius : normalize(30),
        backgroundColor: '$sWhiteColor',
    },
    submitText : {
        color: '$primaryColor',
        fontWeight: 'bold',
    },
    submitButton1 : {
        borderRadius : normalize(30),
        backgroundColor: '$primaryColor',
    },
    submitText1 : {
        color: '$sWhiteColor',
        fontWeight: 'bold',
    },
    submitButtonSmall : {
        height: 40,
        borderRadius : normalize(20),
        backgroundColor: '$primaryColor',
    },
    submitTextSmall : {
        color: '$sWhiteColor',
        fontWeight: 'bold',
    },
    invalid: {
        borderWidth: 1,
        borderColor: '$sRedColor',
    },
    errLabel: {
        fontSize: normalize(12),
        fontFamily: '$IS',
        color: '$sRedColor'
    },
    vbutton : {
        borderRadius : normalize(5),
        backgroundColor: '$primaryColor',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    vsize: {
        height: normalize(30) ,
        width:  normalize(100)  ,
    },
    vtext : {
        color: '$sWhiteColor' ,
        fontSize: normalize(12) ,
        textAlign: 'center'
    },
    itemContainer : {
        paddingBottom: normalize(30),
        paddingTop: normalize(16),
        paddingLeft: normalize(16),
        paddingRight: normalize(16),
    },
});

export const drawer = EStyleSheet.create({
    container :{
        display: 'flex' ,
        flexDirection: 'column' ,
        justifyContent: 'space-between' ,
        height: '100%'
    },
    logoContainer : {
        width : '100%',
        backgroundColor: '$sWhiteColor' ,
        paddingLeft: 15 ,
        paddingTop: 50 ,
        paddingBottom: 20 ,
        borderBottomWidth: 0.5 ,
        borderColor: '$sGreyColor'
    },
    login_logoContainer : {
        width : '100%',
        backgroundColor: '$primaryColor' ,
        paddingLeft: 15 ,
        paddingRight: 15 ,
        paddingTop: 50 ,
        paddingBottom: 30 ,
    },
    headingTextMedium: {
        fontFamily:'$IS',
        fontSize:normalize(10),
        color:'$sBlackColor'
    },
    headingTextBorder: {
        borderRadius:normalize(5),
        borderColor:'$sWhiteColor',
        borderWidth:1,
    },
    imageFooter: {
        height:normalize(93),
        width:normalize(136),
    },
    item : {
        display: 'flex' ,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: normalize(10),
        paddingBottom: normalize(10),
        paddingLeft:normalize(15),
        paddingRight:normalize(5) ,
        borderBottomWidth: 0.5 ,
        borderColor: '#ececec'
    },
    selectedItem: {
        backgroundColor:'$sBackgroundColor2',
    },
    itemIcon : {
        marginLeft: normalize(10)
    },
    itemTitle : {
        fontFamily : '$fontNotoSansRegular',
        fontSize: normalize(14),
        color:'$sGreyColor',
        fontWeight: 'bold' ,
    },


    menuHeader: {
        padding:normalize(15),
    },
    internalItem : {
        justifyContent: 'flex-end' ,
        paddingTop: normalize(12),
        paddingBottom: normalize(12),
        marginLeft:normalize(5),
        marginRight:normalize(5),
        backgroundColor:'$sBackgroundColor1',
        borderBottomColor:'$sBlackColor',
        borderBottomWidth:1,
    },
    featuredItem: {
        borderRadius:normalize(5),
        borderColor:'$primaryColor',
        borderWidth:1,
    },
    newItem: {
        width:normalize(10),
        height:normalize(10),
        marginRight:normalize(5),
        borderRadius:normalize(5),
        backgroundColor:'$sLabelColor4'
    },
    headingText: {
        fontFamily:'$IS',
        fontSize:normalize(12),
        color:'$sBlackColor'
    },
    headingTextBold: {
        fontFamily:'$ISB',
        fontSize:normalize(16),
        color:'$sBlackColor'
    },
    logo: {
        width:normalize(75),
    },
});

export const index = EStyleSheet.create({
    splashContainer : {
        flex: 1 ,
        justifyContent: 'center' ,
        alignItems: 'center' ,
        backgroundColor : '$primaryColor'
    },
    splashText : {
        color : 'white',
        fontSize : normalize(18),
        fontFamily : '$IS'
    }
});

export const tabsStyles = EStyleSheet.create({
    tabStyle: {
        backgroundColor: 'white'        
    },
    tabTextStyle: {
        color: '#b1b1b1' , fontWeight: 'bold'
    },
    activeTabStyle: {
        backgroundColor: 'white'
    },
    activeTextStyle: {
        color: '#02a3a3' , fontWeight: 'bold'
    }
});

export const shared = EStyleSheet.create({
    header: {
        backgroundColor: '$primaryColor',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
        height:normalize(50),
        zIndex:10000,
        position: 'relative'
    },
    home_header: {
        backgroundColor: '$sWhiteColor',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
        paddingLeft: 0,
        height:normalize(60),
        zIndex:10000,
        position: 'relative'
    } ,
    headerText: {
        color: 'white',
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(14), lineHeight: normalize(14), paddingTop: normalize(7),
        paddingTop:normalize(5)
    },
    userHeaderText: {
        color: 'white',
        paddingTop:normalize(2),
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(17), lineHeight: normalize(17), paddingTop: normalize(8.5),
        fontSize:normalize(16)
    }
});

export const tabs = EStyleSheet.create({
    tab: {
        backgroundColor: 'white'
    },
    text: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(15), lineHeight: normalize(15), paddingTop: normalize(7.5),
        color: '$sDeactiveLabelColor'
    },
    activeText: {
        fontFamily: '$fontNotoSansRegular',
        fontSize: normalize(15), lineHeight: normalize(15), paddingTop: normalize(7.5),
        color: '$sActiveLabelColor'
    },
    tabBarUnderline: {
        height: 1,
        borderBottomWidth: 1,
        borderColor: '$sActiveLabelColor'
    }
});

export const dialog = EStyleSheet.create({
    footer: {
        backgroundColor: '$primaryColor'
    },
    footerButton: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(17), lineHeight: normalize(17), paddingTop: normalize(8.5),
        color: 'white'
    },
    formWarning: {
        paddingTop: 30,
        alignSelf: 'center'
    },
    formWarningText: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(12), lineHeight: normalize(20), paddingTop: normalize(6),
        color: '#1f1f1f',
        textAlign: 'center'
    },
    contentTitleContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    contentTitle: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(17), lineHeight: normalize(17), paddingTop: normalize(8.5),
        color: '#1f1f1f'    
    },

    contentDetailContainer: {
        marginLeft: 0,
        borderBottomWidth: 0,
        marginTop: 5
    },
    contentHintText: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(12), lineHeight: normalize(12), paddingTop: normalize(6),
        color: '#1f1f1f'
    },
    contentValueText: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(11), lineHeight: normalize(11), paddingTop: normalize(5.5),
        color: '#a2a2a2'
    },

    closeButton: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'flex-end',
        padding: 10
    }
});

export const card = EStyleSheet.create({
    // 보관함
    itemCard: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        borderRadius: 8
    },
    itemCardImg: {
        borderRadius: 8,
        width: (SCREEN_WIDTH - 40) / 2,
        height: (SCREEN_WIDTH - 40) / 2,
        position: 'absolute'
    },
    itemCardItem: {
        borderRadius: 8,
        height: (SCREEN_WIDTH - 40) / 2,
        backgroundColor: 'transparent'
    },
    itemSelectionRadio: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'flex-end',
        padding: 10
    },
    body: {
        borderRadius: 8
    },
    bodyItemImg: {
        height: 200,
        width: null,
        flex: 1,
        borderRadius: 8
    },

    // 보관정보
    header: {
        // margin: 10,
        height: 30
    },
    headerText: {
        fontFamily: '$fontNotoSansMedium',
        fontSize: normalize(15), lineHeight: normalize(15), paddingTop: normalize(7.5),
        color: '#1f1f1f'
    }
});

export default styles = {
    index
};
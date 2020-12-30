import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Body, Button, CheckBox, Container, Content, Form, Input, Item, Right, Text} from 'native-base';
import {base, fonts, form} from '../../assets/styles';
import LoginHeader from '../Shared/LoginHeader';
import {Actions} from 'react-native-router-flux';
import {_e} from '../../lang';
import {performNetwork, showToast} from '../Shared/global';

let pageTitle = '개인정보 처리방침';

export default class Policy extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container>
                <LoginHeader title={pageTitle}/>
                <Content style={[base.whiteBg , {paddingLeft: 15 , paddingRight: 15 , paddingTop: 20 , paddingBottom: 15}]}>
                    <View>
                        <View>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                {"<"}여유공간{">"}('www.spare-space.co.kr'이하 '여유공간')은(는)
                                개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을
                                보호하고 개인정보와 관련한 이용자의 고충을 원할하게 처리할
                                수 있도록 다음과 같은 처리방침을 두고 있습니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                            {"<"}여유공간{">"}('여유공간')은(는) 회사는 개인정보처리방침을
                                개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여
                                공지할 것입니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                ※ 본 방침은부터 2019년 11월 1일부터 시행됩니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyMedium , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                1. 개인정보의 처리 목적
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                            {"<"}여유공간{">"}('www.spare-space.co.kr'이하'여유공간')은
                                (는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인
                                정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용
                                목적이 변경될 시에는 사전동의를 구할 예정입니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                        <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>가. 홈페이지 회원가입 및 관리</Text>
                        </View>
                        <View style={{marginTop: 12}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별-인증,
                                회원자격 유지-관리, 제한적 본인확인제 시행에 따른 본인확인,
                                서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시
                                법정대리인 동의 여부 확인, 각종 고지-통지, 고충처리, 분쟁
                                조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
                            </Text>
                        </View>
                        <View  style={{marginTop: 20}}>
                        <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]} >나. 민원사무 처리</Text>
                        </View>
                        <View style={{marginTop: 12}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락-
                                통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                        <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>다. 재화 또는 서비스 제공</Text>
                        </View>
                        <View style={{marginTop: 12}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                물품배송, 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공,
                                본인인증, 연령인증, 요금결제-정산 등을 목적으로 개인정보를
                                처리합니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>라. 마케팅 및 광고에의 활용</Text>
                        </View>
                        <View style={{marginTop: 12}}>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a'}]}>
                                신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성
                                정보 제공 및 참여기회 제공 , 인구통계학적 특성에 따른 서비스
                                제공 및 광고 게재 , 서비스의 유효성 확인, 접속빈도 파악 또는
                                회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를
                                처리합니다.
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyMedium , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                2. 개인정보 파일 현황
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                1. 개인정보 파일명 : 여유공간 개인정보처리방침
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 개인정보 항목 : 이메일, 휴대전화번호, 자택주소, 로그인ID,
                                생년월일, 이름, 신용카드정보, 은행계좌정보, 서비스 이용
                                기록, 접속 로그, 결제기록
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 수집방법 : 홈페이지, 배송요청
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 보유근거 : 업무처리 및 분쟁조정을 위함
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 보유기간 : 3년
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3
                                년, 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년, 대금결제
                                및 재화 등의 공급에 관한 기록 : 5년, 계약 또는 청약철회 등에
                                관한 기록 : 5년
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                3. 개인정보의 처리 및 보유 기간
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① {"<"}여유공간{">"}('여유공간')은(는) 법령에 따른 개인정보 보유
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                •이용기간 또는 정보주체로부터 개인정보를 수집시에 동의
                                받은 개인정보 보유,이용기간 내에서 개인정보를
                                처리,보유합니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                1.{"<"}제화 또는 서비스 제공{">"}
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                {"<"}제화 또는 서비스 제공{">"}와 관련한 개인정보는 수집.이용에
                                관한 동의일로부터{"<"}1년{">"}까지 위 이용목적을 위하여
                                보유.이용됩니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                -보유근거 : 업무처리 및 분쟁조정을 위함
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                -관련법령 :
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                1)대금결제 및 재화 등의 공급에 관한 기록 : 5년
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                2) 계약 또는 청약철회 등에 관한 기록 : 5년
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                -예외사유 : 고객의 요청이 있는 경우
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                4. 개인정보의 제3자 제공에 관한 사항
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① {"<"}여유공간{">"}('www.spare-space.co.kr'이하
                                '여유공간')은(는) 정보주체의 동의, 법률의 특별한 규정 등
                                개인정보 보호법 제17조 및 제18조에 해당하는 경우에만
                                개인정보를 제3자에게 제공합니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ② {"<"}여유공간{">"}('www.spare-space.co.kr')은(는) 다음과
                                같이 개인정보를 제3자에게 제공하고 있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                1. {"<"}배송 위탁업체{">"}
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 개인정보를 제공받는 자 : 배송 위탁업체
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 제공받는 자의 개인정보 이용목적 : 휴대전화번호,
                                자택주소, 이름
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 제공받는 자의 보유.이용기간: 지체없이 파기
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                5. 개인정보처리 위탁
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① {"<"}여유공간{">"}('여유공간')은(는) 원활한 개인정보
                                업무처리를 위하여 다음과 같이 개인정보 처리업무를
                                위탁하고 있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                1. {"<"}배송 위탁업체{">"}
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 위탁받는 자 (수탁자) : CJ대한통운
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 위탁하는 업무의 내용 : 물품배송 또는 청구서 등 발송
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 위탁기간 : 1년
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ② {"<"}여유공간{">"}('www.spare-space.co.kr'이하
                                '여유공간')은(는) 위탁계약 체결시 개인정보 보호법 제25
                                조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적
                                ․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독,
                                손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고,
                                수탁자가 개인정보를 안전하게 처리하는지를 감독하고
                                있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이
                                본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                6. 정보주체와 법정대리인의 권리•의무 및 그 행사방법
                            </Text>
                            <Text style={[fonts.familyBold , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수
                                있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① 정보주체는 여유공간에 대해 언제든지 개인정보
                                열람,정정,삭제,처리정지 요구 등의 권리를 행사할 수
                                있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ② 제1항에 따른 권리 행사는 여유공간에 대해 개인정보
                                보호법 시행령 제41조제1항에 따라 서면, 전자우편,
                                모사전송(FAX) 등을 통하여 하실 수 있으며 여유공간은(는)
                                이에 대해 지체 없이 조치하겠습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나
                                위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우
                                개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을
                                제출하셔야 합니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35
                                조 제5항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될
                                수 있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그
                                개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를
                                요구할 수 없습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ⑥ 여유공간은(는) 정보주체 권리에 따른 열람의 요구, 정정•
                                삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가
                                본인이거나 정당한 대리인인지를 확인합니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                7. 처리하는 개인정보의 항목 작성
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① {"<"}여유공간{">"}('www.spare-space.co.kr'이하
                                '여유공간')은(는) 다음의 개인정보 항목을 처리하고
                                있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                1{"<"}재화 또는 서비스 제공{">"}
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                - 필수항목 : 이메일, 휴대전화번호, 자택주소, 로그인ID,
                                생년월일, 이름, 신용카드정보, 서비스 이용 기록, 접속 로그,
                                결제기록
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                8. 개인정보의 파기{"<"}여유공간{">"}('여유공간')은(는) 원칙적으로
                                개인정보 처리목적이 달성된 경우에는 지체없이 해당
                                개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과
                                같습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                -파기절차
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                이용자가 입력한 정보는 목적 달성 후 별도의 DB에
                                옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련
                                법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때,
                                DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는
                                다른 목적으로 이용되지 않습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                -파기기한
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                이용자의 개인정보는 개인정보의 보유기간이 경과된
                                경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의
                                처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그
                                개인정보가 불필요하게 되었을 때에는 개인정보의 처리가
                                불필요한 것으로 인정되는 날로부터 5일 이내에 그
                                개인정보를 파기합니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                -파기방법
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
                                방법을 사용합니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                9. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                여유공간 은 정보주체의 이용정보를 저장하고 수시로
                                불러오는 ‘쿠키’를 사용하지 않습니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                10. 개인정보 보호책임자 작성
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ① 여유공간(‘www.spare-space.co.kr’이하 ‘여유공간)
                                은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제
                                등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
                                있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                ▶ 개인정보 보호책임자
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                성명 :정하섭
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                직책 :대표이사
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                직급 :대표이사
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                연락처 :031-342-8811, spare-space@naver.com
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ※ 개인정보 보호 담당부서로 연결됩니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                ② 정보주체께서는 여유공간(‘www.spare-space.co.kr’
                                이하 ‘여유공간) 의 서비스(또는 사업)을 이용하시면서 발생한
                                모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한
                                사항을 개인정보 보호책임자 및 담당부서로 문의하실 수
                                있습니다. 여유공간(‘www.spare-space.co.kr’이하
                                ‘여유공간) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및
                                처리해드릴 것입니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                11. 개인정보 처리방침 변경
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                ①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및
                                방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
                                변경사항의 시행 7일 전부터 공지사항을 통하여 고지할
                                것입니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={[fonts.familyBold , fonts.size13 , {lineHeight: 24, color: '#177a7a'}]}>
                                12. 개인정보의 안전성 확보 조치 {"<"}여유공간
                                {">"}('여유공간')은(는) 개인정보보호법 제29조에 따라 다음과
                                같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를
                                하고 있습니다.
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                1. 정기적인 자체 감사 실시
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1
                                회)으로 자체 감사를 실시하고 있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                2. 개인정보의 암호화
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                이용자의 개인정보는 비밀번호는 암호화 되어 저장 및
                                관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일
                                및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는
                                등의 별도 보안기능을 사용하고 있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                3. 접속기록의 보관 및 위변조 방지
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관,
                                관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지
                                않도록 보안기능 사용하고 있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                4. 개인정보에 대한 접근 제한
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의
                                부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여
                                필요한 조치를 하고 있으며 침입차단시스템을 이용하여
                                외부로부터의 무단 접근을 통제하고 있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                5. 문서보안을 위한 잠금장치 사용
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는
                                안전한 장소에 보관하고 있습니다.
                            </Text>

                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5 , marginTop: 15}]}>
                                6. 비인가자에 대한 출입 통제
                            </Text>
                            <Text style={[fonts.familyMedium , fonts.size12 , {lineHeight: 24, color: '#177a7a' , marginLeft: 5}]}>
                                개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고
                                이에 대해 출입통제 절차를 수립, 운영하고 있습니다.
                            </Text>
                        </View>

                        <View style={{marginTop: 50}}>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

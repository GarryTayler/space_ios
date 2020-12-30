import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Container, Content , Item, Input , Text , Button, Form} from 'native-base';
import { base , form , elements , Image_Icon, fonts } from '../../assets/styles';
import UserHeader from './../Shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { _e } from '../../lang';
import {performNetwork, showToast} from './../Shared/global';
// import IMP from 'iamport-react-native';
import Loading from './../Shared/Loading';
let pageTitle = '본인인증';

const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    company: '아임포트',
    name: '홍길동',
    phone: '01012341234',
    min_age: '',
};

export default class Certificate extends React.Component {
    constructor(props) {
        super(props);
    }

    callback(response) {
    }
    
    render() {
        return (
            
                // <IMP.Certification
                //     userCode="imp10391932"
                //     loading={<Loading />}
                //     data={ data }
                //     callback={response => this.callback(response) } // navigation.replace('CertificationResult', { response })}
                // />
                
            // <Container>
            //     <UserHeader title={pageTitle} />                
            //     <Content style={ base.whiteBg }>
            //         <IMP.Certification
            //         userCode={'imp87402411'}    // 가맹점 식별코드
            //         loading={<Loading />}   // 웹뷰 로딩 컴포넌트
            //         data={data}             // 본인인증 데이터
            //         callback={this.callback}     // 본인인증 종료 후 콜백
            //         />
            //     </Content>
            // </Container>
        );
    }
}

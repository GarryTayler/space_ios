import React from 'react';
import {Toast} from 'native-base';
import {_e} from '../../lang';

import { logOut } from '../../actions';
import {Actions} from 'react-native-router-flux';
import { func } from 'prop-types';

export function showToast(text = '', type = 'danger', position = 'bottom') {
    Toast.show({
        text: (text == '') ? _e.connectionError : text,
        type: type,
        textStyle: {fontFamily: 'NotoSansCJKkr-Medium', textAlign: 'center'},
        position: position,
        duration: 4000,
    });
}

export function performNetwork(comp, homeComp, promise, isFromHome = false) {
    comp.setState({loaded: false});
    return promise.then(response => {
        comp.setState({loaded: true});
        if (response.is_logout && homeComp) {
            homeComp.logout(isFromHome);
            return response;
        }

        if (response.status == 'fail') {
            showToast(response.errMsg);
            return;
        }

        return response;
    }).catch(err => {
        comp.setState({loaded: true});
        showToast();
    });
}

export var global_variable = {
    device_id: ""
}

export function number_format(num)
{
    var num = parseFloat(num);
    if( isNaN(num) ) return "0";
    if(num == 0) return 0;
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (num + '');
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
    return n;
}

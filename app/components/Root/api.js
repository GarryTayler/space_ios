import {BACKEND_URL} from '../../constants';

let base_url = BACKEND_URL;
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function createCall(path, data = null, token = null, headers = {}, method = 'POST') {
    const merged = {
        ..._headers,
        ...headers,
    };

    let body = {};
    if (data) {
        body = {
            ...body,
            ...data,
        };
    }
    if (token) {
        body.api_token = token;
    }
    let strData = JSON.stringify({data: body});

    return fetch(
        `${base_url}${path}`, {
            method,
            headers: merged,
            body: strData,
        },
    ).then((resp) => resp.json());
}

/* user */
export function user_signin(email, password, player_id) {
    return createCall(
        'user/signin',
        {email, password, player_id},
    );
}

export function user_signup(email, userid, password, mobile , player_id) {
    return createCall(
        'user/signup',
        {email, userid, password, mobile , player_id},
    );
}

export function find_password(email, mobile) {
    return createCall(
        'user/find_password',
        {email, mobile},
    );
}

export function change_password(api_token, new_password) {
    return createCall(
        'user/change_password',
        {new_password},
        api_token,
    );
}

export function update_userinfo(api_token, userid, email, detail_addr, addr1, addr2, mobile) {
    return createCall(
        'mypage/update_userinfo',
        {userid, email, detail_addr, addr1, addr2, mobile},
        api_token,
    );
}

export function modify_password(api_token, cur_password, new_password) {
    return createCall(
        'mypage/modify_password',
        {cur_password, new_password},
        api_token,
    );
}

export function update_cardinfo(api_token, card_num, card_mm, card_yy, card_pwd, card_birth_no) {
    return createCall(
        'mypage/update_cardinfo',
        {card_num, card_mm, card_yy, card_pwd, card_birth_no},
        api_token,
    );
}

export function register_address(api_token, addr1, addr2, detail_addr) {
    return createCall(
        'user/register_address',
        {addr1, addr2, detail_addr},
        api_token,
    );
}

export function user_sns_signup(userid, mobile, uniqueid) {
    return createCall(
        'user/sns_signup',
        {userid, mobile, uniqueid},
    );
}

export function user_sendcode(mobile) {
    return createCall(
        'user/sendcode',
        {mobile},
    );
}

export function user_verifycode(mobile, verify_code) {
    return createCall(
        'user/verifycode',
        {mobile, verify_code},
    );
}

export function get_coupon_list(api_token) {
    return createCall(
        'mypage/get_coupon_list',
        null,
        api_token,
    );
}

export function get_transaction_history(api_token) {
    return createCall(
        'mypage/get_transaction_history',
        null,
        api_token,
    );
}

export function get_cardinfo(api_token) {
    return createCall(
        'mypage/get_cardinfo',
        null,
        api_token,
    );
}

// util
export function get_inquiry_list(api_token) {
    return createCall(
        'util/get_inquiry_list',
        null,
        api_token,
    );
}

export function create_inquiry(api_token, title, contents) {
    return createCall(
        'util/create_inquiry',
        {title, contents},
        api_token,
    );
}

export function get_faq_list() {
    return createCall('util/get_faq_list');
}

export function get_notice_list(uniqueID) {
    return createCall('util/get_notice_list', {uniqueID});
}

export function get_estimate_list(api_token) {
    return createCall(
        'util/get_estimate_list',
        null,
        api_token,
    );
}

export function create_estimate(api_token, name, contact, contents) {
    return createCall(
        'util/create_estimate',
        {name, contact, contents},
        api_token,
    );
}

export function get_estimate_info(api_token, ID) {
    return createCall(
        'util/get_estimate_info',
        {ID},
        api_token,
    );
}

// service
export function getHomeData(api_token) {
    return createCall(
        'service/getHomeData',
        null,
        api_token,
    );
}

export function getBoxList() {
    return createCall('service/getBoxList');
}

export function request(api_token, space_list, space_cost, main_cost, discount, cost, coupon, desc, addr1, addr2, detail_addr, card_num, card_mm, card_yy, card_birth_no, card_pwd, is_thing_check) {
    return createCall(
        'service/request',
        {
            space_list: space_list,
            space_cost: space_cost,
            main_cost: main_cost,
            discount: discount,
            cost: cost,
            coupon: coupon,
            desc: desc,
            addr1: addr1,
            addr2: addr2,
            detail_addr: detail_addr,
            card_num: card_num,
            card_mm: card_mm,
            card_yy: card_yy,
            card_birth_no: card_birth_no,
            card_pwd: card_pwd,
            isThingCheck : is_thing_check
        },
        api_token,
    );
}

export function get_available_box_list(api_token) {
    return createCall(
        'service/get_available_box_list',
        null,
        api_token,
    );
}

export function get_goods_list(api_token, box_id) {
    return createCall(
        'service/get_goods_list',
        {box_id},
        api_token,
    );
}

export function get_boxstorage_info(api_token) {
    return createCall(
        'service/get_boxstorage_info',
        null,
        api_token,
    );
}

export function return_request(api_token, request_id, request_date,request_time) {
    return createCall(
        'service/return_request',
        {request_id, request_date,request_time},
        api_token,
    );
}

export function get_time_list(api_token, request_date) {
    return createCall(
        'service/get_time_list',
        {request_date},
        api_token,
    );
}

export function cancel_request(api_token, request_id) {
    return createCall(
        'service/cancel_request',
        {request_id},
        api_token,
    );
}

export function storage_detail_info(api_token, box_id) {
    return createCall(
        'service/storage_detail_info',
        {box_id},
        api_token,
    );
}

export function finish_good(api_token, good_ids, box_id, cost, desc, addr1, addr2, detail_addr, card_num, card_mm, card_yy, card_birth_no, card_pwd) {
    return createCall(
        'service/finish_good',
        {addr1, addr2, detail_addr, cost, card_num, card_mm, card_yy, card_birth_no, card_pwd, good_ids, box_id, desc},
        api_token,
    );
}

export function get_empty_box(api_token) {
    return createCall(
        'service/get_empty_box',
        null,
        api_token,
    );
}

export function restore_in_period(api_token, cost, desc, addr1, addr2, detail_addr, card_num, card_mm, card_yy, card_birth_no, card_pwd, box_id) {
    return createCall(
        'service/restore_in_period',
        {addr1, addr2, detail_addr, cost, card_num, card_mm, card_yy, card_birth_no, card_pwd, desc, box_id},
        api_token,
    );
}

export function finish(api_token, addr1, addr2, detail_addr, box_id, desc, card_num, card_mm, card_yy, card_birth_no, card_pwd) {
    return createCall(
        'service/finish',
        {api_token, addr1, addr2, detail_addr, box_id, desc, card_num, card_mm, card_yy, card_birth_no, card_pwd},
        api_token,
    );
}

export function remove_account(api_token) {
    return createCall(
        'service/remove_account',
        null,
        api_token,
    );
}

export function check_sns(user_type , social_id, player_id) {
    return createCall(
        'user/check_sns',
        {user_type, social_id, player_id},
    );
}
export function sms_signup(user_type , social_id , email , userid , mobile, player_id) {
    return createCall(
        'user/sns_signup',
        {user_type, social_id , email , userid , mobile, player_id},
    );
}

export function log_out(api_token) {
    return createCall(
        'user/log_out',
        null,
        api_token,
    );
}

export function get_bank_list() {
    return createCall('mypage/get_bank_list');
}

export function register_refund_account(api_token, bank_id, deposit_owner_name, account_number) {
    return createCall(
        'mypage/register_refund_account',
        { bank_id, deposit_owner_name, account_number },
        api_token,
    );
}

export function get_refund_info(api_token) {
    return createCall(
        'mypage/get_refund_info',
        null,
        api_token,
    );
}

export function get_notice(deviceID) {
    return createCall(
        'user/get_notice',
        {deviceID},
        null,
    );
}

export function good_restore(api_token, good_ids, box_id, cost, desc, addr1, addr2, detail_addr, card_num, card_mm, card_yy, card_birth_no, card_pwd) {
    return createCall(
        'service/good_restore',
        {addr1, addr2, detail_addr, cost, card_num, card_mm, card_yy, card_birth_no, card_pwd, good_ids, box_id, desc},
        api_token,
    );
}

export function request_extended_payment(api_token, card_num, card_mm, card_yy, card_birth_no, card_pwd, box_id, months, cost, desc, coupon) {
    return createCall(
        'service/request_extended_payment',
        {card_num, card_mm, card_yy, card_birth_no, card_pwd, box_id, months, cost, desc, coupon},
        api_token,
    );
}
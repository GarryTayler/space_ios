import { 
    SET_USER
} from "../actionTypes";
const initialState = {
    userid: null,
    email: null,
    mobile: null,
    addr1: null,
    addr2: null,
    detail_addr: null,
    username: null,
    userno: null,
    apiToken : null,
    push_flag: null,
    user_type: null,
    device_id: null
}
export default user = (state = initialState , action = {}) => {
    switch (action.type) {
        case SET_USER:
            const { user } = action;
            return {
                userid: user.userid,
                email: user.email,
                mobile: user.mobile,
                addr1: user.addr1,
                addr2: user.addr2,
                detail_addr: user.detail_addr,
                username: user.username,
                userno: user.userno,
                apiToken: user.apiToken,
                push_flag: user.push_flag,
                user_type: user.user_type,
                device_id: user.device_id
            }
            break;
        default:
            return state;
    }
}
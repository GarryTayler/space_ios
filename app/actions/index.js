import * as actions from './../actionTypes';

export const setUser = (user) => ({
    type: actions.SET_USER,
    user: user
});

export const logOut = (state) => ({
    type: "USER_LOGOUT" ,
    state: state
})

// 보관함
export const addSaveBoxData = (boxData) => ({
    type: actions.ADD_SAVE_BOX_DATA,
    boxData: boxData
});
export const updateSaveBoxDataItem = (boxData) => ({
    type: actions.UPDATE_SAVE_BOX_DATA_ITEM,
    boxData: boxData
});
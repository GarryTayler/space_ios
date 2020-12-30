import * as actions from "../actionTypes";

const initialState = [];

export default arrSaveBoxData = (state = initialState , action = {}) => {
    const { boxData } = action;

    switch (action.type) {
        case actions.ADD_SAVE_BOX_DATA:
            return [...state, {
                id: boxData.id,
                title: boxData.title,
                arrItem: boxData.arrItem
            }];

        case actions.UPDATE_SAVE_BOX_DATA_ITEM:
            var updatedArray = [];
            state.forEach(data => {
                updatedArray.push(data.id == boxData.id ? {
                    id: data.id,
                    title: boxData.updatedTitle,
                    arrItem: boxData.updatedArrItem
                } : data);
            });
            return updatedArray;

        default:
            return state;
    }
}
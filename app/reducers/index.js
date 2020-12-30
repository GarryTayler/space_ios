import user from './userReducer';
import network from './network';
import arrSaveBoxData from './saveBoxDataReducer';

// console.disableYellowBox = true;

const rehydrated = (state = false , action) => {
    switch (action.type) {
        case "persist/REHYDRATE" :
            return true;
            break;
        default:
            return state;
    }
}

export default {
    network,
    rehydrated,
    user,
    arrSaveBoxData
};


import * as actionTypes from "../assets/actionTypes";

export function phoneNumbers(state = [], action) {
    switch (action.type) {

        case actionTypes.PHONE_NUMBERS_FETCH_DATA_SUCCESS:
            return action.phoneNumbers;

        case actionTypes.EDIT_PHONE_NUMBER:
            return state.map(phoneNumber => phoneNumber.id === action.phoneNumber.id ? Object.assign({}, action.phoneNumber) : phoneNumber)

        case actionTypes.ADD_PHONE_NUMBER:
            return [...state, action.phoneNumber]

        case actionTypes.DELETE_PHONE_NUMBER:
            return state.filter(phoneNumber => phoneNumber.id !== action.phoneNumberId)

        default: return state;
    }
}


import * as actionTypes from "../assets/actionTypes";

export function editPhoneNumber(phoneNumber) {
    return {
        type: actionTypes.EDIT_PHONE_NUMBER,
        phoneNumber
    };
}

export function addPhoneNumber(phoneNumber) {
    return {
        type: actionTypes.ADD_PHONE_NUMBER,
        phoneNumber
    };
}

export function deletePhoneNumber(phoneNumberId) {
    return {
        type: actionTypes.DELETE_PHONE_NUMBER,
        phoneNumberId
    };
}

export function phoneNumbersFetchDataSuccess(phoneNumbers) {
    return {
        type: actionTypes.PHONE_NUMBERS_FETCH_DATA_SUCCESS,
        phoneNumbers
    };
}






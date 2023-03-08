import * as actionTypes from "../assets/actionTypes";

export function editAddress(address) {
    return {
        type: actionTypes.EDIT_ADDRESS,
        address,
    };
}

export function addAddress(address) {
    return {
        type: actionTypes.ADD_ADDRESS,
        address,
    };
}

export function deleteAddress(addressId) {
    return {
        type: actionTypes.DELETE_ADDRESS,
        addressId,
    };
}

export function addressesFetchDataSuccess(addresses) {
    return {
        type: actionTypes.ADDRESSES_FETCH_DATA_SUCCESS,
        addresses,
    };
}

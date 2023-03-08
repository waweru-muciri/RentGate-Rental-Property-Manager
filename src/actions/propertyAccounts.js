import * as actionTypes from "../assets/actionTypes";

export function editPropertyAccount(propertyAccount) {
    return {
        type: actionTypes.EDIT_PROPERTY_ACCOUNT,
        propertyAccount,
    };
}

export function addPropertyAccount(propertyAccount) {
    return {
        type: actionTypes.ADD_PROPERTY_ACCOUNT,
        propertyAccount,
    };
}

export function deletePropertyAccount(propertyAccountId) {
    return {
        type: actionTypes.DELETE_PROPERTY_ACCOUNT,
        propertyAccountId,
    };
}

export function propertyAccountsFetchDataSuccess(propertyAccounts) {
    return {
        type: actionTypes.PROPERTY_ACCOUNTS_FETCH_DATA_SUCCESS,
        propertyAccounts,
    };
}

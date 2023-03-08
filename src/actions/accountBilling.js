import * as actionTypes from "../assets/actionTypes";

export function editAccountBilling(accountBilling) {
    return {
        type: actionTypes.EDIT_ACCOUNT_BILLING,
        accountBilling,
    };
}

export function addAccountBilling(accountBilling) {
    return {
        type: actionTypes.ADD_ACCOUNT_BILLING,
        accountBilling,
    };
}

export function deleteAccountBilling(accountBillingId) {
    return {
        type: actionTypes.DELETE_ACCOUNT_BILLING,
        accountBillingId,
    };
}

export function accountBillingsFetchDataSuccess(accountBillings) {
    return {
        type: actionTypes.ACCOUNT_BILLINGS_FETCH_DATA_SUCCESS,
        accountBillings,
    };
}

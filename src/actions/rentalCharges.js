import * as actionTypes from "../assets/actionTypes";

export function editTransactionCharge(transactionCharge) {
    return {
        type: actionTypes.EDIT_TRANSACTION_CHARGE,
        transactionCharge,
    };
}

export function addTransactionCharge(transactionCharge) {
    return {
        type: actionTypes.ADD_TRANSACTION_CHARGE,
        transactionCharge,
    };
}

export function deleteTransactionCharge(transactionChargeId) {
    return {
        type: actionTypes.DELETE_TRANSACTION_CHARGE,
        transactionChargeId,
    };
}

export function rentalChargesFetchDataSuccess(rentalCharges) {
    return {
        type: actionTypes.TRANSACTION_CHARGES_FETCH_DATA_SUCCESS,
        rentalCharges,
    };
}

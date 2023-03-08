import * as actionTypes from "../assets/actionTypes";

export function rentalPaymentsFetchDataSuccess(rentalPayments) {
    return {
        type: actionTypes.TRANSACTIONS_FETCH_DATA_SUCCESS,
        rentalPayments,
    };
}

export function deleteTransaction(transactionId) {
    return {
        type: actionTypes.DELETE_TRANSACTION,
        transactionId,
    };
}

export function addTransaction(transaction) {
    return {
        type: actionTypes.ADD_TRANSACTION,
        transaction,
    };
}

export function editTransaction(transaction) {
    return {
        type: actionTypes.EDIT_TRANSACTION,
        transaction,
    };
}

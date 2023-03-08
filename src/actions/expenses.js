import * as actionTypes from "../assets/actionTypes";

export function editExpense(expense) {
    return {
        type: actionTypes.EDIT_EXPENSE,
        expense,
    };
}

export function addExpense(expense) {
    return {
        type: actionTypes.ADD_EXPENSE,
        expense,
    };
}

export function deleteExpense(expenseId) {
    return {
        type: actionTypes.DELETE_EXPENSE,
        expenseId,
    };
}

export function expensesFetchDataSuccess(expenses) {
    return {
        type: actionTypes.EXPENSES_FETCH_DATA_SUCCESS,
        expenses,
    };
}

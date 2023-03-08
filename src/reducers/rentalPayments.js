import * as actionTypes from "../assets/actionTypes";

export function rentalPayments(state = [], action) {
    switch (action.type) {
        case actionTypes.TRANSACTIONS_FETCH_DATA_SUCCESS:
            return action.rentalPayments;

        case actionTypes.EDIT_TRANSACTION:
            return state.map((transaction) =>
                transaction.id === action.transaction.id
                    ? Object.assign({}, transaction, action.transaction)
                    : transaction
            );

        case actionTypes.ADD_TRANSACTION:
            return [...state, action.transaction];

        case actionTypes.DELETE_TRANSACTION:
            return state.filter(
                (transaction) => transaction.id !== action.transactionId
            );

        default:
            return state;
    }
}

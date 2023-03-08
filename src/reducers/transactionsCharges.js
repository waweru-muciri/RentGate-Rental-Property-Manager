import * as actionTypes from "../assets/actionTypes";

export function transactionsCharges(state = [], action) {
    switch (action.type) {
        case actionTypes.TRANSACTION_CHARGES_FETCH_DATA_SUCCESS:
            return action.transactionCharges;

        case actionTypes.EDIT_TRANSACTION_CHARGE:
            return state.map((transactionCharge) =>
                transactionCharge.id === action.transactionCharge.id
                    ? Object.assign({}, action.transactionCharge)
                    : transactionCharge
            );

        case actionTypes.ADD_TRANSACTION_CHARGE:
            return [...state, action.transactionCharge];

        case actionTypes.DELETE_TRANSACTION_CHARGE:
            return state.filter(
                (transactionCharge) => transactionCharge.id !== action.transactionChargeId
            );

        default:
            return state;
    }
}

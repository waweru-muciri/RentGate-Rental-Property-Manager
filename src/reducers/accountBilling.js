import * as actionTypes from "../assets/actionTypes";

export function accountBillings(state = [], action) {
    switch (action.type) {
        case actionTypes.ACCOUNT_BILLINGS_FETCH_DATA_SUCCESS:
            return action.accountBillings;

        case actionTypes.EDIT_ACCOUNT_BILLING:
            return state.map((accountBilling) =>
                accountBilling.id === action.accountBilling.id
                    ? Object.assign({}, accountBilling, action.accountBilling)
                    : accountBilling
            );

        case actionTypes.ADD_ACCOUNT_BILLING:
            return [...state, action.accountBilling];

        case actionTypes.DELETE_ACCOUNT_BILLING:
            return state.filter((accountBilling) => accountBilling.id !== action.accountBillingId);

        default:
            return state;
    }
}

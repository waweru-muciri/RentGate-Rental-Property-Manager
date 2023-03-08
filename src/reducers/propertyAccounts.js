import * as actionTypes from "../assets/actionTypes";

export function propertyAccounts(state = [], action) {
    switch (action.type) {
        case actionTypes.PROPERTY_ACCOUNTS_FETCH_DATA_SUCCESS:
            return action.propertyAccounts;

        case actionTypes.EDIT_PROPERTY_ACCOUNT:
            return state.map((propertyAccount) =>
                propertyAccount.id === action.propertyAccount.id
                    ? Object.assign({}, action.propertyAccount)
                    : propertyAccount
            );

        case actionTypes.ADD_PROPERTY_ACCOUNT:
            return [...state, action.propertyAccount];

        case actionTypes.DELETE_PROPERTY_ACCOUNT:
            return state.filter((propertyAccount) => propertyAccount.id !== action.propertyAccountId);

        default:
            return state;
    }
}

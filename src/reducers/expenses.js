import * as actionTypes from "../assets/actionTypes";

export function expenses(state = [], action) {
    switch (action.type) {
        case actionTypes.EXPENSES_FETCH_DATA_SUCCESS:
            return action.expenses;

        case actionTypes.EDIT_EXPENSE:
            return state.map((expense) =>
                expense.id === action.expense.id
                    ? Object.assign({}, action.expense)
                    : expense
            );

        case actionTypes.ADD_EXPENSE:
            return [...state, action.expense];

        case actionTypes.DELETE_EXPENSE:
            return state.filter((expense) => expense.id !== action.expenseId);

        default:
            return state;
    }
}

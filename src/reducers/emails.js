import * as actionTypes from "../assets/actionTypes";

export function emails(state = [], action) {
    switch (action.type) {
        case actionTypes.EMAILS_FETCH_DATA_SUCCESS:
            return action.emails;

        case actionTypes.EDIT_EMAIL:
            return state.map((email) =>
                email.id === action.email.id
                    ? Object.assign({}, action.email)
                    : email
            );

        case actionTypes.ADD_EMAIL:
            return [...state, action.email];

        case actionTypes.DELETE_EMAIL:
            return state.filter((email) => email.id !== action.emailId);

        default:
            return state;
    }
}

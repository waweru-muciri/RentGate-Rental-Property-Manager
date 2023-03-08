import * as actionTypes from "../assets/actionTypes";

export function communicationEmails(state = [], action) {
    switch (action.type) {
        case actionTypes.COMMUNICATION_EMAILS_FETCH_DATA_SUCCESS:
            return action.communicationEmails;

        case actionTypes.EDIT_COMMUNICATION_EMAIL:
            return state.map((communicationEmail) =>
                communicationEmail.id === action.communicationEmail.id
                    ? Object.assign({}, action.communicationEmail)
                    : communicationEmail
            );

        case actionTypes.ADD_COMMUNICATION_EMAIL:
            return [...state, action.communicationEmail];

        case actionTypes.DELETE_COMMUNICATION_EMAIL:
            return state.filter((communicationEmail) => communicationEmail.id !== action.communicationEmailId);

        default:
            return state;
    }
}

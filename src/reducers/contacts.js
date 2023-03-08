import * as actionTypes from "../assets/actionTypes";

export function contacts(state = [], action) {
    switch (action.type) {
        case actionTypes.CONTACTS_FETCH_DATA_SUCCESS:
            return action.contacts;

        case actionTypes.EDIT_CONTACT:
            return state.map((contact) =>
                contact.id === action.contact.id
                    ? Object.assign({}, contact, action.contact)
                    : contact
            );

        case actionTypes.ADD_CONTACT:
            return [...state, action.contact];

        case actionTypes.DELETE_CONTACT:
            return state.filter((contact) => contact.id !== action.contactId);

        default:
            return state;
    }
}

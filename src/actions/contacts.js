import * as actionTypes from "../assets/actionTypes";

export function contactsFetchDataSuccess(contacts) {
    return {
        type: actionTypes.CONTACTS_FETCH_DATA_SUCCESS,
        contacts,
    };
}

export function deleteContact(contactId) {
    return {
        type: actionTypes.DELETE_CONTACT,
        contactId,
    };
}

export function addContact(contact) {
    return {
        type: actionTypes.ADD_CONTACT,
        contact,
    };
}

export function editContact(contact) {
    return {
        type: actionTypes.EDIT_CONTACT,
        contact,
    };
}

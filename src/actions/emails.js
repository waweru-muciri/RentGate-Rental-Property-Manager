import * as actionTypes from "../assets/actionTypes";

export function editEmail(email) {
    return {
        type: actionTypes.EDIT_EMAIL,
        email
    };
}

export function addEmail(email) {
    return {
        type: actionTypes.ADD_EMAIL,
        email
    };
}

export function deleteEmail(emailId) {
    return {
        type: actionTypes.DELETE_EMAIL,
        emailId
    };
}

export function emailsFetchDataSuccess(emails) {
    return {
        type: actionTypes.EMAILS_FETCH_DATA_SUCCESS,
        emails
    };
}






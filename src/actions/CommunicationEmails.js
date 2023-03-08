import * as actionTypes from "../assets/actionTypes";

export function editCommunicationEmail(communicationEmail) {
    return {
        type: actionTypes.EDIT_COMMUNICATION_EMAIL,
        communicationEmail,
    };
}

export function addCommunicationEmail(communicationEmail) {
    return {
        type: actionTypes.ADD_COMMUNICATION_EMAIL,
        communicationEmail,
    };
}

export function deleteCommunicationEmail(communicationEmailId) {
    return {
        type: actionTypes.DELETE_COMMUNICATION_EMAIL,
        communicationEmailId,
    };
}

export function communicationEmailsFetchDataSuccess(communicationEmails) {
    return {
        type: actionTypes.COMMUNICATION_EMAILS_FETCH_DATA_SUCCESS,
        communicationEmails,
    };
}

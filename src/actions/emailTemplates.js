import * as actionTypes from "../assets/actionTypes";

export function editEmailTemplate(emailTemplate) {
    return {
        type: actionTypes.EDIT_EMAIL_TEMPLATE,
        emailTemplate,
    };
}

export function addEmailTemplate(emailTemplate) {
    return {
        type: actionTypes.ADD_EMAIL_TEMPLATE,
        emailTemplate,
    };
}

export function deleteEmailTemplate(emailTemplateId) {
    return {
        type: actionTypes.DELETE_EMAIL_TEMPLATE,
        emailTemplateId,
    };
}

export function emailTemplatesFetchDataSuccess(emailTemplates) {
    return {
        type: actionTypes.EMAIL_TEMPLATES_FETCH_DATA_SUCCESS,
        emailTemplates,
    };
}

import * as actionTypes from "../assets/actionTypes";

export function emailTemplates(state = [], action) {
    switch (action.type) {
        case actionTypes.EMAIL_TEMPLATES_FETCH_DATA_SUCCESS:
            return action.emailTemplates;

        case actionTypes.EDIT_EMAIL_TEMPLATE:
            return state.map((emailTemplate) =>
                emailTemplate.id === action.emailTemplate.id
                    ? Object.assign({}, emailTemplate, action.emailTemplate)
                    : emailTemplate
            );

        case actionTypes.ADD_EMAIL_TEMPLATE:
            return [...state, action.emailTemplate];

        case actionTypes.DELETE_EMAIL_TEMPLATE:
            return state.filter((emailTemplate) => emailTemplate.id !== action.emailTemplateId);

        default:
            return state;
    }
}

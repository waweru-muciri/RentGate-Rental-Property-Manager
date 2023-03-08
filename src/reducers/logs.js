import * as actionTypes from "../assets/actionTypes";

export function auditLogs(state = [], action) {
    switch (action.type) {
        case actionTypes.AUDIT_LOGS_FETCH_DATA_SUCCESS:
            return action.auditLogs;

        default:
            return state;
    }
}

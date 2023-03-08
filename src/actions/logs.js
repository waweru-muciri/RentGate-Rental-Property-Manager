import * as actionTypes from "../assets/actionTypes";

export function auditLogsFetchDataSuccess(auditLogs) {
    return {
        type: actionTypes.AUDIT_LOGS_FETCH_DATA_SUCCESS,
        auditLogs,
    };
}

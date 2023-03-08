import * as actionTypes from "../assets/actionTypes";

export function editAuditLog(auditLog) {
    return {
        type: actionTypes.EDIT_AUDIT_LOG,
        auditLog
    };
}

export function addAuditLog(auditLog) {
    return {
        type: actionTypes.ADD_AUDIT_LOG,
        auditLog
    };
}

export function deleteAuditLog(auditLogId) {
    return {
        type: actionTypes.DELETE_AUDIT_LOG,
        auditLogId
    };
}

export function auditLogsFetchDataSuccess(auditLogs) {
    return {
        type: actionTypes.AUDIT_LOGS_FETCH_DATA_SUCCESS,
        auditLogs
    };
}






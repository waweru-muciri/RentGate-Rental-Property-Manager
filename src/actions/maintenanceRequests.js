import * as actionTypes from "../assets/actionTypes";

export function editMaintenanceRequest(maintenanceRequest) {
    return {
        type: actionTypes.EDIT_MAINTENANCE_REQUEST,
        maintenanceRequest,
    };
}

export function addMaintenanceRequest(maintenanceRequest) {
    return {
        type: actionTypes.ADD_MAINTENANCE_REQUEST,
        maintenanceRequest,
    };
}

export function deleteMaintenanceRequest(maintenanceRequestId) {
    return {
        type: actionTypes.DELETE_MAINTENANCE_REQUEST,
        maintenanceRequestId,
    };
}

export function maintenanceRequestsFetchDataSuccess(maintenanceRequests) {
    return {
        type: actionTypes.MAINTENANCE_REQUESTS_FETCH_DATA_SUCCESS,
        maintenanceRequests,
    };
}

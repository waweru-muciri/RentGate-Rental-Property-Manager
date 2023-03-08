import * as actionTypes from "../assets/actionTypes";

export function managementFeesFetchDataSuccess(managementFees) {
    return {
        type: actionTypes.MANAGEMENT_FEES_FETCH_DATA_SUCCESS,
        managementFees,
    };
}

export function deleteManagementFee(managementFeeId) {
    return {
        type: actionTypes.DELETE_MANAGEMENT_FEE,
        managementFeeId,
    };
}

export function addManagementFee(managementFee) {
    return {
        type: actionTypes.ADD_MANAGEMENT_FEE,
        managementFee,
    };
}

export function editManagementFee(managementFee) {
    return {
        type: actionTypes.EDIT_MANAGEMENT_FEE,
        managementFee,
    };
}

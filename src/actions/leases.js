import * as actionTypes from "../assets/actionTypes";

export function editLease(lease) {
    return {
        type: actionTypes.EDIT_LEASE,
        lease,
    };
}

export function addLease(lease) {
    return {
        type: actionTypes.ADD_LEASE,
        lease,
    };
}

export function deleteLease(leaseId) {
    return {
        type: actionTypes.DELETE_LEASE,
        leaseId,
    };
}

export function leasesFetchDataSuccess(leases) {
    return {
        type: actionTypes.LEASES_FETCH_DATA_SUCCESS,
        leases,
    };
}

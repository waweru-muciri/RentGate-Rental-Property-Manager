import * as actionTypes from "../assets/actionTypes";

export function editFax(fax) {
    return {
        type: actionTypes.EDIT_FAX,
        fax
    };
}

export function addFax(fax) {
    return {
        type: actionTypes.ADD_FAX,
        fax
    };
}

export function deleteFax(faxId) {
    return {
        type: actionTypes.DELETE_FAX,
        faxId
    };
}

export function faxesFetchDataSuccess(faxes) {
    return {
        type: actionTypes.FAXES_FETCH_DATA_SUCCESS,
        faxes
    };
}






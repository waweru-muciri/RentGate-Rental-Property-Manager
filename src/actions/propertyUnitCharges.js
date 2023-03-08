import * as actionTypes from "../assets/actionTypes";

export function editPropertyUnitCharge(propertyUnitCharge) {
    return {
        type: actionTypes.EDIT_PROPERTY_UNIT_CHARGE,
        propertyUnitCharge,
    };
}

export function addPropertyUnitCharge(propertyUnitCharge) {
    return {
        type: actionTypes.ADD_PROPERTY_UNIT_CHARGE,
        propertyUnitCharge,
    };
}

export function deletePropertyUnitCharge(propertyUnitChargeId) {
    return {
        type: actionTypes.DELETE_PROPERTY_UNIT_CHARGE,
        propertyUnitChargeId,
    };
}

export function propertyUnitChargesFetchDataSuccess(propertyUnitCharges) {
    return {
        type: actionTypes.PROPERTY_UNIT_CHARGES_FETCH_DATA_SUCCESS,
        propertyUnitCharges,
    };
}

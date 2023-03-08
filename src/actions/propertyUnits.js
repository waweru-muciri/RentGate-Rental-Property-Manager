import * as actionTypes from "../assets/actionTypes";

export function editPropertyUnit(propertyUnit) {
    return {
        type: actionTypes.EDIT_PROPERTY_UNIT,
        propertyUnit,
    };
}

export function addPropertyUnit(propertyUnit) {
    return {
        type: actionTypes.ADD_PROPERTY_UNIT,
        propertyUnit,
    };
}

export function deletePropertyUnit(propertyUnitId) {
    return {
        type: actionTypes.DELETE_PROPERTY_UNIT,
        propertyUnitId,
    };
}

export function propertyUnitsFetchDataSuccess(propertyUnits) {
    return {
        type: actionTypes.PROPERTY_UNITS_FETCH_DATA_SUCCESS,
        propertyUnits,
    };
}

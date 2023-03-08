import * as actionTypes from "../assets/actionTypes";

export function propertiesFetchDataSuccess(properties) {
    return {
        type: actionTypes.PROPERTIES_FETCH_DATA_SUCCESS,
        properties,
    };
}

export function deleteProperty(propertyId) {
    return {
        type: actionTypes.DELETE_PROPERTY,
        propertyId,
    };
}

export function addProperty(property) {
    return {
        type: actionTypes.ADD_PROPERTY,
        property,
    };
}

export function editProperty(property) {
    return {
        type: actionTypes.EDIT_PROPERTY,
        property,
    };
}

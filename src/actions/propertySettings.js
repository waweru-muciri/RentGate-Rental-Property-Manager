import * as actionTypes from "../assets/actionTypes";

export function editPropertySetting(propertySetting) {
    return {
        type: actionTypes.EDIT_PROPERTY_SETTING,
        propertySetting,
    };
}

export function addPropertySetting(propertySetting) {
    return {
        type: actionTypes.ADD_PROPERTY_SETTING,
        propertySetting,
    };
}

export function deletePropertySetting(propertySettingId) {
    return {
        type: actionTypes.DELETE_PROPERTY_SETTING,
        propertySettingId,
    };
}

export function propertySettingsFetchDataSuccess(propertySettings) {
    return {
        type: actionTypes.PROPERTY_SETTINGS_FETCH_DATA_SUCCESS,
        propertySettings,
    };
}

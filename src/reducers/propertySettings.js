import * as actionTypes from "../assets/actionTypes";

export function propertySettings(state = [], action) {
    switch (action.type) {
        case actionTypes.PROPERTY_SETTINGS_FETCH_DATA_SUCCESS:
            return action.propertySettings;

        case actionTypes.EDIT_PROPERTY_SETTING:
            return state.map((propertySetting) =>
                propertySetting.id === action.propertySetting.id ? Object.assign({}, propertySetting, action.propertySetting) : propertySetting
            );

        case actionTypes.ADD_PROPERTY_SETTING:
            return [...state, action.propertySetting];

        case actionTypes.DELETE_PROPERTY_SETTING:
            return state.filter((propertySetting) => propertySetting.id !== action.propertySettingId);

        default:
            return state;
    }
}

import * as actionTypes from "../assets/actionTypes";

export function propertyUnitCharges(state = [], action) {
    switch (action.type) {
        case actionTypes.PROPERTY_UNIT_CHARGES_FETCH_DATA_SUCCESS:
            return action.propertyUnitCharges;

        case actionTypes.EDIT_PROPERTY_UNIT_CHARGE:
            return state.map((propertyUnitCharge) =>
                propertyUnitCharge.id === action.propertyUnitCharge.id
                    ? Object.assign({}, action.propertyUnitCharge)
                    : propertyUnitCharge
            );

        case actionTypes.ADD_PROPERTY_UNIT_CHARGE:
            return [...state, action.propertyUnitCharge];

        case actionTypes.DELETE_PROPERTY_UNIT_CHARGE:
            return state.filter((propertyUnitCharge) => propertyUnitCharge.id !== action.propertyUnitChargeId);

        default:
            return state;
    }
}

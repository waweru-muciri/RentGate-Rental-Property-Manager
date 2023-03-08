import * as actionTypes from "../assets/actionTypes";

export function propertyUnits(state = [], action) {
    switch (action.type) {
        case actionTypes.PROPERTY_UNITS_FETCH_DATA_SUCCESS:
            return action.propertyUnits;

        case actionTypes.EDIT_PROPERTY_UNIT:
            return state.map((propertyUnit) =>
                propertyUnit.id === action.propertyUnit.id
                    ? Object.assign({}, action.propertyUnit)
                    : propertyUnit
            );

        case actionTypes.ADD_PROPERTY_UNIT:
            return [...state, action.propertyUnit];

        case actionTypes.DELETE_PROPERTY_UNIT:
            return state.filter((propertyUnit) => propertyUnit.id !== action.propertyUnitId);

        default:
            return state;
    }
}

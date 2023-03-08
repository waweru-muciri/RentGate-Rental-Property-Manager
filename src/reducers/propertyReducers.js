import * as actionTypes from "../assets/actionTypes";

export function properties(state = [], action) {
    switch (action.type) {
        case actionTypes.PROPERTIES_FETCH_DATA_SUCCESS:
            return action.properties;

        case actionTypes.EDIT_PROPERTY:
            return state.map((property) =>
                property.id === action.property.id
                    ? Object.assign({}, property, action.property)
                    : property
            );

        case actionTypes.ADD_PROPERTY:
            return [...state, action.property];

        case actionTypes.DELETE_PROPERTY:
            return state.filter(
                (property) => property.id !== action.propertyId
            );

        default:
            return state;
    }
}

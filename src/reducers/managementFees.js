import * as actionTypes from "../assets/actionTypes";

export function managementFees(state = [], action) {
    switch (action.type) {
        case actionTypes.MANAGEMENT_FEES_FETCH_DATA_SUCCESS:
            return action.managementFees;

        case actionTypes.EDIT_MANAGEMENT_FEE:
            return state.map((managementFees) =>
                managementFees.id === action.managementFees.id
                    ? Object.assign({}, managementFees, action.managementFees)
                    : managementFees
            );

        case actionTypes.ADD_MANAGEMENT_FEE:
            return [...state, action.managementFees];

        case actionTypes.DELETE_MANAGEMENT_FEE:
            return state.filter(
                (managementFees) => managementFees.id !== action.managementFeesId
            );

        default:
            return state;
    }
}

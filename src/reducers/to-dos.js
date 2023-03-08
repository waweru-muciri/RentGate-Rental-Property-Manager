import * as actionTypes from "../assets/actionTypes";

export function to_dos(state = [], action) {
    switch (action.type) {
        case actionTypes.TO_DOS_FETCH_DATA_SUCCESS:
            return action.to_dos;

        case actionTypes.EDIT_TO_DO:
            return state.map((to_do) =>
                to_do.id === action.to_do.id
                    ? Object.assign({}, action.to_do)
                    : to_do
            );

        case actionTypes.ADD_TO_DO:
            return [...state, action.to_do];

        case actionTypes.DELETE_TO_DO:
            return state.filter((to_do) => to_do.id !== action.to_doId);

        default:
            return state;
    }
}

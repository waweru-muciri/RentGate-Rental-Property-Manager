import * as actionTypes from "../assets/actionTypes";

export function faxes(state = [], action) {
    switch (action.type) {
        case actionTypes.FAXES_FETCH_DATA_SUCCESS:
            return action.faxes;

        case actionTypes.EDIT_FAX:
            return state.map((fax) =>
                fax.id === action.fax.id ? Object.assign({}, action.fax) : fax
            );

        case actionTypes.ADD_FAX:
            return [...state, action.fax];

        case actionTypes.DELETE_FAX:
            return state.filter((fax) => fax.id !== action.faxId);

        default:
            return state;
    }
}

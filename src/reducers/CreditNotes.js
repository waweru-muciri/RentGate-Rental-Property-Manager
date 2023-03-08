import * as actionTypes from "../assets/actionTypes";

export function creditNotes(state = [], action) {
    switch (action.type) {
        case actionTypes.CREDIT_NOTES_FETCH_DATA_SUCCESS:
            return action.creditNotes;

        case actionTypes.EDIT_CREDIT_NOTE:
            return state.map((creditNote) =>
                creditNote.id === action.creditNote.id
                    ? Object.assign({}, creditNote, action.creditNote)
                    : creditNote
            );

        case actionTypes.ADD_CREDIT_NOTE:
            return [...state, action.creditNote];

        case actionTypes.DELETE_CREDIT_NOTE:
            return state.filter((creditNote) => creditNote.id !== action.creditNoteId);

        default:
            return state;
    }
}

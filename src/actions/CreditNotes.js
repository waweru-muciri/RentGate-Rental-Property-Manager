import * as actionTypes from "../assets/actionTypes";

export function editCreditNote(creditNote) {
    return {
        type: actionTypes.EDIT_CREDIT_NOTE,
        creditNote,
    };
}

export function addCreditNote(creditNote) {
    return {
        type: actionTypes.ADD_CREDIT_NOTE,
        creditNote,
    };
}

export function deleteCreditNote(creditNoteId) {
    return {
        type: actionTypes.DELETE_CREDIT_NOTE,
        creditNoteId,
    };
}

export function creditNotesFetchDataSuccess(creditNotes) {
    return {
        type: actionTypes.CREDIT_NOTES_FETCH_DATA_SUCCESS,
        creditNotes,
    };
}

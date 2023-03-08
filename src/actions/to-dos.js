import * as actionTypes from "../assets/actionTypes";

export function editToDo(toDo) {
    return {
        type: actionTypes.EDIT_TO_DO,
        toDo,
    };
}

export function addToDo(toDo) {
    return {
        type: actionTypes.ADD_TO_DO,
        toDo,
    };
}

export function deleteToDo(toDoId) {
    return {
        type: actionTypes.DELETE_TO_DO,
        toDoId,
    };
}

export function toDosFetchDataSuccess(toDos) {
    return {
        type: actionTypes.TO_DOS_FETCH_DATA_SUCCESS,
        toDos,
    };
}

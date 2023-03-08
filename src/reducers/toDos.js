import * as actionTypes from "../assets/actionTypes";

export function toDos(state = [], action) {
    switch (action.type) {
        case actionTypes.TO_DOS_FETCH_DATA_SUCCESS:
            return action.toDos;

        case actionTypes.EDIT_TO_DO:
            return state.map((toDo) =>
                toDo.id === action.toDo.id
                    ? Object.assign({}, toDo, action.toDo)
                    : toDo
            );

        case actionTypes.ADD_TO_DO:
            return [...state, action.toDo];

        case actionTypes.DELETE_TO_DO:
            return state.filter((toDo) => toDo.id !== action.toDoId);

        default:
            return state;
    }
}

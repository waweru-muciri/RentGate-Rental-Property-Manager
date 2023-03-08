import * as actionTypes from "../assets/actionTypes";

export function logs(state = [], action) {
    switch (action.type) {
        case actionTypes.AUDIT_LOGS_FETCH_DATA_SUCCESS:
            return action.logs;

        case actionTypes.EDIT_AUDIT_LOG:
            return state.map((log) =>
                log.id === action.log.id ? Object.assign({}, action.log) : log
            );

        case actionTypes.ADD_AUDIT_LOG:
            return [...state, action.log];

        case actionTypes.DELETE_AUDIT_LOG:
            return state.filter((log) => log.id !== action.logId);

        default:
            return state;
    }
}

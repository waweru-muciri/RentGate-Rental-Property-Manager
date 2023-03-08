import * as actionTypes from "../assets/actionTypes";

export function notices(state = [], action) {
    switch (action.type) {
        case actionTypes.NOTICES_FETCH_DATA_SUCCESS:
            return action.notices;

        case actionTypes.EDIT_NOTICE:
            return state.map((notice) =>
                notice.id === action.notice.id
                    ? Object.assign({}, notice, action.notice)
                    : notice
            );

        case actionTypes.ADD_NOTICE:
            return [...state, action.notice];

        case actionTypes.DELETE_NOTICE:
            return state.filter((notice) => notice.id !== action.noticeId);

        default:
            return state;
    }
}

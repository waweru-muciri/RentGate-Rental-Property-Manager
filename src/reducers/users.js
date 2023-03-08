import * as actionTypes from "../assets/actionTypes";

export function users(state = [], action) {
    switch (action.type) {
        case actionTypes.USERS_FETCH_DATA_SUCCESS:
            return action.users;

        case actionTypes.EDIT_USER:
            return state.map((user) =>
                user.id === action.user.id
                    ? Object.assign({}, user, action.user)
                    : user
            );

        case actionTypes.ADD_USER:
            return [...state, action.user];

        case actionTypes.DELETE_USER:
            return state.filter((user) => user.id !== action.userId);

        default:
            return state;
    }
}

import * as actionTypes from "../assets/actionTypes";

export function editUser(user) {
    return {
        type: actionTypes.EDIT_USER,
        user
    };
}

export function addUser(user) {
    return {
        type: actionTypes.ADD_USER,
        user
    };
}

export function deleteUser(userId) {
    return {
        type: actionTypes.DELETE_USER,
        userId
    };
}

export function usersFetchDataSuccess(users) {
    return {
        type: actionTypes.USERS_FETCH_DATA_SUCCESS,
        users
    };
}






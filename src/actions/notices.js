import * as actionTypes from "../assets/actionTypes";

export function noticesFetchDataSuccess(notices) {
    return {
        type: actionTypes.NOTICES_FETCH_DATA_SUCCESS,
        notices,
    };
}

export function deleteNotice(noticeId) {
    return {
        type: actionTypes.DELETE_NOTICE,
        noticeId,
    };
}

export function addNotice(notice) {
    return {
        type: actionTypes.ADD_NOTICE,
        notice,
    };
}

export function editNotice(notice) {
    return {
        type: actionTypes.EDIT_NOTICE,
        notice,
    };
}

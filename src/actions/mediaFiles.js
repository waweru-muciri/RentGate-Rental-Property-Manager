import * as actionTypes from "../assets/actionTypes";

export function mediaFilesFetchDataSuccess(mediaFiles) {
    return {
        type: actionTypes.MEDIA_FILES_FETCH_DATA_SUCCESS,
        mediaFiles,
    };
}

export function deleteMediaFile(mediaFileId) {
    return {
        type: actionTypes.DELETE_MEDIA_FILE,
        mediaFileId,
    };
}

export function addMediaFile(mediaFile) {
    return {
        type: actionTypes.ADD_MEDIA_FILE,
        mediaFile,
    };
}

export function editMediaFile(mediaFile) {
    return {
        type: actionTypes.EDIT_MEDIA_FILE,
        mediaFile,
    };
}

import * as actionTypes from "../assets/actionTypes";

export function mediaFiles(state = [], action) {
    switch (action.type) {
        case actionTypes.MEDIA_FILES_FETCH_DATA_SUCCESS:
            return action.mediaFiles;

        case actionTypes.EDIT_MEDIA_FILE:
            return state.map((mediaFile) =>
                mediaFile.id === action.mediaFile.id
                    ? Object.assign({}, mediaFile, action.mediaFile)
                    : mediaFile
            );

        case actionTypes.ADD_MEDIA_FILE:
            return [...state, action.mediaFile];

        case actionTypes.DELETE_MEDIA_FILE:
            return state.filter(
                (mediaFile) => mediaFile.id !== action.mediaFileId
            );

        default:
            return state;
    }
}

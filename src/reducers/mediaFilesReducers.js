import * as actionTypes from "../assets/actionTypes";

export function mediaFiles(state = [], action) {
    switch (action.type) {
        case actionTypes.MEDIA_FILES_FETCH_DATA_SUCCESS:
            return action.mediaFiles;

        case actionTypes.EDIT_MEDIA_FILE:
            return state.map((mediafile) =>
                mediafile.id === action.mediafile.id
                    ? Object.assign({}, action.mediafile)
                    : mediafile
            );

        case actionTypes.ADD_MEDIA_FILE:
            return [...state, action.mediafile];

        case actionTypes.DELETE_MEDIA_FILE:
            return state.filter(
                (mediafile) => mediafile.id !== action.mediafileId
            );

        default:
            return state;
    }
}

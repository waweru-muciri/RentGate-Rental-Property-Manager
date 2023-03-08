import * as actionTypes from "../assets/actionTypes";

export function maintenanceRequests(state = [], action) {
    switch (action.type) {
        case actionTypes.MAINTENANCE_REQUESTS_FETCH_DATA_SUCCESS:
            return action.maintenanceRequests;

        case actionTypes.EDIT_MAINTENANCE_REQUEST:
            return state.map((maintenanceRequest) =>
                maintenanceRequest.id === action.maintenanceRequest.id
                    ? Object.assign({}, maintenanceRequest, action.maintenanceRequest)
                    : maintenanceRequest
            );

        case actionTypes.ADD_MAINTENANCE_REQUEST:
            return [...state, action.maintenanceRequest];

        case actionTypes.DELETE_MAINTENANCE_REQUEST:
            return state.filter(
                (maintenanceRequest) =>
                    maintenanceRequest.id !== action.maintenanceRequestId
            );

        default:
            return state;
    }
}

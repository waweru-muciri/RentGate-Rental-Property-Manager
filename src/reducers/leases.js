import * as actionTypes from "../assets/actionTypes";

export function leases(state = [], action) {
    switch (action.type) {
        case actionTypes.LEASES_FETCH_DATA_SUCCESS:
            return action.leases;

        case actionTypes.EDIT_LEASE:
            return state.map((lease) =>
                lease.id === action.lease.id ? Object.assign({}, action.lease) : lease
            );

        case actionTypes.ADD_LEASE:
            return [...state, action.lease];

        case actionTypes.DELETE_LEASE:
            return state.filter((lease) => lease.id !== action.leaseId);

        default:
            return state;
    }
}

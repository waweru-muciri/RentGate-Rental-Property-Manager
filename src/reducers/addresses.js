import * as actionTypes from "../assets/actionTypes";

export function addresses(state = [], action) {
    switch (action.type) {
        case actionTypes.ADDRESSES_FETCH_DATA_SUCCESS:
            return action.addresses;

        case actionTypes.EDIT_ADDRESS:
            return state.map((address) =>
                address.id === action.address.id
                    ? Object.assign({}, action.address)
                    : address
            );

        case actionTypes.ADD_ADDRESS:
            return [...state, action.address];

        case actionTypes.DELETE_ADDRESS:
            return state.filter((address) => address.id !== action.addressId);

        default:
            return state;
    }
}

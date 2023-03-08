import * as actionTypes from "../assets/actionTypes";

export function meterReadings(state = [], action) {
    switch (action.type) {
        case actionTypes.METER_READINGS_FETCH_DATA_SUCCESS:
            return action.meterReadings;

        case actionTypes.EDIT_METER_READING:
            return state.map((meterReading) =>
                meterReading.id === action.meterReading.id
                    ? Object.assign({}, meterReading, action.meterReading)
                    : meterReading
            );

        case actionTypes.ADD_METER_READING:
            return [...state, action.meterReading];

        case actionTypes.DELETE_METER_READING:
            return state.filter((meterReading) => meterReading.id !== action.meterReadingId);

        default:
            return state;
    }
}

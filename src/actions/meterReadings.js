import * as actionTypes from "../assets/actionTypes";

export function editMeterReading(meterReading) {
    return {
        type: actionTypes.EDIT_METER_READING,
        meterReading,
    };
}

export function addMeterReading(meterReading) {
    return {
        type: actionTypes.ADD_METER_READING,
        meterReading,
    };
}

export function deleteMeterReading(meterReadingId) {
    return {
        type: actionTypes.DELETE_METER_READING,
        meterReadingId,
    };
}

export function meterReadingsFetchDataSuccess(meterReadings) {
    return {
        type: actionTypes.METER_READINGS_FETCH_DATA_SUCCESS,
        meterReadings,
    };
}

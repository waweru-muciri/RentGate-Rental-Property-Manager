import * as actionTypes from "../assets/actionTypes";

export function editCompanyProfile(companyProfile) {
    return {
        type: actionTypes.EDIT_COMPANY_PROFILE,
        companyProfile,
    };
}

export function addCompanyProfile(companyProfile) {
    return {
        type: actionTypes.ADD_COMPANY_PROFILE,
        companyProfile,
    };
}

export function deleteCompanyProfile(companyProfileId) {
    return {
        type: actionTypes.DELETE_COMPANY_PROFILE,
        companyProfileId,
    };
}

export function companyProfilesFetchDataSuccess(companyProfiles) {
    return {
        type: actionTypes.COMPANY_PROFILES_FETCH_DATA_SUCCESS,
        companyProfiles,
    };
}

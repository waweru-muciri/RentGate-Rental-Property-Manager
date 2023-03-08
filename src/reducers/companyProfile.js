import * as actionTypes from "../assets/actionTypes";

export function companyProfiles(state = [], action) {
    switch (action.type) {
        case actionTypes.COMPANY_PROFILES_FETCH_DATA_SUCCESS:
            return action.companyProfiles;

        case actionTypes.EDIT_COMPANY_PROFILE:
            return state.map((companyProfile) =>
                companyProfile.id === action.companyProfile.id
                    ? Object.assign({}, companyProfile, action.companyProfile)
                    : companyProfile
            );

        case actionTypes.ADD_COMPANY_PROFILE:
            return [...state, action.companyProfile];

        case actionTypes.DELETE_COMPANY_PROFILE:
            return state.filter((companyProfile) => companyProfile.id !== action.companyProfileId);

        default:
            return state;
    }
}

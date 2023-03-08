import * as actionTypes from "../assets/actionTypes";
import * as propertyReducers from "./propertyReducers";
import * as mediaFilesReducers from "./mediaFilesReducers";
import * as contactsReducers from "./contacts";
import * as transactionsReducers from "./transactions";
import * as logsReducers from "./logs";
import * as maintenanceRequestsReducers from "./maintenanceRequests";
import * as usersReducers from "./users";
import * as emailsReducers from "./emails";
import * as phoneNumbersReducers from "./phoneNumbers";
import * as addressesReducers from "./addresses";
import * as faxesReducers from "./faxes";
import * as noticesReducers from "./notices";
import * as toDosReducers from "./toDos";

export function itemsHasErrored(state = null, action) {
    switch (action.type) {
        case actionTypes.ITEMS_HAS_ERRORED:
            return action.error;
        default:
            return state;
    }
}

export function setPaginationPage(state = 0, action) {
    switch (action.type) {
        case actionTypes.SET_PAGINATION_PAGE:
            return action.index;
        default:
            return state;
    }
}

export function setCurrentUser(state = null, action) {
    switch (action.type) {
        case actionTypes.SET_CURRENT_USER:
            return action.user;
        default:
            return state;
    }
}

export function itemsIsLoading(state = false, action) {
    switch (action.type) {
        case actionTypes.ITEMS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

function reducers(state = {}, action) {
    return {
        properties: propertyReducers.properties(state.properties, action),
        mediaFiles: mediaFilesReducers.mediaFiles(state.mediaFiles, action),
        users: usersReducers.users(state.users, action),
        contacts: contactsReducers.contacts(state.contacts, action),
        contact_faxes: faxesReducers.faxes(state.contact_faxes, action),
        contact_emails: emailsReducers.emails(state.contact_emails, action),
        contact_addresses: addressesReducers.addresses(
            state.contact_addresses,
            action
        ),
        contact_phone_numbers: phoneNumbersReducers.phoneNumbers(
            state.contact_phone_numbers,
            action
        ),
        transactions: transactionsReducers.transactions(
            state.transactions,
            action
        ),
        maintenanceRequests: maintenanceRequestsReducers.maintenanceRequests(
            state.maintenanceRequests,
            action
        ),
        toDos : toDosReducers.toDos(state.toDos, action),
        notices : noticesReducers.notices(state.notices, action),
        currentUser : setCurrentUser(state.currentUser, action),
        auditLogs: logsReducers.logs(state.auditLogs, action),
        isLoading: itemsIsLoading(state.isLoading, action),
        error: itemsHasErrored(state.itemsHasErrored, action),
        selectedTab: setPaginationPage(state.selectedTab, action),
    };
}

export default reducers;

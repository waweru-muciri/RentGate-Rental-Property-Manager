import * as actionTypes from "../assets/actionTypes";
import * as propertyReducers from "./propertyReducers";
import * as propertyUnitChargesReducers from "./propertyUnitCharges";
import * as propertyUnitsReducers from "./propertyUnits";
import * as managementFeesReducers from "./managementFees";
import * as contactsReducers from "./contacts";
import * as rentalPaymentsReducers from "./rentalPayments";
import * as propertySettingsReducers from "./propertySettings";
import * as maintenanceRequestsReducers from "./maintenanceRequests";
import * as usersReducers from "./users";
import * as communicationEmailsReducers from "./CommunicationEmails";
import * as rentalChargesReducers from "./rentalCharges";
import * as leaseReducers from "./leases";
import * as noticesReducers from "./notices";
import * as companyProfileReducers from "./companyProfile";
import * as accountBillingsReducers from "./accountBilling";
import * as expensesReducers from "./expenses";
import * as creditNotesReducers from "./CreditNotes";
import * as toDosReducers from "./toDos";
import * as meterReadingsReducers from "./meterReadings";
import * as emailTemplatesReducers from "./emailTemplates";

export function itemsHasErrored(state = null, action) {
    switch (action.type) {
        case actionTypes.ITEMS_HAS_ERRORED:
            return action.error;
        default:
            return state;
    }
}

export function setPaginationPage(state = { parent: 0, nestedLink: -1, drawerOpen: false }, action) {
    switch (action.type) {
        case actionTypes.SET_PAGINATION_PAGE:
            return action.index;
        default:
            return state;
    }
}

export function toggleDrawer(state = false, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_DRAWER:
            return action.toggleValue;
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
        communicationEmails: communicationEmailsReducers.communicationEmails(state.communication_emails, action),
        properties: propertyReducers.properties(state.properties, action),
        propertyUnitCharges: propertyUnitChargesReducers.propertyUnitCharges(state.propertyUnitCharges, action),
        propertyUnits: propertyUnitsReducers.propertyUnits(state.propertyUnits, action),
        companyProfile: companyProfileReducers.companyProfiles(state.companyProfile, action),
        managementFees: managementFeesReducers.managementFees(state.managementFees, action),
        users: usersReducers.users(state.users, action),
        propertySettings: propertySettingsReducers.propertySettings(state.propertySettings, action),
        expenses: expensesReducers.expenses(state.expenses, action),
        creditNotes: creditNotesReducers.creditNotes(state.creditNotes, action),
        contacts: contactsReducers.contacts(state.contacts, action),
        leases: leaseReducers.leases(state.leases, action),
        rentalCharges: rentalChargesReducers.rentalCharges(
            state.rentalCharges,
            action
        ),
        rentalPayments: rentalPaymentsReducers.rentalPayments(
            state.rentalPayments,
            action
        ),
        maintenanceRequests: maintenanceRequestsReducers.maintenanceRequests(
            state.maintenanceRequests,
            action
        ),
        emailTemplates: emailTemplatesReducers.emailTemplates(state.emailTemplates, action),
        meterReadings: meterReadingsReducers.meterReadings(state.meterReadings, action),
        toDos: toDosReducers.toDos(state.toDos, action),
        notices: noticesReducers.notices(state.notices, action),
        accountBillings: accountBillingsReducers.accountBillings(state.accountBillings, action),
        currentUser: setCurrentUser(state.currentUser, action),
        isLoading: itemsIsLoading(state.isLoading, action),
        error: itemsHasErrored(state.itemsHasErrored, action),
        selectedTab: setPaginationPage(state.selectedTab, action),
        drawerOpen: toggleDrawer(state.drawerOpen, action),
    };
}

export default reducers;

import * as actionTypes from "../assets/actionTypes";
import * as vacatingNoticesActions from "./notices";
import * as emailTemplatesActions from "./emailTemplates";
import * as propertyActions from "./property";
import * as propertySettingsActions from "./propertySettings";
import * as propertyUnitChargeActions from "./propertyUnitCharges";
import * as propertyUnitActions from "./propertyUnits";
import * as managementFeesActions from "./managementFees";
import * as contactsActions from "./contacts";
import * as transactionsActions from "./transactions";
import * as logActions from "./logs";
import * as companyProfileActions from "./companyProfile";
import * as accountBillingActions from "./accountBilling";
import * as usersActions from "./users";
import * as transactionChargesActions from "./transactionsCharges";
import * as communicationEmailsActions from "./CommunicationEmails";
import * as leaseActions from "./leases";
import * as toDoActions from "./to-dos";
import * as expensesActions from "./expenses";
import * as meterReadingsActions from "./meterReadings";
import * as maintenanceRequestsActions from "./maintenanceRequests";
import { auth, firebaseStorage, firebaseFunctions } from "../firebase";
import { getDatabaseRef } from "./firebaseHelpers";


const firebaseStorageRef = firebaseStorage.ref();
const setAdminCustomClaim = firebaseFunctions.httpsCallable('setAdminCustomClaim');
export const setDatabaseRefCustomClaim = firebaseFunctions.httpsCallable('setDatabaseRefCustomClaim');
export const createFirebaseUser = firebaseFunctions.httpsCallable('createFirebaseUser');
export const updateFirebaseUser = firebaseFunctions.httpsCallable('updateFirebaseUser');
export const deleteFirebaseUsers = firebaseFunctions.httpsCallable('deleteFirebaseUsers');
export const sendInvoice = firebaseFunctions.httpsCallable('sendInvoice');

export function setCurrentUser(user) {
    return {
        type: actionTypes.SET_CURRENT_USER,
        user,
    };
}

export const firebaseSignOutUser = () => {
    return (dispatch) => {
        auth
            .signOut()
            .then(function () {

            })
            .catch(function (error) {
                // An error happened.
            }).finally(() => {
                dispatch(setCurrentUser(null))
            })
    }
}

export const getFirebaseUserDetails = async (userToken) => {
    const idTokenResult = await userToken.getIdTokenResult()
    let isAdmin;
    let tenantId;
    if (idTokenResult.claims) {
        isAdmin = idTokenResult.claims.admin
        tenantId = idTokenResult.claims.databaseRef
    }
    const userDetails = {
        displayName: userToken.displayName,
        email: userToken.email,
        emailVerified: userToken.emailVerified,
        photoURL: userToken.photoURL,
        uid: userToken.uid,
        id: userToken.uid,
        isAdmin: isAdmin,
        tenant_id: tenantId
    };
    return userDetails;
}

export const resetUserPasswordByEmail = async (email) => {
    return await auth.sendPasswordResetEmail(email, { handleCodeInApp: false, url: 'https://gallant-propertymanager.herokuapp.com/account-actions/' })
}

export const signUpWithEmailAndPassword = async (userDetails) => {
    try {
        const returnValue = await createFirebaseUser(userDetails)
        const createdUser = returnValue.data
        await setAdminCustomClaim({ userId: createdUser.uid, userProfile: userDetails })
    } catch (error) {
        // Handle Errors here.
        console.log("Actions error => ", error.message)
        throw new Error(error);
    }
};

export const signInUserWithEmailAndPassword = async (email, password) => {
    try {
        const authCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = authCredential.user;
        const userDetails = getFirebaseUserDetails(user)
        return userDetails;
    }
    catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = errorCode === "auth/wrong-password"
            ? "Wrong password."
            : errorCode === "auth/user-disabled"
                ? "User account disabled"
                : errorCode === "auth/invalid-email"
                    ? "Email is Invalid"
                    : errorCode === "auth/user-not-found"
                        ? "No user found with email"
                        : "Failed to connect to resource. Check your internet connection";
        throw new Error(errorMessage);
    }

}

export async function sendEmails(subject, email, recipients) {
    var sendEmail = firebaseFunctions.httpsCallable('sendEmail');
    try {
        await sendEmail({ subject: subject, email: email, recipients: recipients })
        // Read result of the Cloud Function.
    } catch (error) {
        //getting the error details
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.error(`There was an error when calling the sendEmails Cloud Function.\n 
        Error Code => ${code}. Error Message => ${message}. Error Details => ${details}`);
    }
}

export async function deleteUploadedFileByUrl(fileUrl) {
    return await firebaseStorage.refFromURL(fileUrl).delete().then(() => console.log('Successfully deleted file')).catch((error) => console.log('Error deleting file => ', error))
}

export async function uploadFilesToFirebase(fileToUpload) {
    var fileRef = firebaseStorageRef.child(`propertyImages/${fileToUpload.name}`);
    try {
        const snapshot = await fileRef
            .putString(fileToUpload.data, "data_url");
        // console.log("Uploaded files successfully!");
        try {
            const url = await snapshot.ref.getDownloadURL();
            return url;
        }
        catch (error) {
            switch (error.code) {
                case "storage/object-not-found":
                    console.log("File doesn't exist");
                    break;
                case "storage/unauthorized":
                    console.log(
                        "User doesn't have permission to access the object"
                    );
                    break;
                case "storage/canceled":
                    console.log("User canceled the upload");
                    break;
                case "storage/unknown":
                    console.log(
                        "Unknown error occurred, inspect the server response"
                    );
                    break;
                default:
                    console.log('Unknown error');
            }
        }
    }
    catch (error_1) {
        console.log("Error during file upload => ", error_1);
        return ''
    }
}

export function itemsFetchData(collectionsUrls) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        collectionsUrls.forEach(async (url) => {
            try {
                const snapshot = await getDatabaseRef().collection(url).get()
                let fetchedItems = []
                snapshot.forEach((doc) => {
                    let fetchedObject = Object.assign(
                        {},
                        doc.data(),
                        {
                            id: doc.id,
                        }
                    );
                    fetchedItems.push(fetchedObject)
                });
                switch (url) {
                    case "property-settings":
                        dispatch(propertySettingsActions.propertySettingsFetchDataSuccess(fetchedItems));
                        break;

                    case "company_profile":
                        dispatch(companyProfileActions.companyProfilesFetchDataSuccess(fetchedItems));
                        break;

                    case "account-billing":
                        dispatch(accountBillingActions.acccountBillingsFetchDataSuccess(fetchedItems));
                        break;

                    case "properties":
                        dispatch(propertyActions.propertiesFetchDataSuccess(fetchedItems));
                        break;

                    case "property_units":
                        dispatch(propertyUnitActions.propertyUnitsFetchDataSuccess(fetchedItems));
                        break;

                    case "leases":
                        dispatch(leaseActions.leasesFetchDataSuccess(fetchedItems));
                        break;

                    case "unit-charges":
                        dispatch(propertyUnitChargeActions.propertyUnitChargesFetchDataSuccess(fetchedItems));
                        break;

                    case "contacts":
                        dispatch(contactsActions.contactsFetchDataSuccess(fetchedItems));
                        break;

                    case "transactions-charges":
                        dispatch(transactionChargesActions.transactionChargesFetchDataSuccess(fetchedItems));
                        break;

                    case "charge-payments":
                        dispatch(transactionsActions.transactionsFetchDataSuccess(fetchedItems));
                        break;

                    case "to-dos":
                        dispatch(toDoActions.toDosFetchDataSuccess(fetchedItems));
                        break;

                    case "maintenance-requests":
                        dispatch(maintenanceRequestsActions.maintenanceRequestsFetchDataSuccess(fetchedItems));
                        break;

                    case "logs":
                        dispatch(logActions.auditLogsFetchDataSuccess(fetchedItems));
                        break;

                    case "notices":
                        dispatch(vacatingNoticesActions.noticesFetchDataSuccess(fetchedItems));
                        break;

                    case "email-templates":
                        dispatch(emailTemplatesActions.emailTemplatesFetchDataSuccess(fetchedItems));
                        break;

                    case "management-fees":
                        dispatch(managementFeesActions.managementFeesFetchDataSuccess(fetchedItems));
                        break;

                    case "expenses":
                        dispatch(expensesActions.expensesFetchDataSuccess(fetchedItems));
                        break;

                    case "meter_readings":
                        dispatch(meterReadingsActions.meterReadingsFetchDataSuccess(fetchedItems));
                        break;

                    case "users":
                        dispatch(usersActions.usersFetchDataSuccess(fetchedItems));
                        break;

                    case "communication_emails":
                        dispatch(communicationEmailsActions.communicationEmailsFetchDataSuccess(fetchedItems));
                        break;

                    default:
                        break;
                }
            } catch (error) {
                dispatch(itemsHasErrored(error.message))
                dispatch(itemsIsLoading(false));
            }
        })
        dispatch(itemsIsLoading(false));
    }
}

export function setPaginationPage(index) {
    return {
        type: actionTypes.SET_PAGINATION_PAGE,
        index,
    };
}

export function toggleDrawer(toggleValue) {
    return {
        type: actionTypes.TOGGLE_DRAWER,
        toggleValue,
    };
}

export function itemsHasErrored(error) {
    return {
        type: actionTypes.ITEMS_HAS_ERRORED,
        error,
    };
}

export function itemsIsLoading(bool) {
    return {
        type: actionTypes.ITEMS_IS_LOADING,
        isLoading: bool,
    };
}

export function handleDelete(itemId, url) {
    //send request to server to delete selected item
    return async (dispatch) => {
        try {
            await getDatabaseRef()
                .collection(url)
                .doc(itemId)
                .delete();
            switch (url) {
                case "property-settings":
                    dispatch(propertySettingsActions.deletePropertySetting(itemId));
                    break;
                case "company_profile":
                    dispatch(companyProfileActions.deleteCompanyProfile(itemId)
                    );
                    break;

                case "properties":
                    dispatch(propertyActions.deleteProperty(itemId)
                    );
                    break;

                case "property_units":
                    dispatch(propertyUnitActions.deletePropertyUnit(itemId)
                    );
                    break;

                case "contacts":
                    dispatch(contactsActions.deleteContact(itemId)
                    );
                    break;

                case "transactions-charges":
                    dispatch(transactionChargesActions.deleteTransactionCharge(itemId)
                    );
                    break;

                case "leases":
                    dispatch(leaseActions.deleteLease(itemId));
                    break;

                case "charge-payments":
                    dispatch(transactionsActions.deleteTransaction(itemId)
                    );
                    break;

                case "to-dos":
                    dispatch(toDoActions.deleteToDo(itemId));
                    break;

                case "unit-charges":
                    dispatch(propertyUnitChargeActions.deletePropertyUnitCharge(itemId));
                    break;

                case "maintenance-requests":
                    dispatch(maintenanceRequestsActions.deleteMaintenanceRequest(itemId)
                    );
                    break;

                case "logs":
                    dispatch(logActions.deleteAuditLog(itemId)
                    );
                    break;

                case "notices":
                    dispatch(vacatingNoticesActions.deleteNotice(itemId)
                    );
                    break;

                case "email-templates":
                    dispatch(emailTemplatesActions.deleteEmailTemplate(itemId)
                    );
                    break;

                case "management-fees":
                    dispatch(managementFeesActions.deleteManagementFee(itemId)
                    );
                    break;

                case "expenses":
                    dispatch(expensesActions.deleteExpense(itemId)
                    );
                    break;

                case "users":
                    dispatch(usersActions.deleteUser(itemId)
                    );
                    break;

                case "meter_readings":
                    dispatch(meterReadingsActions.deleteMeterReading(itemId)
                    );
                    break;

                case "communication_emails":
                    dispatch(communicationEmailsActions.deleteCommunicationEmail(itemId)
                    );
                    break;

                default:
                    break;
            }
        }
        catch (error) {
            dispatch(itemsHasErrored(error.message))
            dispatch(itemsIsLoading(false));
            console.log("Failed to Delete Document!", error);
        }
    }
}

export function handleItemFormSubmit(data, url) {
    if (typeof data.id === "undefined") {
        delete data.id;
    }
    return (dispatch) => {
        return new Promise(function (resolve, reject) {
            typeof data.id !== "undefined"
                ? //send post request to edit the item
                getDatabaseRef()
                    .collection(url)
                    .doc(data.id)
                    .update(data)
                    .then((docRef) => {
                        let modifiedObject = Object.assign(
                            {},
                            data,
                        );
                        switch (url) {
                            case "property-settings":
                                dispatch(propertySettingsActions.editPropertySetting(modifiedObject));
                                break;
                            case "company_profile":
                                dispatch(companyProfileActions.editCompanyProfile(modifiedObject));
                                break;

                            case "properties":
                                dispatch(propertyActions.editProperty(modifiedObject));
                                break;

                            case "property_units":
                                dispatch(propertyUnitActions.editPropertyUnit(modifiedObject));
                                break;

                            case "unit-charges":
                                dispatch(propertyUnitChargeActions.editPropertyUnitCharge(modifiedObject));
                                break;

                            case "contacts":
                                dispatch(contactsActions.editContact(modifiedObject));
                                break;

                            case "transactions-charges":
                                dispatch(transactionChargesActions.editTransactionCharge(modifiedObject));
                                break;

                            case "leases":
                                dispatch(leaseActions.editLease(modifiedObject));
                                break;

                            case "charge-payments":
                                dispatch(transactionsActions.editTransaction(modifiedObject));
                                break;

                            case "to-dos":
                                dispatch(toDoActions.editToDo(modifiedObject));
                                break;

                            case "maintenance-requests":
                                dispatch(maintenanceRequestsActions.editMaintenanceRequest(modifiedObject));
                                break;

                            case "logs":
                                dispatch(logActions.editAuditLog(modifiedObject));
                                break;

                            case "notices":
                                dispatch(vacatingNoticesActions.editNotice(modifiedObject));
                                break;

                            case "email-templates":
                                dispatch(emailTemplatesActions.editEmailTemplate(modifiedObject));
                                break;

                            case "management-fees":
                                dispatch(managementFeesActions.editManagementFee(modifiedObject));
                                break;

                            case "expenses":
                                dispatch(expensesActions.editExpense(modifiedObject));
                                break;

                            case "users":
                                dispatch(usersActions.editUser(modifiedObject));
                                break;

                            case "meter_readings":
                                dispatch(meterReadingsActions.editMeterReading(modifiedObject));
                                break;

                            case "communication_emails":
                                dispatch(communicationEmailsActions.editCommunicationEmail(modifiedObject));
                                break;

                            default:
                                break;
                        }
                        resolve(data.id);
                    })
                    .catch((error) => {
                        dispatch(itemsHasErrored(error.message))
                        dispatch(itemsIsLoading(false));
                        console.log("Error updating document => ", error.response);
                        reject(error)
                    })
                : //send post to create item
                getDatabaseRef()
                    .collection(url)
                    .add(data)
                    .then((docRef) => {
                        let addedItem = Object.assign({}, data, {
                            id: docRef.id,
                        });
                        switch (url) {
                            case "property-settings":
                                dispatch(propertySettingsActions.addPropertySetting(addedItem));
                                break;
                            case "company_profile":
                                dispatch(companyProfileActions.addCompanyProfile(addedItem));
                                break;
                            case "properties":
                                dispatch(propertyActions.addProperty(addedItem));
                                break;

                            case "property_units":
                                dispatch(propertyUnitActions.addPropertyUnit(addedItem));
                                break;

                            case "unit-charges":
                                dispatch(propertyUnitChargeActions.addPropertyUnitCharge(addedItem));
                                break;

                            case "contacts":
                                dispatch(contactsActions.addContact(addedItem));
                                break;

                            case "transactions-charges":
                                dispatch(transactionChargesActions.addTransactionCharge(addedItem));
                                break;

                            case "leases":
                                dispatch(leaseActions.addLease(addedItem));
                                break;

                            case "charge-payments":
                                dispatch(transactionsActions.addTransaction(addedItem));
                                break;

                            case "to-dos":
                                dispatch(toDoActions.addToDo(addedItem));
                                break;

                            case "maintenance-requests":
                                dispatch(maintenanceRequestsActions.addMaintenanceRequest(addedItem));
                                break;

                            case "logs":
                                dispatch(logActions.addAuditLog(addedItem));
                                break;

                            case "notices":
                                dispatch(vacatingNoticesActions.addNotice(addedItem));
                                break;

                            case "email-templates":
                                dispatch(emailTemplatesActions.addEmailTemplate(addedItem));
                                break;

                            case "management-fees":
                                dispatch(managementFeesActions.addManagementFee(addedItem));
                                break;

                            case "expenses":
                                dispatch(expensesActions.addExpense(addedItem));
                                break;

                            case "users":
                                dispatch(usersActions.addUser(addedItem));
                                break;

                            case "meter_readings":
                                dispatch(meterReadingsActions.addMeterReading(addedItem));
                                break;

                            case "communication_emails":
                                dispatch(communicationEmailsActions.addCommunicationEmail(addedItem));
                                break;

                            default:
                                break;
                        }
                        resolve(docRef.id);
                    })
                    .catch((error) => {
                        dispatch(itemsHasErrored(error.message))
                        dispatch(itemsIsLoading(false));
                        console.log("Error adding document => ", error.response);
                        reject(error)
                    });
        })
    }
}

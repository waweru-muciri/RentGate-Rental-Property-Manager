import * as actionTypes from "../assets/actionTypes";
import * as vacatingNoticesActions from "./notices";
import * as propertyActions from "./property";
import * as propertyUnitChargeActions from "./propertyUnitCharges";
import * as propertyUnitActions from "./propertyUnits";
import * as mediaFilesActions from "./mediaFiles";
import * as contactsActions from "./contacts";
import * as transactionsActions from "./transactions";
import * as logActions from "./logs";
import * as usersActions from "./users";
import * as addressesActions from "./addresses";
import * as phoneNumbersActions from "./phoneNumbers";
import * as emailsActions from "./emails";
import * as communicationEmailsActions from "./CommunicationEmails";
import * as faxesActions from "./faxes";
import * as toDoActions from "./to-dos";
import * as expensesActions from "./expenses";
import * as meterReadingsActions from "./meterReadings";
import * as maintenanceRequestsActions from "./maintenanceRequests";
import app from "../firebase";
import { getDatabaseRef } from "./firebaseHelpers";


// Initialize Cloud Functions through Firebase
var functions = app.functions();
const auth = app.auth()
const storageRef = app.storage().ref();

export function setCurrentUser(user) {
    return {
        type: actionTypes.SET_CURRENT_USER,
        user,
    };
}

export const firebaseSignOutUser = () => {
    return (dispatch) => {
        app
            .auth()
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

export const getFirebaseUserDetails = (userToken) => {
    const userDetails = {
        displayName: userToken.displayName,
        email: userToken.email,
        emailVerified: userToken.emailVerified,
        photoURL: userToken.photoURL,
        uid: userToken.uid,
        id: userToken.uid,
        tenant: 'wPEY7XfSReuoOEOa22aX',
        phoneNumber: userToken.phoneNumber,
        providerData: userToken.providerData,
    };
    userToken.getIdTokenResult().then((idTokenResult) => {
        // Confirm the user is an Admin.
        if (!!idTokenResult.claims.isAdmin) {
            userDetails.isAdmin = true
        } else {
            userDetails.isAdmin = false
        }
    });
    return userDetails;
}

export const signUpWithEmailAndPassword = async (email, password) => {

    try {
        const authCredential = await app.auth().createUserWithEmailAndPassword(email, password);
        //get user details from autheCredential
        const user = authCredential.user;
        //   //call api to set custom claims on user 
        const userDetails = getFirebaseUserDetails(user)
        return userDetails;
    } catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage =
            errorCode === "auth/weak-password"
                ? "The password is too weak."
                : errorCode === "auth/operation-not-allowed"
                    ? "Operation Not Allowed"
                    : errorCode === "auth/invalid-email"
                        ? "Email is Invalid"
                        : errorCode === "auth/email-already-in-use"
                            ? "Email is already in Use"
                            : "May God help Us";
        throw new Error(errorMessage)
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
                        : "May God help Us";
        throw new Error(errorMessage);
    }

}

export function sendEmails(email, recipients) {
    var sendEmail = functions.httpsCallable('sendEmail');
    sendEmail({ email: email, recipients: recipients }).then(function (result) {
        // Read result of the Cloud Function.
        var response = result.data;
        if (response.error) {
            console.log('Error sending emails => ', response.error)
        }
        else {
            console.log('Successfully sent emails => ', response.success)
        }
    });
}

export function addRolesToUserByEmail(email, rolesToAddObject) {
    var addRolesToUser = functions.httpsCallable('addRolesToUser');
    addRolesToUser({ email: email, roles: rolesToAddObject }).then(function (result) {
        // Read result of the Cloud Function.
        var response = result.data;
        if (response.error) {
            console.log('Error adding roles to user => ', response.error)
        }
        else {
            console.log('Successfully added roles to user => ', response.success)
        }
    });
}

export async function deleteUploadedFileByUrl(fileUrl) {
    return await storageRef.refFromURL(fileUrl).delete().then(() => console.log('Successfully deleted file')).catch((error) => console.log('Error deleting file => ', error))
}

export function uploadFilesToFirebase(filesArray) {
    return filesArray.map(async (file) => {
        var fileRef = storageRef.child(`propertyImages/${file.file.name}`);
        try {
            const snapshot = await fileRef
                .putString(file.data, "data_url");
            // console.log("Uploaded files successfully!");
            try {
                const url = await snapshot.ref
                    .getDownloadURL();
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
            return console.log("Error during file upload => ", error_1);
        }
    });
}

export function itemsFetchData(collectionsUrls) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        collectionsUrls.forEach((url) => {
            getDatabaseRef().collection(url).get().then((snapshot) => {
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
                    case "properties":
                        dispatch(
                            propertyActions.propertiesFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "property_units":
                        dispatch(
                            propertyUnitActions.propertyUnitsFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "unit-charges":
                        dispatch(
                            propertyUnitChargeActions.propertyUnitChargesFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "contacts":
                        dispatch(
                            contactsActions.contactsFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "contact_emails":
                        dispatch(
                            emailsActions.emailsFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "contact_phone_numbers":
                        dispatch(
                            phoneNumbersActions.phoneNumbersFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "contact_addresses":
                        dispatch(
                            addressesActions.addressesFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "transactions":
                        dispatch(
                            transactionsActions.transactionsFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "to-dos":
                        dispatch(toDoActions.toDosFetchDataSuccess(fetchedItems));
                        break;

                    case "maintenance-requests":
                        dispatch(
                            maintenanceRequestsActions.maintenanceRequestsFetchDataSuccess(
                                fetchedItems
                            )
                        );
                        break;

                    case "logs":
                        dispatch(
                            logActions.auditLogsFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "notices":
                        dispatch(
                            vacatingNoticesActions.noticesFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "property_media":
                        dispatch(
                            mediaFilesActions.mediaFilesFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "expenses":
                        dispatch(
                            expensesActions.expensesFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "meter_readings":
                        dispatch(
                            meterReadingsActions.meterReadingsFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "users":
                        dispatch(
                            usersActions.usersFetchDataSuccess(fetchedItems)
                        );
                        break;

                    case "communication_emails":
                        dispatch(
                            communicationEmailsActions.communicationEmailsFetchDataSuccess(fetchedItems)
                        );
                        break;

                    default:
                        break;
                }
            }).catch((error) => {
                dispatch(itemsHasErrored(error.message))
                dispatch(itemsIsLoading(false));
            });
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

export function handleDelete(user, itemId, url) {
    //send request to server to delete selected item
    return async (dispatch) => {
        try {
            await getDatabaseRef()
                .collection(url)
                .doc(itemId)
                .delete();
            switch (url) {
                case "properties":
                    dispatch(
                        propertyActions.deleteProperty(
                            itemId
                        )
                    );
                    break;

                case "property_units":
                    dispatch(
                        propertyUnitActions.deletePropertyUnit(
                            itemId
                        )
                    );
                    break;

                case "contacts":
                    dispatch(
                        contactsActions.deleteContact(itemId)
                    );
                    break;

                case "contact_emails":
                    dispatch(
                        emailsActions.deleteEmail(itemId)
                    );
                    break;

                case "contact_phone_numbers":
                    dispatch(
                        phoneNumbersActions.deletePhoneNumber(
                            itemId
                        )
                    );
                    break;

                case "contact_faxes":
                    dispatch(faxesActions.deleteFax(itemId));
                    break;

                case "contact_addresses":
                    dispatch(
                        addressesActions.deleteAddress(
                            itemId
                        )
                    );
                    break;

                case "transactions":
                    dispatch(
                        transactionsActions.deleteTransaction(
                            itemId
                        )
                    );
                    break;

                case "to-dos":
                    dispatch(toDoActions.deleteToDo(itemId));
                    break;

                case "maintenance-requests":
                    dispatch(
                        maintenanceRequestsActions.deleteMaintenanceRequest(
                            itemId
                        )
                    );
                    break;

                case "logs":
                    dispatch(
                        logActions.deleteAuditLog(itemId)
                    );
                    break;

                case "notices":
                    dispatch(
                        vacatingNoticesActions.deleteNotice(itemId)
                    );
                    break;

                case "property_media":
                    dispatch(
                        mediaFilesActions.deleteMediaFile(itemId)
                    );
                    break;

                case "expenses":
                    dispatch(
                        expensesActions.deleteExpense(itemId)
                    );
                    break;

                case "users":
                    dispatch(
                        usersActions.deleteUser(itemId)
                    );
                    break;

                case "meter_readings":
                    dispatch(
                        meterReadingsActions.deleteMeterReading(itemId)
                    );
                    break;

                case "communication_emails":
                    dispatch(
                        communicationEmailsActions.deleteCommunicationEmail(itemId)
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

export function handleItemFormSubmit(user, data, url) {
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
                            case "properties":
                                dispatch(
                                    propertyActions.editProperty(modifiedObject)
                                );
                                break;

                            case "property_units":
                                dispatch(
                                    propertyUnitActions.editPropertyUnit(modifiedObject)
                                );
                                break;

                            case "unit-charges":
                                dispatch(
                                    propertyUnitChargeActions.editPropertyUnitCharge(modifiedObject)
                                );
                                break;

                            case "contacts":
                                dispatch(
                                    contactsActions.editContact(modifiedObject)
                                );
                                break;

                            case "contact_emails":
                                dispatch(
                                    emailsActions.editEmail(modifiedObject)
                                );
                                break;

                            case "contact_phone_numbers":
                                dispatch(
                                    phoneNumbersActions.editPhoneNumber(
                                        modifiedObject
                                    )
                                );
                                break;

                            case "contact_faxes":
                                dispatch(faxesActions.editFax(modifiedObject));
                                break;

                            case "contact_addresses":
                                dispatch(
                                    addressesActions.editAddress(modifiedObject)
                                );
                                break;

                            case "transactions":
                                dispatch(
                                    transactionsActions.editTransaction(
                                        modifiedObject
                                    )
                                );
                                break;

                            case "to-dos":
                                dispatch(toDoActions.editToDo(modifiedObject));
                                break;

                            case "maintenance-requests":
                                dispatch(
                                    maintenanceRequestsActions.editMaintenanceRequest(
                                        modifiedObject
                                    )
                                );
                                break;

                            case "logs":
                                dispatch(
                                    logActions.editAuditLog(modifiedObject)
                                );
                                break;

                            case "notices":
                                dispatch(
                                    vacatingNoticesActions.editNotice(modifiedObject)
                                );
                                break;

                            case "property_media":
                                dispatch(
                                    mediaFilesActions.editMediaFile(modifiedObject)
                                );
                                break;

                            case "expenses":
                                dispatch(expensesActions.editExpense(modifiedObject));
                                break;

                            case "users":
                                dispatch(usersActions.editUser(modifiedObject));
                                break;

                            case "meter_readings":
                                dispatch(
                                    meterReadingsActions.editMeterReading(modifiedObject)
                                );
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
                        reject(error)
                        dispatch(itemsHasErrored(error.message))
                        dispatch(itemsIsLoading(false));
                        console.log("Error => ", error.response);
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
                            case "properties":
                                dispatch(
                                    propertyActions.addProperty(addedItem)
                                );
                                break;

                            case "property_units":
                                dispatch(
                                    propertyUnitActions.addPropertyUnit(addedItem)
                                );
                                break;

                            case "unit-charges":
                                dispatch(
                                    propertyUnitChargeActions.addPropertyUnitCharge(addedItem)
                                );
                                break;

                            case "contacts":
                                dispatch(contactsActions.addContact(addedItem));
                                break;

                            case "contact_emails":
                                dispatch(emailsActions.addEmail(addedItem));
                                break;

                            case "contact_phone_numbers":
                                dispatch(
                                    phoneNumbersActions.addPhoneNumber(
                                        addedItem
                                    )
                                );
                                break;

                            case "contact_faxes":
                                dispatch(faxesActions.addFax(addedItem));
                                break;

                            case "contact_addresses":
                                dispatch(
                                    addressesActions.addAddress(addedItem)
                                );
                                break;

                            case "transactions":
                                dispatch(
                                    transactionsActions.addTransaction(
                                        addedItem
                                    )
                                );
                                break;

                            case "to-dos":
                                dispatch(toDoActions.addToDo(addedItem));
                                break;

                            case "maintenance-requests":
                                dispatch(
                                    maintenanceRequestsActions.addMaintenanceRequest(
                                        addedItem
                                    )
                                );
                                break;

                            case "logs":
                                dispatch(logActions.addAuditLog(addedItem));
                                break;

                            case "notices":
                                dispatch(vacatingNoticesActions.addNotice(addedItem));
                                break;

                            case "property_media":
                                dispatch(mediaFilesActions.addMediaFile(addedItem));
                                break;

                            case "expenses":
                                dispatch(expensesActions.addExpense(addedItem));
                                break;

                            case "users":
                                dispatch(usersActions.addUser(addedItem));
                                break;

                            case "meter_readings":
                                dispatch(
                                    meterReadingsActions.addMeterReading(addedItem)
                                );
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
                        console.log("Error => ", error.response);
                    });
        })
    }
}

import * as actionTypes from "../assets/actionTypes";
import * as propertyActions from "./property";
import * as mediaFilesActions from "./mediaFiles";
import * as contactsActions from "./contacts";
import * as transactionsActions from "./transactions";
import * as logActions from "./logs";
import * as usersActions from "./users";
import * as addressesActions from "./addresses";
import * as phoneNumbersActions from "./phoneNumbers";
import * as emailsActions from "./emails";
import * as faxesActions from "./faxes";
import * as toDoActions from "./to-dos";
import * as maintenanceRequestsActions from "./maintenanceRequests";
import app from "../firebase";

const db = app.firestore().collection("tenant").doc("wPEY7XfSReuoOEOa22aX");

export function setCurrentUser(user){
    return {
        type: actionTypes.SET_CURRENT_USER,
        user,
    };
}

export function uploadFilesToFirebase(filesArray) {
    var storageRef = app.storage().ref();
    return filesArray.map((file) => {
        var fileRef = storageRef.child(`propertyImages/${file.file.name}`);
        return fileRef
            .putString(file.data, "data_url")
            .then((snapshot) => {
                console.log("Uploaded files successfully!");
                return snapshot.ref
                    .getDownloadURL()
                    .then((url) => url)
                    .catch(function (error) {
                        // https://firebase.google.com/docs/storage/web/handle-errors
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
                        }
                    });
            })
            .catch((error) =>
                console.log("Error during file upload => ", error)
            );
    });
}

export function itemsFetchData(collectionsUrls) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        collectionsUrls.forEach((url) => {
            db.collection(url).onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        let addedItem = Object.assign({}, change.doc.data(), {
                            id: change.doc.id,
                        });
                        switch (url) {
                            case "properties":
                                dispatch(
                                    propertyActions.addProperty(addedItem)
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

                            case "property_media":
                                dispatch(mediaFilesActions.addMediaFile(addedItem));
                                break;

                            case "users":
                                dispatch(usersActions.addUser(addedItem));
                                break;

                            default:
                                break;
                        }
                    }
                    if (change.type === "modified") {
                        let modifiedObject = Object.assign(
                            {},
                            change.doc.data(),
                            {
                                id: change.doc.id,
                            }
                        );
                        switch (url) {
                            case "properties":
                                dispatch(
                                    propertyActions.editProperty(modifiedObject)
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

                            case "property_media":
                                dispatch(
                                    mediaFilesActions.editMediaFile(modifiedObject)
                                );
                                break;

                            case "users":
                                dispatch(usersActions.editUser(modifiedObject));
                                break;

                            default:
                                break;
                        }
                    }
                    if (change.type === "removed") {
                        let deletedItemId = change.doc.id;
                        switch (url) {
                            case "properties":
                                dispatch(
                                    propertyActions.deleteProperty(
                                        deletedItemId
                                    )
                                );
                                break;

                            case "contacts":
                                dispatch(
                                    contactsActions.deleteContact(deletedItemId)
                                );
                                break;

                            case "contact_emails":
                                dispatch(
                                    emailsActions.deleteEmail(deletedItemId)
                                );
                                break;

                            case "contact_phone_numbers":
                                dispatch(
                                    phoneNumbersActions.deletePhoneNumber(
                                        deletedItemId
                                    )
                                );
                                break;

                            case "contact_faxes":
                                dispatch(faxesActions.deleteFax(deletedItemId));
                                break;

                            case "contact_addresses":
                                dispatch(
                                    addressesActions.deleteAddress(
                                        deletedItemId
                                    )
                                );
                                break;

                            case "transactions":
                                dispatch(
                                    transactionsActions.deleteTransaction(
                                        deletedItemId
                                    )
                                );
                                break;

                            case "to-dos":
                                dispatch(toDoActions.deleteToDo(deletedItemId));
                                break;

                            case "maintenance-requests":
                                dispatch(
                                    maintenanceRequestsActions.deleteMaintenanceRequest(
                                        deletedItemId
                                    )
                                );
                                break;

                            case "logs":
                                dispatch(
                                    logActions.deleteAuditLog(deletedItemId)
                                );
                                break;

                            case "property_media":
                                dispatch(
                                    mediaFilesActions.deleteMediaFile(deletedItemId)
                                );
                                break;

                            case "users":
                                dispatch(
                                    usersActions.deleteUser(deletedItemId)
                                );
                                break;

                            default:
                                break;
                        }
                    }
                    dispatch(itemsIsLoading(false));
                });
            });
        });
        // console.log("Fetched items => ", items);
    };
}

export function setPaginationPage(index) {
    return {
        type: actionTypes.SET_PAGINATION_PAGE,
        index,
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
    return db
        .collection(url)
        .doc(itemId)
        .delete()
        .then(() => {
            console.log("Deleted document");
        })
        .catch((error) => {
            console.log(error);
        });
}

export function handleItemFormSubmit(data, url) {
    if (typeof data.id === "undefined") {
        delete data.id;
    }
    return typeof data.id !== "undefined"
        ? //send post request to edit the item
          db
              .collection(url)
              .doc(data.id)
              .update(data)
              .then((docRef) => {
                  return docRef.id;
              })
              .catch((error) => {
                  console.log("Error => ", error.response);
              })
        : //send post to create item
          db
              .collection(url)
              .add(data)
              .then((docRef) => {
                  return docRef.id;
              })
              .catch((error) => {
                  console.log("Error => ", error.response);
              });
}

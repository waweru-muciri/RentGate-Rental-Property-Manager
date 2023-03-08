import * as actionTypes from "../assets/actionTypes";
import axiosInstance from "../assets/axiosinstance";
import * as propertyActions from "./property";
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
import firebase from "firebase";
import app from "../firebase";

const db = firebase
    .firestore(app)
    .collection("tenant")
    .doc("wPEY7XfSReuoOEOa22aX");

export function itemsFetchData(url) {
    return (dispatch) => {
        let items = [];
        dispatch(itemsIsLoading(true));
        const dbRef = db.collection(url);
        dbRef
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    items.push(Object.assign({}, doc.data(), { id: doc.id }));
                });

                console.log("Fetched items => ", items);
                dispatch(itemsIsLoading(false));
                //console.log('Items query snapshot => ', items);
                //axiosInstance.get(url + '/?format=json')
                // new Promise((resolve, reject) => {
                // setTimeout(() => { resolve('') }, 1000);
                // })
                // .then((response) => {
                //   let items = response.data

                switch (url) {
                    case "properties":
                        dispatch(
                            propertyActions.propertiesFetchDataSuccess(items)
                        );
                        break;

                    case "contacts":
                        dispatch(
                            contactsActions.contactsFetchDataSuccess(items)
                        );
                        break;

                    case "contact_emails":
                        dispatch(emailsActions.emailsFetchDataSuccess(items));
                        break;

                    case "contact_phone_numbers":
                        dispatch(
                            phoneNumbersActions.phoneNumbersFetchDataSuccess(
                                items
                            )
                        );
                        break;

                    case "contact_faxes":
                        dispatch(faxesActions.faxesFetchDataSuccess(items));
                        break;

                    case "contact_addresses":
                        dispatch(
                            addressesActions.addressesFetchDataSuccess(items)
                        );
                        break;

                    case "transactions":
                        dispatch(
                            transactionsActions.transactionsFetchDataSuccess(
                                items
                            )
                        );
                        break;

                    case "to-dos":
                        dispatch(toDoActions.toDosFetchDataSuccess(items));
                        break;

                    case "maintenance-requests":
                        dispatch(
                            maintenanceRequestsActions.maintenanceRequestsFetchDataSuccess(
                                items
                            )
                        );
                        break;

                    case "logs":
                        dispatch(logActions.auditLogsFetchDataSuccess(items));
                        break;

                    case "users":
                        dispatch(usersActions.usersFetchDataSuccess(items));
                        break;

                    default:
                        break;
                }
            })
            .catch((error) => {
                dispatch(itemsIsLoading(false));
                dispatch(itemsHasErrored(error));
            });
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
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        axiosInstance
            .delete(`${url}/${itemId}/`)
            .then((response) => {
                dispatch(itemsIsLoading(false));
                switch (url) {
                    case "properties":
                        dispatch(propertyActions.deleteProperty(itemId));
                        break;

                    case "contacts":
                        dispatch(contactsActions.deleteContact(itemId));
                        break;

                    case "transactions":
                        dispatch(transactionsActions.deleteTransaction(itemId));
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
                        dispatch(logActions.deleteAuditLog(itemId));
                        break;

                    case "users":
                        dispatch(usersActions.deleteUser(itemId));
                        break;

                    default:
                        break;
                }
            })
            .catch((error) => {
                dispatch(itemsIsLoading(false));
                dispatch(itemsHasErrored(error));
            });
    };
}

export function handleItemFormSubmit(data, url) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        if (typeof data.id !== "undefined") {
            //send post request to edit the item
            //axiosInstance.patch(`${url}/${data.id}/`, data)
            db.collection(url)
                .doc(data.id)
                .update(data)
                .then((response) => {
                    let savedItem = response.data;
                    dispatch(itemsIsLoading(false));
                    switch (url) {
                        case "properties":
                            dispatch(propertyActions.editProperty(savedItem));
                            break;

                        case "contacts":
                            dispatch(contactsActions.editContact(savedItem));
                            break;

                        case "transactions":
                            dispatch(
                                transactionsActions.editTransaction(savedItem)
                            );
                            break;

                        case "to-dos":
                            dispatch(toDoActions.editToDo(savedItem));
                            break;

                        case "maintenance-requests":
                            dispatch(
                                maintenanceRequestsActions.editMaintenanceRequest(
                                    savedItem
                                )
                            );
                            break;

                        case "logs":
                            dispatch(logActions.editAuditLog(savedItem));
                            break;

                        case "users":
                            dispatch(usersActions.editUser(savedItem));
                            break;

                        default:
                            break;
                    }
                })
                .catch((error) => {
                    dispatch(itemsIsLoading(false));
                    dispatch(itemsHasErrored(error));
                });
        }
        //send post to create item
        else {
            //axiosInstance.post(`${url}/`, data)
            delete data.id;
            db.collection(url)
                .add(data)
                .then((response) => {
                    let savedItem = response.data;
                    dispatch(itemsIsLoading(false));
                    switch (url) {
                        case "properties":
                            dispatch(propertyActions.addProperty(savedItem));
                            break;

                        case "contacts":
                            dispatch(contactsActions.addContact(savedItem));
                            break;

                        case "transactions":
                            dispatch(
                                transactionsActions.addTransaction(savedItem)
                            );
                            break;

                        case "to-dos":
                            dispatch(toDoActions.addToDo(savedItem));
                            break;

                        case "maintenance-requests":
                            dispatch(
                                maintenanceRequestsActions.addMaintenanceRequest(
                                    savedItem
                                )
                            );
                            break;

                        case "logs":
                            dispatch(logActions.addAuditLog(savedItem));
                            break;

                        case "users":
                            dispatch(usersActions.addUser(savedItem));
                            break;

                        default:
                            break;
                    }
                })
                .catch((error) => {
                    console.log("Error => ", error.response);
                    dispatch(itemsIsLoading(false));
                    dispatch(itemsHasErrored(error));
                });
        }
    };
}

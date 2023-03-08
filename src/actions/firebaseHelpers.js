import {firestore} from "../firebase";

const db = firestore.collection("tenant");

let currentTenantId = '';

export function setTenantId(tenantId) {
    currentTenantId = tenantId
}

export function getDatabaseRef (){
    return db.doc(currentTenantId)
}
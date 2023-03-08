import {firebaseFirestore} from "../firebase";

const db = firebaseFirestore.collection("tenant");

let currentTenantId = '';

export function setTenantId(tenantId) {
    currentTenantId = tenantId
}

export function getDatabaseRef (){
    return db.doc(currentTenantId)
}
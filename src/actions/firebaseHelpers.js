import app from "../firebase";

const db = app.firestore().collection("tenant");

let currentTenantId = '';

export function setTenantId(tenantId) {
    currentTenantId = tenantId
}

export function getDatabaseRef (){
    return db.doc(currentTenantId)
}
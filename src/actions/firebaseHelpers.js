import { firebaseFirestore } from "../firebase";

// The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
// for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
// to disable clean-up.
firebaseFirestore.settings({
    cacheSizeBytes: 50048576
  });
firebaseFirestore.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

const db = firebaseFirestore.collection("tenant");

let currentTenantId = '';

export function setTenantId(tenantId) {
    currentTenantId = tenantId
}

export function getDatabaseRef() {
    return db.doc(currentTenantId)
}
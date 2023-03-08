import {auth as firebaseAuth, firestore, functions, storage, initializeApp} from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDea8xDrQZxfQKTg7aci3pgfgd-bLr7Wu0",
	authDomain: "propertymanager-a321f.firebaseapp.com",
	databaseURL: "https:propertymanager-a321f.firebaseio.com",
	projectId: "propertymanager-a321f",
	storageBucket: "propertymanager-a321f.appspot.com",
	messagingSenderId: "406461434890",
	appId: "1:406461434890:web:6519f652652d8efd0ce3f3",
	measurementId: "G-X1Y3NZTL1J",
};
// Initialize firebase
initializeApp(firebaseConfig);
export const auth = firebaseAuth()
export const firebaseStorage = storage()
export const firebaseFirestore = firestore()
export const firebaseFunctions = functions()

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from './reducers/reducers'
import AppTheme from "./components/AppTheme";


const store = createStore(reducers, applyMiddleware(thunk))
ReactDOM.render(
	<AppTheme>
	<App store={store} /> </AppTheme>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// import { removeItem, addItem, editItem } from "./actions";

// //Log the initial state
// const initialState = store.getState()
// console.log('Initial State => ', initialState)
// //Log the state every time it changes 
// //Subscribe returns a function for unregestering the listener 
// const unSubscribe = store.subscribe(() => {
//     return console.log(store.getState())
// })

// //diptach some actions 
// store.dispatch(addItem({}))
// store.dispatch(editItem({}))
// store.dispatch(removeItem(1))
// //stop listening to state updates 
// unSubscribe()

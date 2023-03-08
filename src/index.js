import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from './reducers/reducers'
import { setTenantId } from './actions/firebaseHelpers'
import AppTheme from "./components/AppTheme";

const saveTenantId = store => next => action => {
	if (action.type === 'SET_CURRENT_USER') {
		setTenantId(action.user ? action.user.tenant_id : '')
	}
	return next(action)
}

const store = createStore(reducers, applyMiddleware(thunk, saveTenantId))
ReactDOM.render(
	<AppTheme>
		<App store={store} /> </AppTheme>, document.getElementById('root'));
serviceWorker.unregister();


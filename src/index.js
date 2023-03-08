import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from './reducers/reducers'
import { setTenantId } from './actions/firebaseHelpers'
import { setCompanyProfile } from './assets/PrintingHelper'
import AppTheme from "./components/AppTheme";

const saveTenantId = store => next => action => {
	if (action.type === 'SET_CURRENT_USER') {
		// setTenantId(action.user ? action.user.tenant_id : '')
		setTenantId('wPEY7XfSReuoOEOa22aX')
	} else if (action.type === "COMPANY_PROFILES_FETCH_DATA_SUCCESS") {
		setCompanyProfile(action.companyProfiles[0] || {})
	}
	return next(action)
}

const store = createStore(reducers, applyMiddleware(thunk, saveTenantId))
ReactDOM.render(
	<AppTheme>
		<App store={store} /> </AppTheme>, document.getElementById('root'));
serviceWorker.unregister();


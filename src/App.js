import React from 'react';
import 'date-fns';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardPage from "./Routes/Dashboard";
import PropertiesPage from "./Routes/Properties";
import MaintenancesPage from "./Routes/Maintenances";
import UsersPage from "./Routes/Users";
import UserPage from "./Routes/UserPage";
import MaintenanceRequestPage from "./Routes/MaintenanceRequestPage";
import ToDosPage from "./Routes/ToDos";
import AuditLogsPage from "./Routes/AuditLogs";
import TransactionsPage from "./Routes/Transactions";
import PropertyPage from './Routes/PropertyPage';
import ContactPage from "./Routes/ContactPage";
import ContactsPage from "./Routes/Contacts";
import TransactionPage from './Routes/TransactionPage';


const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
         <Route path='/' exact component={DashboardPage} />
         <Route path='/maintenance-requests/new' component={MaintenanceRequestPage} />
         <Route path='/maintenance-requests' component={MaintenancesPage} />
         <Route path='/to-dos' component={ToDosPage} />
         <Route path='/audit-logs' component={AuditLogsPage} />
         <Route path='/properties/new' component={PropertyPage} />
         <Route path='/users/new' component={UserPage} />
         <Route path='/users/' component={UsersPage} />
         <Route path='/transactions/new' component={TransactionPage} />
          <Route path='/properties/:propertyId/edit' component={PropertyPage} /> 
		  <Route exact path='/contacts/' component={ContactsPage} />
          <Route path='/transactions/:transactionId/edit' component={TransactionPage} /> 
		  <Route exact path='/contacts/new' component={ContactPage} />
		  <Route exact path='/contacts/:contactId/edit' component={ContactPage} />
          <Route path='/properties/' component={PropertiesPage} />
          <Route path='/transactions/' component={TransactionsPage} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;

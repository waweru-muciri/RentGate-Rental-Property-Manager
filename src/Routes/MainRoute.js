import React, { useEffect } from "react";
import { connect } from "react-redux";
import { itemsFetchData } from "../actions/actions";
import { withRouter } from "react-router-dom";
//here are all the subroutes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropertiesPage from "./Properties";
import MaintenancesPage from "./Maintenances";
import UsersPage from "./Users";
import UserPage from "./UserPage";
import MaintenanceRequestPage from "./MaintenanceRequestPage";
import ToDosPage from "./ToDos";
import AuditLogsPage from "./AuditLogs";
import TransactionsPage from "./Transactions";
import PropertyPage from "./PropertyPage";
import ContactPage from "./ContactPage";
import ContactsPage from "./Contacts";
import TransactionPage from "./TransactionPage";
import DashBoard from "./DashBoard";

let MainPage = ({
    properties,
    maintenanceRequests,
    transactions,
    contacts,
    contact_faxes,
    contact_emails,
    contact_phone_numbers,
    contact_addresses,
    isLoading,
    match,
    error,
    fetchData,
}) => {

    // useEffect(() => {
    //     if (!properties.length) {
    //         fetchData([
    //             "properties",
    //             "transactions",
    //             "maintenance-requests",
    //             "property_media",
    //             "to-dos",
    //             "contacts",
    //             "contact_phone_numbers",
    //             "contact_emails",
    //             "contact_faxes",
    //             "contact_addresses",
    //         ]);
    //     }
    // }, [
    //     contacts,
    //     transactions,
    //     maintenanceRequests,
    //     contact_emails,
    //     properties,
    //     contact_phone_numbers,
    //     contact_faxes,
    //     contact_emails,
    //     contact_addresses,
    //     fetchData,
    // ]);

    return (
        <React.Fragment>
        <Router>
        <Switch>
          <Route path={`${match.path}dashboard`} component={DashBoard}/>
          <Route
            path={`${match.path}maintenance-requests/new`}
            component={MaintenanceRequestPage}
          />
          <Route
            path={`${match.path}maintenance-requests/:maintenanceRequestId/edit`}
            component={MaintenanceRequestPage}
          />
          <Route path={`${match.path}maintenance-requests`} component={MaintenancesPage} />
          <Route path={`${match.path}to-dos`} component={ToDosPage} />
          <Route path={`${match.path}audit-logs`} component={AuditLogsPage} />
          <Route path={`${match.path}properties/new`} component={PropertyPage} />
          <Route path={`${match.path}users/new`} component={UserPage} />
          <Route path={`${match.path}users`} component={UsersPage} />
          <Route path={`${match.path}transactions/new`} component={TransactionPage} />
          <Route path={`${match.path}properties/:propertyId/edit`} component={PropertyPage} />
          <Route exact path={`${match.path}contacts`} component={ContactsPage} />
          <Route
            path={`${match.path}transactions/:transactionId/edit`}
            component={TransactionPage}
          />
          <Route exact path={`${match.path}contacts/new`} component={ContactPage} />
          <Route
            exact
            path={`${match.path}contacts/:contactId/edit`}
            component={ContactPage}
          />
          <Route path={`${match.path}properties`} component={PropertiesPage} />
          <Route path={`${match.path}transactions`} component={TransactionsPage} />
        </Switch>
      </Router>
        </React.Fragment>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        contacts: state.contacts,
        properties: state.properties,
        transactions: state.transactions,
        maintenanceRequests: state.maintenanceRequests,
        contact_emails: state.contact_emails,
        contact_phone_numbers: state.contact_phone_numbers,
        contact_faxes: state.contact_faxes,
        contact_addresses: state.contact_addresses,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => {
            dispatch(itemsFetchData(url));
        },
    };
};

MainPage = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default withRouter(MainPage);

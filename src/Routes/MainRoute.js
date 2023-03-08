import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  itemsFetchData,
  setCurrentUser,
  itemsHasErrored, getFirebaseUserDetails
} from "../actions/actions";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  withRouter,
} from "react-router-dom";
import TenantStatementsPage from "./ContactStatements";
import PropertyIncomeStatement from "./PropertyIncomeStatement";
import PropertiesPage from "./Properties";
import PropertyPage from "./PropertyPage";
import PropertyUnitPage from "./PropertyUnitPage";
import PropertyDetailsPage from "./PropertyDetails";
import TenantDetailsPage from "./TenantDetailsPage";
import MaintenancesPage from "./Maintenances";
import ReportsPage from "./Reports";
import UsersPage from "./Users";
import EmailsPage from "./Emails";
import EmailPage from "./EmailPage";
import ExpensePage from "./ExpensePage";
import ExpensesPage from "./Expenses";
import UserPage from "./UserPage";
import UserProfilePage from "./UserProfilePage";
import MaintenanceRequestPage from "./MaintenanceRequestPage";
import ToDosPage from "./ToDos";
import LeaseRenewalsPage from "./LeaseRenewals";
import AuditLogsPage from "./AuditLogs";
import TransactionsPage from "./Transactions";
import TransactionPage from "./TransactionPage";
import PaymentsPage from "./Payments";
import PaymentPage from "./PaymentPage";
import ContactPage from "./ContactPage";
import ContactsPage from "./Contacts";
import NoticesPage from "./Notices";
import RentRollPage from "./RentRoll";
import NoticePage from "./NoticePage";
import MeterReadingsPage from "./MeterReadingsPage";
import MeterReadingPage from "./MeterReadingPage";
import DashBoard from "./DashBoard";
import AppNav from "../components/AppNav";
import app from '../firebase'


let MainPage = ({
  currentUser,
  match,
  fetchData, setUser, setError
}) => {
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      app.auth().onAuthStateChanged(
        function (user) {
          if (user) {
            // User is signed in 
            //set the database reference to be used by user
            //get details about user
            const userDetails = getFirebaseUserDetails(user)
            setUser(userDetails)
          } else {
            // User is signed out.
            setUser(null);
            history.push("/login");
          }
        },
        function (error) {
          setUser(null);
          setError(error.message);
          console.log('An error during onauthstatechanged =>', error);
        });
    }
    else {
      fetchData([
        "properties",
        "property_units",
        "unit-charges",
        // "property_accounts",
        "transactions",
        // "maintenance-requests",
        // "property_media",
        "contacts",
        // "contact_phone_numbers",
        // "contact_emails",
        // "contact_faxes",
        // "contact_addresses",
        // "notices",
        // "to-dos",
        "users",
        "expenses",
        "meter_readings",
      ]);
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      {currentUser ?
        <Router>
          <AppNav
            pageTitle={"Yarra Property Management"}
          />
          <Switch>
            <Route exact path={`${match.path}reports/property-income`} component={PropertyIncomeStatement} />
            <Route exact path={`${match.path}`} component={DashBoard} />
            <Route exact path={`${match.path}reports/property-performance`} component={ReportsPage} />
            <Route exact path={`${match.path}properties/lease-renewals`} component={LeaseRenewalsPage} />
            <Route exact path={`${match.path}rent-roll`} component={RentRollPage} />
            <Route exact path={`${match.path}emails`} component={EmailsPage} />
            <Route
              exact
              path={`${match.path}maintenance-requests/new`}
              component={MaintenanceRequestPage}
            />
            <Route
              exact
              path={`${match.path}maintenance-requests/:maintenanceRequestId/edit`}
              component={MaintenanceRequestPage}
            />
            <Route
              exact
              path={`${match.path}maintenance-requests`}
              component={MaintenancesPage}
            />
            <Route exact path={`${match.path}to-dos`} component={ToDosPage} />
            <Route
              exact
              path={`${match.path}audit-logs`}
              component={AuditLogsPage}
            />
            <Route
              exact
              path={`${match.path}properties/new`}
              component={PropertyPage}
            />
            <Route exact path={`${match.path}users/new`} component={UserPage} />
            <Route
              exact
              path={`${match.path}profile`}
              component={UserProfilePage}
            />
            <Route
              exact
              path={`${match.path}users/:userId/edit`}
              component={UserPage}
            />
            <Route exact path={`${match.path}users`} component={UsersPage} />
            <Route
              exact
              path={`${match.path}transactions/new`}
              component={TransactionPage}
            />
            <Route
              exact
              path={`${match.path}payments/new`}
              component={PaymentPage}
            />
            <Route
              exact
              path={`${match.path}properties/:propertyId/edit`}
              component={PropertyPage}
            />
            <Route
              exact
              path={`${match.path}properties/:propertyId/details`}
              component={PropertyDetailsPage}
            />
            <Route
              exact
              path={`${match.path}contacts/:contactId/details`}
              component={TenantDetailsPage}
            />
            <Route
              exact
              path={`${match.path}properties/:propertyId/details/:propertyUnitId/edit`}
              component={PropertyUnitPage}
            />
            <Route
              exact
              path={`${match.path}properties/:propertyId/details/new`}
              component={PropertyUnitPage}
            />
            <Route
              exact
              path={`${match.path}contacts`}
              component={ContactsPage}
            />
            <Route
              exact
              path={`${match.path}transactions/:transactionId/edit`}
              component={TransactionPage}
            />
            <Route
              exact
              path={`${match.path}payments/:paymentId/edit`}
              component={PaymentPage}
            />
            <Route
              exact
              path={`${match.path}contacts/new`}
              component={ContactPage}
            />
            <Route
              exact
              path={`${match.path}property_expenditure/new`}
              component={ExpensePage}
            />
            <Route
              exact
              path={`${match.path}property_expenditure`}
              component={ExpensesPage}
            />
            <Route
              exact
              path={`${match.path}property_expenditure/:expenseId/edit`}
              component={ExpensePage}
            />

            <Route exact path={`${match.path}emails/new`} component={EmailPage} />
            <Route
              exact
              path={`${match.path}contacts/:contactId/edit`}
              component={ContactPage}
            />
            <Route
              exact
              path={`${match.path}notices/new`}
              component={NoticePage}
            />
            <Route
              exact
              path={`${match.path}notices`}
              component={NoticesPage}
            />
            <Route
              exact
              path={`${match.path}notices/:noticeId/edit`}
              component={NoticePage}
            />
            <Route
              exact
              path={`${match.path}properties/meter-reading/:meterReadingId/edit`}
              component={MeterReadingPage}
            />
            <Route exact path={`${match.path}properties`} component={PropertiesPage} />
            <Route exact path={`${match.path}properties/meter-reading`} component={MeterReadingsPage} />
            <Route exact path={`${match.path}properties/meter-reading/new`} component={MeterReadingPage} />
            <Route exact path={`${match.path}reports/tenant-statements`} component={TenantStatementsPage} />
            <Route exact path={`${match.path}transactions`} component={TransactionsPage}/>
            <Route exact path={`${match.path}payments`} component={PaymentsPage}/>
          </Switch>
        </Router>
        : null}
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    match: ownProps.match,
    properties: state.properties,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (tenant, url) => dispatch(itemsFetchData(tenant, url)),
    setUser: (user) => dispatch(setCurrentUser(user)),
    setError: (error) => dispatch(itemsHasErrored(error)),
  };
};

MainPage = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default withRouter(MainPage);

import React, { useEffect, Suspense, lazy } from "react";
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
import DashBoard from "./DashBoard";
import LoadingBackdrop from '../components/LoadingBackdrop'
import ErrorBoundary from '../components/ErrorBoundary'
import app from '../firebase'
import PropertiesPage from "./Properties";
import PropertyPage from "./PropertyPage";
import PropertyUnitPage from "./PropertyUnitPage";
import TenantDetailsPage from "./TenantDetailsPage";
import PaymentEditForm from "../components/transactions/PaymentEditForm";
const ReportsPage = lazy(() => import('./Reports'));
const ExpensesPage = lazy(() => import('./Expenses'));
const ExpensePage = lazy(() => import('./ExpensePage'));
const UsersPage = lazy(() => import('./Users'));
const LeasePage = lazy(() => import('./LeasePage'));
const LeasesPage = lazy(() => import('./Leases'));
const AuditLogsPage = lazy(() => import('./AuditLogs'));
const RentRollPage = lazy(() => import('./RentRoll'));
const ContactsPage = lazy(() => import('./Contacts'));
const ContactPage = lazy(() => import('./ContactPage'));
const PaymentPage = lazy(() => import('./PaymentPage'));
const PaymentsPage = lazy(() => import('./Payments'));
const MaintenancesPage = lazy(() => import('./Maintenances'));
const PropertyDetailsPage = lazy(() => import('./PropertyDetails'));
const AdminUserProfilePage = lazy(() => import('./AdminUserProfilePage'));
const UserPage = lazy(() => import('./UserPage'));
const MaintenanceRequestPage = lazy(() => import('./MaintenanceRequestPage'));
const ToDosPage = lazy(() => import('./ToDos'));
const NoticePage = lazy(() => import('./NoticePage'));
const NoticesPage = lazy(() => import('./Notices'));
const PropertyIncomeStatement = lazy(() => import('./PropertyIncomeStatement'));
const TenantStatementsPage = lazy(() => import('./ContactStatements'));
const EmailPage = lazy(() => import('./EmailPage'));
const EmailsPage = lazy(() => import('./Emails'));
const MeterReadingPage = lazy(() => import('./MeterReadingPage'));
const MeterReadingsPage = lazy(() => import('./MeterReadings'));
const OtherChargesPage = lazy(() => import('./OtherCharges'));


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
        "transactions-charges",
        "charge-payments",
        // "maintenance-requests",
        // "property_media",
        "contacts",
        // "notices",
        "leases",
        // "to-dos",
        "users",
        "expenses",
        "meter_readings",
      ]);
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      { currentUser ?
        <Router>
          <ErrorBoundary>
            <Suspense fallback={<LoadingBackdrop open={true} />}>
              <Switch>
                <Route exact path={`${match.path}reports/property-income`} component={PropertyIncomeStatement} />
                <Route exact path={`${match.path}`} component={DashBoard} />
                <Route exact path={`${match.path}reports/property-performance`} component={ReportsPage} />
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
                  path={`/admin/profile`}
                  component={AdminUserProfilePage}
                />
                <Route
                  exact
                  path={`${match.path}users/:userId/edit`}
                  component={UserPage}
                />
                <Route exact path={`${match.path}users`} component={UsersPage} />
                <Route
                  exact
                  path={`${match.path}leases/new`}
                  component={LeasePage}
                />
                <Route
                  exact
                  path={`${match.path}payments/:chargeId/new`}
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
                  path={`${match.path}leases/:leaseId/edit`}
                  component={LeasePage}
                />
                <Route
                  exact
                  path={`${match.path}properties/other-charges`}
                  component={OtherChargesPage}
                />
                <Route
                  exact
                  path={`${match.path}payments/:paymentId/edit`}
                  component={PaymentEditForm}
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
                <Route exact path={`${match.path}leases`} component={LeasesPage} />
                <Route exact path={`${match.path}payments`} component={PaymentsPage} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </Router>
        : null}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
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

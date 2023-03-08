import firebase from "firebase";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  itemsFetchData,
  setCurrentUser,
  setPaginationPage,
} from "../actions/actions";
//here are all the subroutes
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  withRouter,
  Link,
} from "react-router-dom";
import PropertiesPage from "./Properties";
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
import AuditLogsPage from "./AuditLogs";
import TransactionsPage from "./Transactions";
import PropertyPage from "./PropertyPage";
import ContactPage from "./ContactPage";
import ContactsPage from "./Contacts";
import NoticesPage from "./Notices";
import TransactionPage from "./TransactionPage";
import DashBoard from "./DashBoard";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import GroupIcon from "@material-ui/icons/Group";
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HistoryIcon from "@material-ui/icons/History";
import MoneyIcon from "@material-ui/icons/Money";
import ContactsIcon from "@material-ui/icons/Contacts";
import DashboardIcon from "@material-ui/icons/Dashboard";
import HouseIcon from "@material-ui/icons/House";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Head from "../components/Head";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  profileAvatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const navigationLinks = [
  { text: "Home", to: "/", icon: <DashboardIcon /> },
  { text: "Rentals", to: "/properties/rentals/", icon: <HouseIcon /> },
  { text: "Contacts", to: "/contacts", icon: <ContactsIcon /> },
  { text: "Users", to: "/users", icon: <GroupIcon /> },
  {
    text: "Maintenance Requests",
    to: "/maintenance-requests",
    icon: <EventNoteIcon />,
  },
  { text: "To-Dos", to: "/to-dos", icon: <AssignmentIcon /> },
  { text: "Email", to: "/emails", icon: <ContactMailIcon /> },
  { text: "Reports", to: "/reports", icon: <TimelineIcon /> },
  { text: "Audit Logs", to: "/audit-logs", icon: <HistoryIcon /> },
];

const reportLinkNestedLinks = [
  { text: "Transactions", to: "/transactions", icon: <AttachMoneyIcon /> },
  {
    text: "Property Expenditure",
    to: "/expenses",
    icon: <AccountBalanceWalletIcon />,
  },
];

let MainPage = ({
  currentUser,
  properties,
  selectedTab,
  setSelectedTab,
  match,
  error,
  fetchData,
  setUser,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (!properties.length) {
      fetchData([
        "properties",
        "transactions",
        "maintenance-requests",
        "property_media",
        "contacts",
        "contact_phone_numbers",
        "contact_emails",
        "contact_faxes",
        "contact_addresses",
        "notices",
        "to-dos",
        "users",
        "expenses",
      ]);
    }
  }, [properties]);

  useEffect(() => {
    if (!currentUser) {
      firebase.auth().onAuthStateChanged(
        function (user) {
          if (user) {
            // User is signed in.
            const userDetails = {
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              uid: user.uid,
              phoneNumber: user.phoneNumber,
              providerData: user.providerData,
            };
            setUser(userDetails);
          } else {
            // User is signed out.
            setUser(null);
            history.push("/login");
          }
        },
        function (error) {
          console.log(error);
        }
      );
    }
  }, [currentUser]);

  function AppNavLayout(props) {
    let { currentUser, pageTitle } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { selectedTab, setSelectedTab } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isProfileMenuOpen = Boolean(anchorEl);
    const [accountNavOpen, setAccountNavOpen] = React.useState(false);

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
      setAnchorEl(null);
    };
    const menuId = "primary-search-account-menu";

    const handleDrawerToggle = () => {
      setOpen(!open);
    };

    const toggleAccountsNav = () => {
      setAccountNavOpen(!accountNavOpen);
    };

    const handleListItemClick = (index) => {
      setSelectedTab(index);
    };

    return (
      <div className={classes.root}>
        <Head title={pageTitle} />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              Yarra Property Management
            </Typography>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar
                alt="Contact Image"
                src={currentUser ? currentUser.photoURL : ""}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              id={menuId}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  history.push("/profile");
                }}
              >
                <ListItemIcon>
                  <AccountBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit Profile" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  firebase
                    .auth()
                    .signOut()
                    .then(function () {
                      // Sign-out successful.
                      history.push("/login");
                    })
                    .catch(function (error) {
                      // An error happened.
                    });
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List component="div" disablePadding>
            {navigationLinks.map((linkItem, index) => (
              <React.Fragment key={index}>
                <ListItem
                  component={Link}
                  to={linkItem.to}
                  button
                  key={linkItem.text}
                  selected={selectedTab === index}
                  onClick={(event) => {
                    handleDrawerToggle();
                    handleListItemClick(index);
                  }}
                >
                  <ListItemIcon>{linkItem.icon}</ListItemIcon>
                  <ListItemText primary={linkItem.text} />
                </ListItem>
              </React.Fragment>
            ))}
            <ListItem
              button
              key={20}
              selected={selectedTab === 20}
              onClick={(event) => {
                event.preventDefault();
                toggleAccountsNav();
              }}
            >
              <ListItemIcon>
                <MoneyIcon />
              </ListItemIcon>
              <ListItemText primary={"Accounts"} />
              {accountNavOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={accountNavOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {reportLinkNestedLinks.map(
                  (innerLinkItem, innerLinkItemIndex) => (
                    <ListItem
                      component={Link}
                      to={innerLinkItem.to}
                      button
                      key={innerLinkItem.text}
                      selected={selectedTab === innerLinkItemIndex}
                      onClick={(event) => {
                        handleDrawerToggle();
                        handleListItemClick(20);
                      }}
                    >
                      <ListItemIcon>{innerLinkItem.icon}</ListItemIcon>
                      <ListItemText primary={innerLinkItem.text} />
                    </ListItem>
                  )
                )}
              </List>
            </Collapse>
          </List>
        </Drawer>
        <div className={classes.drawerHeader} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Router>
        <AppNavLayout
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          currentUser={currentUser}
          pageTitle={"Yarra Property Management"}
        />
        <Switch>
          <Route exact path={`${match.path}`} component={DashBoard} />
          <Route exact path={`${match.path}reports`} component={ReportsPage} />
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
            path={`${match.path}properties/:propertyId/edit`}
            component={PropertyPage}
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
            path={`${match.path}contacts/new`}
            component={ContactPage}
          />
          <Route
            exact
            path={`${match.path}expenses/new`}
            component={ExpensePage}
          />
          <Route
            exact
            path={`${match.path}expenses`}
            component={ExpensesPage}
          />
          <Route
            exact
            path={`${match.path}expenses/:expenseId/edit`}
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
            path={`${match.path}contacts/notices/new`}
            component={NoticesPage}
          />
          <Route
            exact
            path={`${match.path}contacts/notices/:noticeId/edit`}
            component={NoticesPage}
          />
          <Route path={`${match.path}properties`} component={PropertiesPage} />
          <Route
            exact
            path={`${match.path}transactions`}
            component={TransactionsPage}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    properties: state.properties,
    currentUser: state.currentUser,
    selectedTab: state.selectedTab,
    setSelectedTab: state.setSelectedTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => {
      dispatch(itemsFetchData(url));
    },
    setUser: (user) => {
      dispatch(setCurrentUser(user));
    },
    setSelectedTab: (index) => {
      dispatch(setPaginationPage(index));
    },
  };
};

MainPage = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default withRouter(MainPage);

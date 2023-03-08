import firebase from "firebase";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { itemsFetchData, setCurrentUser } from "../actions/actions";
import { withRouter } from "react-router-dom";
//here are all the subroutes
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
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
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import HistoryIcon from "@material-ui/icons/History";
import ContactsIcon from "@material-ui/icons/Contacts";
import HomeIcon from "@material-ui/icons/Home";
import HouseIcon from "@material-ui/icons/House";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { Link } from "react-router-dom";
import Head from "../components/Head";
import { setPaginationPage } from "../actions/actions";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
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

const nestedNavigations = [
  { text: "Home", to: "/", icon: <HomeIcon /> },
  { text: "Rentals", to: "/properties/rentals/", icon: <HouseIcon /> },
  { text: "Contacts", to: "/contacts", icon: <ContactsIcon /> },
  { text: "Users", to: "/users", icon: <AccountCircleIcon /> },
  {
    text: "Maintenance Requests",
    to: "/maintenance-requests",
    icon: <EventNoteIcon />,
  },
  { text: "Transactions", to: "/transactions", icon: <AttachMoneyIcon /> },
  { text: "To-Dos", to: "/to-dos", icon: <AssignmentIcon /> },
  { text: "SMS", to: "/sms", icon: <ContactPhoneIcon /> },
  { text: "Email", to: "/email", icon: <ContactMailIcon /> },
  { text: "Audit Logs", to: "/audit-logs", icon: <HistoryIcon /> },
];

let MainPage = ({
  mediaFiles,
  properties,
  maintenanceRequests,
  transactions,
  contacts,
  contact_faxes,
  contact_emails,
  contact_phone_numbers,
  contact_addresses,
  currentUser,
  isLoading,
  selectedTab, setSelectedTab,
  match,
  error,
  fetchData,
  setUser,
}) => {
  const history = useHistory()

  useEffect(() => {
    if (!properties.length) {
      fetchData([
        "properties",
        "transactions",
        "maintenance-requests",
        "property_media",
        "to-dos",
        "contacts",
        "contact_phone_numbers",
        "contact_emails",
        "contact_faxes",
        "contact_addresses",
      ]);
    }
  }, [
    contacts,
    transactions,
    maintenanceRequests,
    contact_emails,
    properties,
    contact_phone_numbers,
    contact_faxes,
    contact_emails,
    contact_addresses,
    mediaFiles,
    fetchData,
  ]);

  useEffect (() => {
    if(!currentUser){
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
          user.getIdToken().then(function (accessToken) {
            userDetails.accessToken = accessToken;
          });
          setUser(userDetails);
        } else {
          // User is signed out.
          setUser(null);
          history.push('/login');
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "primary-search-account-menu";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (event, index) => {
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
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(
              classes.menuButton,
              open && classes.hide
            )}
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
            <MenuItem onClick={handleProfileMenuClose}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              My account
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              firebase.auth().signOut().then(function() {
                // Sign-out successful.
                history.push('/login')
              }).catch(function(error) {
                // An error happened.
              });
            }}>
              Sign Out
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List component="div" disablePadding>
          {nestedNavigations.map(({ text, to, icon }, index) => (
            <React.Fragment key={index}>
              <ListItem
                component={Link}
                to={to}
                button
                key={text}
                selected={selectedTab === index}
                onClick={(event) => {
                  handleListItemClick(event, index);
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <div className={classes.drawerHeader} />
    </div>
  );
}

  return (
    <React.Fragment>
   <Router>
    <AppNavLayout selectedTab={selectedTab} setSelectedTab={setSelectedTab} currentUser={currentUser} pageTitle={"Yarra Property Management"}/>
        <Switch>
          <Route path={`${match.path}dashboard`} component={DashBoard} />
          <Route
            path={`${match.path}maintenance-requests/new`}
            component={MaintenanceRequestPage}
          />
          <Route
            path={`${match.path}maintenance-requests/:maintenanceRequestId/edit`}
            component={MaintenanceRequestPage}
          />
          <Route
            path={`${match.path}maintenance-requests`}
            component={MaintenancesPage}
          />
          <Route path={`${match.path}to-dos`} component={ToDosPage} />
          <Route path={`${match.path}audit-logs`} component={AuditLogsPage} />
          <Route
            path={`${match.path}properties/new`}
            component={PropertyPage}
          />
          <Route path={`${match.path}users/new`} component={UserPage} />
          <Route path={`${match.path}users`} component={UsersPage} />
          <Route
            path={`${match.path}transactions/new`}
            component={TransactionPage}
          />
          <Route
            path={`${match.path}properties/:propertyId/edit`}
            component={PropertyPage}
          />
          <Route
            exact
            path={`${match.path}contacts`}
            component={ContactsPage}
          />
          <Route
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
            path={`${match.path}contacts/:contactId/edit`}
            component={ContactPage}
          />
          <Route path={`${match.path}properties`} component={PropertiesPage} />
          <Route
            path={`${match.path}transactions`}
            component={TransactionsPage}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    contacts: state.contacts,
    mediaFiles: state.mediaFiles,
    properties: state.properties,
    transactions: state.transactions,
    maintenanceRequests: state.maintenanceRequests,
    contact_emails: state.contact_emails,
    contact_phone_numbers: state.contact_phone_numbers,
    contact_faxes: state.contact_faxes,
    contact_addresses: state.contact_addresses,
    currentUser: state.currentUser,
    isLoading: state.isLoading,
        selectedTab: state.selectedTab,
    error: state.error,
    match: ownProps.match,
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

import React from "react";
import { connect } from "react-redux";
import {
    firebaseSignOutUser, setPaginationPage, toggleDrawer
} from "../actions/actions";
import {
    withRouter,
    Link,
} from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import HistoryIcon from "@material-ui/icons/History";
import MoneyIcon from "@material-ui/icons/Money";
import ContactsIcon from "@material-ui/icons/Contacts";
import DashboardIcon from "@material-ui/icons/Dashboard";
import HouseIcon from "@material-ui/icons/House";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AssessmentIcon from '@material-ui/icons/Assessment';
import NoteIcon from '@material-ui/icons/Note';
import LockIcon from '@material-ui/icons/Lock';
import ApartmentIcon from '@material-ui/icons/Apartment';
import PaymentIcon from '@material-ui/icons/Payment';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ScheduleIcon from '@material-ui/icons/Schedule';
import WorkIcon from '@material-ui/icons/Work';
import SettingsIcon from '@material-ui/icons/Settings';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import ImportExportIcon from '@material-ui/icons/ImportExport';


const navigationLinks = [
    { text: "Home", to: "/app/", icon: <DashboardIcon /> },
    { text: "Tenants", to: "/app/contacts", icon: <ContactsIcon /> },
    { text: "User Management", to: "/app/users", icon: <GroupAddIcon /> },
    { text: "Email", to: "/app/emails", icon: <ContactMailIcon /> },
    { text: "Account Settings", to: "/app/account-settings", icon: <SettingsIcon /> },
    { text: "Documents Templates", to: "/app/documents-templates", icon: <ImportExportIcon /> },
    { text: "Audit Logs", to: "/app/audit-logs", icon: <HistoryIcon /> },
];
const othersLinkNestedLinks = [
    { text: "Vacating Notices", to: "/app/notices", icon: <NoteIcon /> },
    { text: "Maintenance Requests", to: "/app/maintenance-requests", icon: <EventNoteIcon /> },
    { text: "To-Dos", to: "/app/to-dos", icon: <AssignmentIcon /> },
];

const propertyLinkNestedLinks = [
    { text: "Properties", to: "/app/properties", icon: <ApartmentIcon /> },
    { text: "Rental Agreements", to: "/app/leases", icon: <WorkIcon /> },
    { text: "Meter Readings", to: "/app/meter-reading", icon: <MonetizationOnIcon /> },
];

const reportLinkNestedLinks = [
    // *** NOTE *** include relevant data points on each of these modules for easy reference.
    //show income here from all charges and provide a way to filter the charges according to type, 
    //show payments received from these charges and any outstanding balances
    //show outstanding balances on tenant statements
    {
        text: "Outstanding Balances",
        to: "/app/reports/outstanding-balances",
        icon: <MoneyOffIcon />,
    },
    {
        text: "Properties Performance",
        to: "/app/reports/property-performance",
        icon: <ShowChartIcon />,
    },
    {
        text: "Properties Income Statement",
        to: "/app/reports/property-income",
        icon: <AssessmentIcon />,
    },
    {
        text: "Tenant Statements",
        to: "/app/reports/tenant-statements",
        icon: <AttachMoneyIcon />,
    },
    //show income and expenses received from each property and show net income for each of the expenses
    //show property occupancy rate over periods of time and provide for filtering criteria by property, unit, 
    //generate tenant statements and filtering criteria by each property and others
    //show total of values and other relevant data points
];

const accountsLinkNestedLinks = [
    { text: "Rent Roll", to: "/app/rent-roll", icon: <ScheduleIcon /> },
    { text: "Other Charges", to: "/app/other-charges", icon: <MoneyIcon /> },
    { text: "Payments", to: "/app/payments", icon: <PaymentIcon /> },
    {
        text: "Property Expenses",
        to: "/app/property_expenditure",
        icon: <AccountBalanceWalletIcon />,
    },
];

let AppNavLayout = ({
    setDrawerToggleState,
    handleUserSignOut,
    drawerOpen,
    selectedTab,
    setSelectedTab,
    companyProfile,
    classes,
}) => {
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setDrawerToggleState(!drawerOpen);
    };

    const handleListItemClick = (indexObject) => {
        setSelectedTab(Object.assign({}, selectedTab, { ...indexObject }));
    };

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        {companyProfile.company_name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{ onBackdropClick: handleDrawerToggle }}
                BackdropProps={{ invisible: true }}
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
                    {navigationLinks.slice(0, 2).map((linkItem, parentIndex) => (
                        <React.Fragment key={parentIndex}>
                            <ListItem
                                component={Link}
                                to={linkItem.to}
                                button
                                key={linkItem.text}
                                selected={selectedTab.parent === parentIndex}
                                onClick={(event) => {
                                    handleListItemClick({
                                        parent: parentIndex,
                                    });
                                    handleDrawerToggle();
                                }}
                            >
                                <ListItemIcon>{linkItem.icon}</ListItemIcon>
                                <ListItemText primary={linkItem.text} />
                            </ListItem>
                        </React.Fragment>
                    ))}
                    {/* Property Navigation Links */}
                    <ListItem
                        button
                        key={40}
                        onClick={(event) => {
                            event.preventDefault();
                            if (selectedTab.parent === 40) {
                                handleListItemClick({ parent: -1 });
                            }
                            else {
                                handleListItemClick({ parent: 40 });
                            }
                        }}
                    >
                        <ListItemIcon>
                            <HouseIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Properties"} />
                        {selectedTab.parent === 40 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={selectedTab.parent === 40}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {propertyLinkNestedLinks.map(
                                (innerLinkItem, innerLinkItemIndex) => (
                                    <ListItem
                                        component={Link}
                                        to={innerLinkItem.to}
                                        button
                                        className={classes.nested}
                                        key={innerLinkItem.text}
                                        selected={
                                            selectedTab.parent === 40 &&
                                            selectedTab.nestedLink === 'properties' + innerLinkItemIndex
                                        }
                                        onClick={(event) => {
                                            handleDrawerToggle();
                                            handleListItemClick({
                                                parent: 40,
                                                nestedLink: 'properties' + innerLinkItemIndex,
                                            });
                                        }}
                                    >
                                        <ListItemIcon>{innerLinkItem.icon}</ListItemIcon>
                                        <ListItemText primary={innerLinkItem.text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Collapse>
                    {/*accounts tab here*/}
                    <ListItem
                        button
                        key={20}
                        onClick={(event) => {
                            event.preventDefault();
                            if (selectedTab.parent === 20) {
                                handleListItemClick({ parent: -1 });
                            }
                            else {
                                handleListItemClick({ parent: 20 });
                            }
                        }}
                    >
                        <ListItemIcon>
                            <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Accounts"} />
                        {selectedTab.parent === 20 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={selectedTab.parent === 20}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {accountsLinkNestedLinks.map(
                                (innerLinkItem, innerLinkItemIndex) => (
                                    <ListItem
                                        component={Link}
                                        to={innerLinkItem.to}
                                        button
                                        className={classes.nested}
                                        key={innerLinkItem.text}
                                        selected={
                                            selectedTab.parent === 20 &&
                                            selectedTab.nestedLink === 'account' + innerLinkItemIndex
                                        }
                                        onClick={(event) => {
                                            handleDrawerToggle();
                                            handleListItemClick({
                                                parent: 20,
                                                nestedLink: 'account' + innerLinkItemIndex,
                                            });
                                        }}
                                    >
                                        <ListItemIcon>{innerLinkItem.icon}</ListItemIcon>
                                        <ListItemText primary={innerLinkItem.text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Collapse>
                    {/* others  tab here*/}
                    <ListItem
                        button
                        key={10}
                        onClick={(event) => {
                            event.preventDefault();
                            if (selectedTab.parent === 10) {
                                handleListItemClick({ parent: -1 });
                            }
                            else {
                                handleListItemClick({ parent: 10 });
                            }
                        }}
                    >
                        <ListItemIcon>
                            <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Events"} />
                        {selectedTab.parent === 10 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={selectedTab.parent === 10}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {othersLinkNestedLinks.map(
                                (innerLinkItem, innerLinkItemIndex) => (
                                    <ListItem
                                        component={Link}
                                        to={innerLinkItem.to}
                                        button
                                        className={classes.nested}
                                        key={innerLinkItem.text}
                                        selected={
                                            selectedTab.parent === 10 &&
                                            selectedTab.nestedLink === 'other' + innerLinkItemIndex
                                        }
                                        onClick={(event) => {
                                            handleDrawerToggle();
                                            handleListItemClick({
                                                parent: 10,
                                                nestedLink: 'other' + innerLinkItemIndex,
                                            });
                                        }}
                                    >
                                        <ListItemIcon>{innerLinkItem.icon}</ListItemIcon>
                                        <ListItemText primary={innerLinkItem.text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Collapse>
                    {/*reports tab here*/}
                    <ListItem
                        button
                        key={30}
                        onClick={(event) => {
                            event.preventDefault();
                            if (selectedTab.parent === 30) {
                                handleListItemClick({ parent: -1 });
                            }
                            else {
                                handleListItemClick({ parent: 30 });
                            }
                        }}
                    >
                        <ListItemIcon>
                            <TimelineIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Reports"} />
                        {selectedTab.parent === 30 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={selectedTab.parent === 30}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {reportLinkNestedLinks.map(
                                (innerLinkItem, innerLinkItemIndex) => (
                                    <ListItem
                                        component={Link}
                                        to={innerLinkItem.to}
                                        button
                                        className={classes.nested}
                                        key={innerLinkItem.text}
                                        selected={
                                            selectedTab.parent === 30 &&
                                            selectedTab.nestedLink === 'report' + innerLinkItemIndex
                                        }
                                        onClick={(event) => {
                                            handleDrawerToggle();
                                            handleListItemClick({
                                                parent: 30,
                                                nestedLink: 'report' + innerLinkItemIndex,
                                            });
                                            handleDrawerToggle();
                                        }}
                                    >
                                        <ListItemIcon>{innerLinkItem.icon}</ListItemIcon>
                                        <ListItemText primary={innerLinkItem.text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Collapse>
                    {navigationLinks.slice(2).map((linkItem, listIndex) => {
                        const parentIndex = listIndex + 2;
                        return (
                            <React.Fragment key={parentIndex}>
                                <ListItem
                                    component={Link}
                                    to={linkItem.to}
                                    button
                                    key={linkItem.text}
                                    selected={selectedTab.parent === parentIndex}
                                    onClick={(event) => {
                                        handleListItemClick({
                                            parent: parentIndex,
                                        });
                                        handleDrawerToggle();
                                    }}
                                >
                                    <ListItemIcon>{linkItem.icon}</ListItemIcon>
                                    <ListItemText primary={linkItem.text} />
                                </ListItem>
                            </React.Fragment>
                        )
                    })}
                    <ListItem
                        button
                        key={"sign-out-btn"}
                        selected={selectedTab.parent === "sign-out-btn"}
                        onClick={(event) => {
                            handleUserSignOut();
                        }}
                    >
                        <ListItemIcon><LockIcon /></ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItem>
                </List>
            </Drawer>
            <div className={classes.drawerHeader} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        companyProfile: state.companyProfile[0] || {},
        drawerOpen: state.drawerOpen,
        selectedTab: state.selectedTab,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleUserSignOut: () => dispatch(firebaseSignOutUser()),
        setSelectedTab: (index) => dispatch(setPaginationPage(index)),
        setDrawerToggleState: (toggleValue) => dispatch(toggleDrawer(toggleValue)),
    };
};

AppNavLayout = connect(mapStateToProps, mapDispatchToProps)(AppNavLayout);

export default withRouter(AppNavLayout);

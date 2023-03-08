import Layout from "../components/myLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import exportDataToXSL from "../assets/printToExcel";
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Tab,
    AppBar,
    Box,
    Tabs,
} from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import VacatingNoticesPage from "../components/notices/VacatingNotices";
import { getGendersList } from "../assets/commonAssets.js";

const GENDERS_LIST = getGendersList();

const contactsTableHeadCells = [
    {
        id: "assigned_to",
        numeric: false,
        disablePadding: true,
        label: "Assigned To",
    },
    { id: "title", numeric: false, disablePadding: true, label: "Title" },
    {
        id: "first_name",
        numeric: false,
        disablePadding: true,
        label: "First Name",
    },
    {
        id: "last_name",
        numeric: false,
        disablePadding: true,
        label: "Last Name",
    },
    { id: "gender", numeric: false, disablePadding: true, label: "Gender" },
    {
        id: "date_of_birth",
        numeric: false,
        disablePadding: true,
        label: "Date of Birth",
    },
];

function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box m={2}>{children}</Box>}
            </div>
        );
}

let ContactsPage = ({
    isLoading,
    contacts,
    properties,
    users, 
    currentUser,
    notices,
    contact_emails,
    contact_addresses,
    match,
    error,
}) => {
    let [contactItems, setContactItems] = useState([]);
    let [firstNameFilter, setFirstNameFilter] = useState("");
    let [lastNameFilter, setLastNameFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [genderFilter, setGenderFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const classes = commonStyles();

    useEffect(() => {
        setContactItems(contacts);
    }, [contacts]);

    const exportContactRecordsToExcel = () => {
        let items = contacts.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Emails  Records",
            "Contact Data",
            items,
            "ContactData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the contacts here according to search criteria
        let filteredContacts = contacts
            .filter(({ first_name }) =>
                !firstNameFilter ? true : first_name.toLowerCase().includes(firstNameFilter.toLowerCase())
            )
            .filter(({ last_name }) =>
                !lastNameFilter ? true : last_name.toLowerCase().includes(lastNameFilter.toLowerCase())
            )
            .filter(({ gender }) =>
                !genderFilter ? true : gender == genderFilter
            )
            .filter(({ assigned_to }) =>
                !assignedToFilter ? true : assigned_to === assignedToFilter
            );

        setContactItems(filteredContacts);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setContactItems(contacts);
        setFirstNameFilter("");
        setLastNameFilter("");
        setAssignedToFilter("");
        setGenderFilter("");
    };

    return (
        <Layout pageTitle="Emails">
            <AppBar
                style={{
                    position: "-webkit-sticky" /* Safari */,
                    position: "sticky",
                    top: 70,
                }}
                color="default"
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Emails" />
                    <Tab label="Vacating Notices"></Tab>
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <Grid
                    container
                    spacing={3}
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid
                        container
                        spacing={2}
                        item
                        alignItems="center"
                        direction="row"
                        key={1}
                    >
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<AddIcon />}
                                component={Link}
                                to={`${match.url}/new`}
                            >
                                NEW
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<EditIcon />}
                                disabled={selected.length <= 0}
                                component={Link}
                                to={`${match.url}/${selected[0]}/edit`}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                aria-label="Export to Excel"
                                disabled={selected.length <= 0}
                                onClick={(event) => {
                                    exportContactRecordsToExcel();
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box
                            border={1}
                            borderRadius="borderRadius"
                            borderColor="grey.400"
                        >
                            <form
                                className={classes.form}
                                id="contactSearchForm"
                                onSubmit={handleSearchFormSubmit}
                            >
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="contact_first_name"
                                            name="contact_first_name"
                                            label="First Name"
                                            value={firstNameFilter}
                                            onChange={(event) => {
                                                setFirstNameFilter(
                                                    event.target.value.trim()
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="last_name"
                                            label="Last Name"
                                            id="last_name"
                                            onChange={(event) => {
                                                setLastNameFilter(
                                                    event.target.value.trim()
                                                );
                                            }}
                                            value={lastNameFilter}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            id="assigned_to"
                                            name="assigned_to"
                                            label="Assinged To"
                                            value={assignedToFilter }
                                            onChange={(event) => {
                                                setAssignedToFilter(
                                                    event.target.value
                                                );
                                            }}
                                        ></TextField>
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            name="gender"
                                            label="Gender"
                                            id="gender"
                                            onChange={(event) => {
                                                setGenderFilter(
                                                    event.target.value
                                                );
                                            }}
                                            value={genderFilter}
                                        >
                                            {GENDERS_LIST.map(
                                                (gender_type, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={gender_type}
                                                    >
                                                        {gender_type}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    item
                                    justify="flex-end"
                                    alignItems="center"
                                    direction="row"
                                    key={1}
                                >
                                    <Grid item>
                                        <Button
                                            onClick={(event) =>
                                                handleSearchFormSubmit(event)
                                            }
                                            type="submit"
                                            form="contactSearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<SearchIcon />}
                                        >
                                            SEARCH
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            onClick={(event) => {
                                                resetSearchForm(event);
                                            }}
                                            type="reset"
                                            form="propertySearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<UndoIcon />}
                                        >
                                            RESET
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
                        {error && (
                            <div>
                                <CustomizedSnackbar
                                    variant="error"
                                    message={error.message}
                                />
                            </div>
                        )}
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={contactItems}
                            headCells={contactsTableHeadCells}
                            handleDelete={handleDelete}
                            deleteUrl={"contacts"}
                        />
                    </Grid>
                    {isLoading && <LoadingBackdrop open={isLoading} />}
                </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
             <VacatingNoticesPage properties={properties}
             users={users} currentUser={currentUser} notices={notices}
             contact_addresses={contact_addresses} contacts={contacts} contact_emails={contact_emails} match={match}/>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        notices: state.notices,
        properties: state.properties,
        users: state.users, 
        currentUser: state.currentUser,
        contacts: state.contacts,
        contact_phone_numbers: state.contact_phone_numbers,
        contact_emails: state.contact_emails,
        contact_faxes: state.contact_faxes,
        contact_addresses: state.contact_addresses,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

ContactsPage = connect(mapStateToProps)(ContactsPage);

export default withRouter(ContactsPage);

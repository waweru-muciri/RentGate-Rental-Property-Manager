import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import PrintIcon from "@material-ui/icons/Print";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import exportDataToXSL from "../assets/printToExcel";
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Box,
} from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { getGendersList } from "../assets/commonAssets.js";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const GENDERS_LIST = getGendersList();

const contactsTableHeadCells = [
    {
        id: "landlord_name",
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
    { id: "personal_mobile_number", numeric: false, disablePadding: true, label: "Phone Number" },
    { id: "contact_email", numeric: false, disablePadding: true, label: "Email" },

];


let ContactsPage = ({
    currentUser,
    isLoading,
    contacts,
    users,
    match,
    error,
    handleItemDelete
}) => {
    let [contactItems, setContactItems] = useState([]);
    let [filteredContactItems, setFilteredContactItems] = useState([]);
    let [firstNameFilter, setFirstNameFilter] = useState("");
    let [lastNameFilter, setLastNameFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    let [genderFilter, setGenderFilter] = useState("");
    const [selected, setSelected] = useState([]);

    const classes = commonStyles();

    useEffect(() => {
        const mappedContacts = contacts.map((contact) => {
            const landlord = users.find((user) => user.id === contact.assigned_to)
            const landlordDetails = {}
            landlordDetails.landlord_name = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
            return Object.assign({}, contact, landlordDetails);
        });
        setContactItems(mappedContacts);
        setFilteredContactItems(mappedContacts);
    }, [contacts, users]);

    const exportContactRecordsToExcel = () => {
        let items = contactItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Contacts  Records",
            "Contact Data",
            items,
            "ContactData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the contacts here according to search criteria
        let filteredContacts = contactItems
            .filter(({ first_name }) =>
                !firstNameFilter ? true : first_name.toLowerCase().includes(firstNameFilter.toLowerCase())
            )
            .filter(({ last_name }) =>
                !lastNameFilter ? true : last_name.toLowerCase().includes(lastNameFilter.toLowerCase())
            )
            .filter(({ gender }) =>
                !genderFilter ? true : gender === genderFilter
            )
            .filter(({ assigned_to }) =>
                !assignedToFilter ? true : assigned_to === assignedToFilter
            );

        setFilteredContactItems(filteredContacts);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredContactItems(contactItems);
        setFirstNameFilter("");
        setLastNameFilter("");
        setAssignedToFilter("");
        setGenderFilter("");
    };

    return (
        <Layout pageTitle="Tenants">
            <Grid
                container
                spacing={3}
                alignItems="center"
            ><Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Tenants'} />
                </Grid>
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
                        <PrintArrayToPdf
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<PrintIcon />}
                            disabled={selected.length <= 0}
							reportName ={'Tenant Records'}
							reportTitle = {'Tenant Records'}
                            headCells={contactsTableHeadCells}
                            dataToPrint={contactItems.filter(({ id }) => selected.includes(id))}
                        >
                            Pdf
                        </PrintArrayToPdf>
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
                                        value={assignedToFilter}
                                        onChange={(event) => {
                                            setAssignedToFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {users.map((user, index) => (
                                            <MenuItem key={index} value={user.id}>
                                                {user.first_name + " " + user.last_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                        rows={filteredContactItems}
                        headCells={contactsTableHeadCells}
                        tenantId={currentUser.tenant}
                        handleDelete={handleItemDelete}
                        deleteUrl={"contacts"}
                    />
                </Grid>
                {isLoading && <LoadingBackdrop open={isLoading} />}
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.currentUser,
        users: state.users,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (tenantId, itemId, url) => dispatch(handleDelete(tenantId, itemId, url)),
    };
};

ContactsPage = connect(mapStateToProps, mapDispatchToProps)(ContactsPage);

export default withRouter(ContactsPage);

import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import  Button from "@material-ui/core/Button";
import Grid  from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import  Box from "@material-ui/core/Box";
import CustomizedSnackbar from "../components/CustomSnackbar";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { getGendersList } from "../assets/commonAssets.js";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const GENDERS_LIST = getGendersList();

const contactsTableHeadCells = [
    { id: "title", numeric: false, disablePadding: true, label: "Title" },
    { id: "first_name", numeric: false, disablePadding: true, label: "First Name" },
    { id: "last_name", numeric: false, disablePadding: true, label: "Last Name" },
    { id: "id_number", numeric: false, disablePadding: true, label: "ID Number" },
    { id: "gender", numeric: false, disablePadding: true, label: "Gender" },
    { id: "date_of_birth", numeric: false, disablePadding: true, label: "Date of Birth" },
    { id: "phone_number", numeric: false, disablePadding: true, label: "Phone Number" },
    { id: "contact_email", numeric: false, disablePadding: true, label: "Email" },
    { id: "details", numeric: false, disablePadding: true, label: "Details" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];


let ContactsPage = ({
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
    let [idFilter, setIdFilter] = useState('');
    let [genderFilter, setGenderFilter] = useState("");
    const [selected, setSelected] = useState([]);

    const classes = commonStyles();

    useEffect(() => {
        setContactItems(contacts);
        setFilteredContactItems(contacts);
    }, [contacts]);


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
            .filter(({ id_number }) =>
                !idFilter ? true : String(id_number).includes(idFilter)
            );

        setFilteredContactItems(filteredContacts);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredContactItems(contactItems);
        setFirstNameFilter("");
        setLastNameFilter("");
        setIdFilter("");
        setGenderFilter("");
    };

    return (
        <Layout pageTitle="Tenants">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading  text={'Tenants'} />
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
                            disabled={selected.length <= 0}
                            reportName={'Tenant Records'}
                            reportTitle={'Tenant Records'}
                            headCells={contactsTableHeadCells}
                            dataToPrint={contactItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={"Contacts  Records"}
                            reportTitle={"Contact Data"}
                            headCells={contactsTableHeadCells}
                            dataToPrint={contactItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
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
                                <Grid item xs={12} md={6}>
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
                                <Grid item xs={12} md={6}>
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="idFilter"
                                        name="idFilter"
                                        label="ID Number"
                                        value={idFilter}
                                        onChange={(event) => {
                                            setIdFilter(
                                                event.target.value
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                <Grid item xs={12}>
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
                        handleDelete={handleItemDelete}
                        noDetailsCol={true}
                        deleteUrl={"contacts"}
                    />
                </Grid>

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
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

ContactsPage = connect(mapStateToProps, mapDispatchToProps)(ContactsPage);

export default withRouter(ContactsPage);

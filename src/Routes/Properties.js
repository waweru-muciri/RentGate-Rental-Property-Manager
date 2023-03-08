import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/customizedSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { getPropertyTypes } from "../assets/commonAssets.js";

const PROPERTY_TYPES = getPropertyTypes();

const headCells = [
    {
        id: "property_type",
        numeric: false,
        disablePadding: true,
        label: "Property Type",
    },
    { id: "beds", numeric: false, disablePadding: true, label: "Beds" },
    { id: "baths", numeric: false, disablePadding: true, label: "Baths" },
    { id: "is_fully_furnished", numeric: false, disablePadding: true, label: "Fitted" },
    {
        id: "postal_code",
        numeric: false,
        disablePadding: true,
        label: "Postal Code",
    },
    {
        id: "square_footage",
        numeric: false,
        disablePadding: true,
        label: "Square Footage",
    },
    { id: "price", numeric: false, disablePadding: true, label: "Price" },
    { id: "tenant", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "owner", numeric: false, disablePadding: true, label: "Owner" },
    {
        id: "assigned_to",
        numeric: false,
        disablePadding: true,
        label: "Assigned To",
    },
];
//sample working data here
const propertyRows = [
    {
        id: 1,
        type: "Studio",
        beds: 2,
        baths: 1,
        fitted: "True",
        square_footage: 1333,
        postal_code: "23675 Dwedney Trunk Road",
        price: 4000,
        owner: "Brian Muciri",
        assigned_to: "Brian Muciri",
        created_by: "Brian Muciri",
    },
    {
        id: 2,
        type: "Single Family",
        beds: 2,
        baths: 1,
        fitted: "True",
        square_footage: 1500,
        postal_code: "23675 Dwedney Trunk Road",
        price: 8000,
        owner: "Brian Muciri",
        assigned_to: "Brian Muciri",
        created_by: "Brian Muciri",
    },
    {
        id: 3,
        type: "Duplex",
        beds: 1,
        baths: 1,
        fitted: "True",
        square_footage: 1600,
        postal_code: "23675 Dwedney Trunk Road",
        price: 6000,
        owner: "Brian Muciri",
        assigned_to: "Brian Muciri",
        created_by: "Brian Muciri",
    },
    {
        id: 4,
        type: "Apartment/Condo",
        beds: 0,
        baths: 1,
        fitted: "True",
        square_footage: 1200,
        postal_code: "23675 Dwedney Trunk Road",
        price: 5000,
        owner: "Brian Muciri",
        assigned_to: "Brian Muciri",
        created_by: "Brian Muciri",
    },
];

let PropertyPage = ({
    isLoading,
    properties,
    currentUser,
    contacts,
    match,
    error,
}) => {
    const classes = commonStyles();
    // REMOVE THIS IN PRODUCTION APP
    const ASSIGNED_TO = []
    let [propertyItems, setPropertyItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [propertyAddressFilter, setPropertyAddressFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [propertyTypeFilter, setPropertyTypeFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setPropertyItems(getMappedProperties())
    }, [properties, contacts])

    const getMappedProperties = () => {
        const mappedproperties = properties.map(
            (property) => {
               const tenant = contacts.find(
                    (contact) => contact.id === property.tenants[0]
                );
            //replace this with users on production
            const owner = contacts.find(
                    (contact) => contact.id === property.owner
                );
            const propertyDetails = {}
            propertyDetails.owner = typeof owner !== 'undefined' ? owner.first_name + ' ' + owner.last_name : ''
            propertyDetails.tenant = typeof tenant !== 'undefined' ? tenant.first_name + ' ' + tenant.last_name : ''
            return Object.assign({}, property, propertyDetails);
            }
        );
        return mappedproperties;
    };

    const exportPropertyRecordsToExcel = () => {
        let items = propertyItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Properties  Records",
            "Property Data",
            items,
            "PropertyData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the properties according to the search criteria here
        let filteredProperties = getMappedProperties()
        .filter(({ ref }) => !propertyRefFilter ? true : ref === propertyRefFilter)
        .filter(({ property_type }) => !propertyTypeFilter ? true : property_type === propertyTypeFilter)
        .filter(({ postal_code }) => !propertyAddressFilter ? true : postal_code.toLowerCase().includes(propertyAddressFilter.toLowerCase()))
        .filter(({ assigned_to }) => !assignedToFilter ? true : assigned_to === assignedToFilter)

        setPropertyItems(filteredProperties);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyItems(getMappedProperties());
        setPropertyRefFilter("");
        setPropertyAddressFilter("");
        setAssignedToFilter("");
        setPropertyTypeFilter("");
    };

    return (
        <Layout pageTitle="Property Listings">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <PageHeading text="Rental Listings" />
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
                            Edit Property
                        </Button>
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            aria-label="Export to Excel"
                            disabled={selected.length <= 0}
                            onClick={(event) => {
                                exportPropertyRecordsToExcel();
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
                            id="propertySearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="row"
                            >
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="property_type"
                                        label="Property Type"
                                        id="property_type"
                                        onChange={(event) => {
                                            setPropertyTypeFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={propertyTypeFilter}
                                    >
                                        {PROPERTY_TYPES.map(
                                            (property_type, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={property_type}
                                                >
                                                    {property_type}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="assigned_to"
                                        name="assigned_to"
                                        label="Assigned To"
                                        value={assignedToFilter}
                                        onChange={(event) => {
                                            setAssignedToFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                    {ASSIGNED_TO.map((assigned_to, index) => (
                                    <MenuItem key={index}   value={assigned_to}>
                                            {assigned_to}
                                    </MenuItem>
                                    ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="row"
                            >
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="property_ref"
                                        name="property_ref"
                                        label="Property Ref"
                                        value={propertyRefFilter}
                                        onChange={(event) => {
                                            setPropertyRefFilter(
                                                event.target.value
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="property_address"
                                        label="Property Address"
                                        id="property_address"
                                        onChange={(event) => {
                                            setPropertyAddressFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={propertyAddressFilter}
                                    />
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
                                        type="submit"
                                        form="propertySearchForm"
                                        color="primary"
                                        variant="contained"
                                        size="medium"
                                        startIcon={<SearchIcon />}
                                    >
                                        SEARCH{" "}
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
                                        RESET{" "}
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
                        rows={propertyItems}
                        headCells={headCells}
                        deleteUrl={'properties'}
                        handleDelete={handleDelete}
                    />
                </Grid>
                {isLoading && <LoadingBackdrop open={isLoading} />}
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        properties: state.properties,
        currentUser: state.currentUser,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};


PropertyPage = connect(mapStateToProps, null)(PropertyPage);

export default withRouter(PropertyPage);

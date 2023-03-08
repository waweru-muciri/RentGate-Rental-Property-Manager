import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import PrintIcon from "@material-ui/icons/Print";
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
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const PROPERTY_TYPES = getPropertyTypes();

const headCells = [
    {
        id: "property_type",
        numeric: false,
        disablePadding: true,
        label: "Unit Type",
    },
    { id: "ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "beds", numeric: false, disablePadding: true, label: "Beds" },
    { id: "baths", numeric: false, disablePadding: true, label: "Baths" },
    { id: "is_fully_furnished", numeric: false, disablePadding: true, label: "Fitted" },
    {
        id: "address",
        numeric: false,
        disablePadding: true,
        label: "Unit Adddress",
    },
    {
        id: "square_footage",
        numeric: false,
        disablePadding: true,
        label: "Square Footage",
    },
    { id: "price", numeric: false, disablePadding: true, label: "Rent" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "owner_name", numeric: false, disablePadding: true, label: "Owner" },
    {
        id: "landlord_name",
        numeric: false,
        disablePadding: true,
        label: "Assigned To",
    },
];

let PropertyPage = ({
    isLoading,
    properties,
    currentUser,
    contacts,
    users,
    match,
    error, handleItemDelete
}) => {
    const classes = commonStyles();
    let [propertyItems, setPropertyItems] = useState([])
    let [filteredPropertyItems, setFilteredPropertyItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [propertyAddressFilter, setPropertyAddressFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    let [propertyTypeFilter, setPropertyTypeFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const mappedProperties = properties.map(
            (property) => {
                const tenant = contacts.find(
                    (contact) => property.tenants ? contact.id === property.tenants[0] : ''
                );
                const owner = users.find(
                    (user) => user.id === property.owner
                );
                const landlord = users.find(
                    (user) => user.id === property.assigned_to
                );
                const propertyDetails = {}
                propertyDetails.owner_name = typeof owner !== 'undefined' ? owner.first_name + ' ' + owner.last_name : ''
                propertyDetails.landlord_name = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
                propertyDetails.tenant_name = typeof tenant !== 'undefined' ? tenant.first_name + ' ' + tenant.last_name : ''
                return Object.assign({}, property, propertyDetails);
            }
        );

        setPropertyItems(mappedProperties)
        setFilteredPropertyItems(mappedProperties)
    }, [properties, contacts, users])

    const exportPropertyRecordsToExcel = () => {
        let items = propertyItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Rental Properties Records",
            "Rental Properties Data",
            items,
            "Rental Properties Data"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the properties according to the search criteria here
        let filteredProperties = propertyItems
            .filter(({ ref }) => !propertyRefFilter ? true : ref === propertyRefFilter)
            .filter(({ property_type }) => !propertyTypeFilter ? true : property_type === propertyTypeFilter)
            .filter((property) => !propertyAddressFilter ? true : typeof property.address !== 'undefined' ? property.address.toLowerCase().includes(propertyAddressFilter.toLowerCase()) : false)

            .filter((property) => !assignedToFilter ? true : property.assigned_to === assignedToFilter)

        setFilteredPropertyItems(filteredProperties);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPropertyItems(propertyItems);
        setPropertyRefFilter("");
        setPropertyAddressFilter("");
        setAssignedToFilter("");
        setPropertyTypeFilter("");
    };

    return (
        <Layout pageTitle="Rental Units">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <PageHeading text="Rental Units" />
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
							reportName ={'Rental Records'}
							reportTitle = {'Rentals Records'}
                            headCells={headCells}
                            dataToPrint={propertyItems.filter(({ id }) => selected.includes(id))}
                        >
                            Pdf
                        </PrintArrayToPdf>
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
                                        label="Unit Type"
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
                                        {users.map((user, index) => (
                                            <MenuItem key={index} value={user.id}>
                                                {user.first_name + ' ' + user.last_name}
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
                                        label="Unit Ref"
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
                                        label="Unit Address"
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
                        rows={filteredPropertyItems}
                        headCells={headCells}
                        deleteUrl={'properties'}
                        tenantId={currentUser.tenant}
                        handleDelete={handleItemDelete}
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
        users: state.users,
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

PropertyPage = connect(mapStateToProps, mapDispatchToProps)(PropertyPage);

export default withRouter(PropertyPage);

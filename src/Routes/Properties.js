import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/CustomSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";


const headCells = [
    {
        id: "address",
        numeric: false,
        disablePadding: true,
        label: "Property",
    },
    { id: "property_location", numeric: false, disablePadding: true, label: "Location" },
    { id: "owner_details", numeric: false, disablePadding: true, label: "Rental Owner" },
    {
        id: "landlord_name",
        numeric: false,
        disablePadding: true,
        label: "Rental Manager",
    },
    {
        id: "property_type",
        numeric: false,
        disablePadding: true,
        label: "Type",
    },
    { id: "details", numeric: false, disablePadding: true, label: "Details" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
	{ id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let PropertyPage = ({
    isLoading,
    properties,
    currentUser,
    history,
    users,
    match,
    error, handleItemDelete
}) => {
    const classes = commonStyles();
    let [propertyUnitsItems, setPropertyUnitItems] = useState([])
    let [filteredPropertyItems, setFilteredPropertiesItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const mappedProperties = properties.map(
            (property) => {
                const landlord = users.find(
                    (user) => user.id === property.assigned_to
                );
                const owner = users.find(
                    (user) => user.id === property.owner
                );
                const propertyDetails = {}
                propertyDetails.property_location = `${property.city}, ${property.county}`
                propertyDetails.landlord_name = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
                propertyDetails.owner_details = typeof owner !== 'undefined' ? owner.first_name + ' ' + owner.last_name : ''
                return Object.assign({}, property, propertyDetails);
            }
        );

        setPropertyUnitItems(mappedProperties)
        setFilteredPropertiesItems(mappedProperties)
    }, [properties, users])

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the properties according to the search criteria here
        let filteredProperties = propertyUnitsItems
            .filter(({ id }) => !propertyRefFilter ? true : id === propertyRefFilter)
            .filter((property) => !assignedToFilter ? true : property.assigned_to === assignedToFilter)

        setFilteredPropertiesItems(filteredProperties);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPropertiesItems(propertyUnitsItems);
        setPropertyRefFilter("");
        setAssignedToFilter("");
    };

    return (
        <Layout pageTitle="Properties">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <PageHeading text="Properties" />
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
                            reportName={'Rental Records'}
                            reportTitle={'Rentals Records'}
                            headCells={headCells}
                            dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Rental Records'}
                            reportTitle={'Rentals Records'}
                            headCells={headCells}
                            dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
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
                                justify="space-around"
                                direction="row"
                            >
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="assigned_to"
                                        name="assigned_to"
                                        label="Rental Manager"
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="property"
                                        label="Property"
                                        id="property"
                                        onChange={(event) => {
                                            setPropertyRefFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={propertyRefFilter}>
                                        {properties.map((property, propertyIndex) => (
                                            <MenuItem key={propertyIndex} value={property.id}>
                                                {property.address || property.ref}
                                            </MenuItem>
                                        ))}
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
                        rows={filteredPropertyItems}
                        headCells={headCells}
                        noDetailsCol={true}
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

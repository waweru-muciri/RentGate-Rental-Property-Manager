import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import Autocomplete from '@material-ui/lab/Autocomplete';


const headCells = [
    { id: "ref", numeric: false, disablePadding: true, label: "Property Name/Ref" },
    { id: "address", numeric: false, disablePadding: true, label: "Property Address" },
    { id: "property_location", numeric: false, disablePadding: true, label: "Location" },
    { id: "owner_details", numeric: false, disablePadding: true, label: "Rental Owner" },
    { id: "landlord_name", numeric: false, disablePadding: true, label: "Rental Manager" },
    { id: "details", numeric: false, disablePadding: true, label: "Details" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let PropertyPage = ({
    properties,
    users,
    match,
    handleItemDelete
}) => {
    const classes = commonStyles();
    let [propertyUnitsItems, setPropertyUnitItems] = useState([])
    let [filteredPropertyItems, setFilteredPropertiesItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setPropertyUnitItems(properties)
        setFilteredPropertiesItems(properties)
    }, [properties])

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the properties according to the search criteria here
        let filteredProperties = propertyUnitsItems
            .filter(({ id }) => !propertyRefFilter ? true : id === propertyRefFilter)
            .filter((property) => !assignedToFilter ? true : property.assigned_to === assignedToFilter.id)

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
                                    <Autocomplete
                                        id="assigned_to"
                                        name="assigned_to"
                                        label="Rental Manager"
                                        options={users}
                                        value={assignedToFilter}
                                        getOptionLabel={(option) => option ? `${option.first_name} ${option.last_name}` : ''}
                                        style={{ width: "100%" }}
                                        onChange={(event, newValue) => {
                                            setAssignedToFilter(
                                                newValue
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Rental Manager" variant="outlined" />}
                                    />
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
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredPropertyItems}
                        headCells={headCells}
                        noDetailsCol={true}
                        deleteUrl={'properties'}
                        handleDelete={handleItemDelete}
                    />
                </Grid>

            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties.map((property) => {
            const landlord = state.users.find((user) => user.id === property.assigned_to) || {};
            const owner = state.users.find((user) => user.id === property.owner) || {};
            const propertyDetails = {}
            propertyDetails.property_location = `${property.city}`
            propertyDetails.landlord_name = `${landlord.first_name} ${landlord.last_name}`
            propertyDetails.owner_details = `${owner.first_name} ${owner.last_name}`
            return Object.assign({}, property, propertyDetails);
        }
        ),
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

PropertyPage = connect(mapStateToProps, mapDispatchToProps)(PropertyPage);

export default withRouter(PropertyPage);

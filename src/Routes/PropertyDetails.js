import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete, handleItemFormSubmit } from "../actions/actions";
import IndividualPropertyIncomeStatement from "./IndividualPropertyIncomeStament";
import TabPanel from "../components/TabPanel";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { getUnitTypes } from "../assets/commonAssets.js";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import ImportItemsBtn from "../components/ImportItemsBtn";
import PropertySummaryPage from "./PropertySummaryPage";
import PropertySettingsForm from "../components/property/PropertySettingsForm";

const UNIT_TYPES = getUnitTypes();

const headCells = [
    { id: "ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "beds", numeric: false, disablePadding: true, label: "Beds" },
    { id: "baths", numeric: false, disablePadding: true, label: "Baths" },
    { id: "sqm", numeric: false, disablePadding: true, label: "Floor Area" },
    { id: "rent_amount", numeric: false, disablePadding: true, label: "Rent Amount" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID Number" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let PropertyDetailsPage = ({
    propertyUnits,
    propertyActiveLeasesNumber,
    propertySettings,
    rentalPayments,
    expenses,
    propertyToShowDetails,
    users,
    match,
    handleItemSubmit,
    handleItemDelete
}) => {
    const classes = commonStyles()
    const [propertyUnitsItems, setPropertyUnitItems] = useState([])
    const [filteredPropertyItems, setFilteredPropertyUnitsItems] = useState([])
    const [propertyRefFilter, setPropertyRefFilter] = useState("");
    const [unitTypeFilter, setPropertyTypeFilter] = useState("");
    const [occupiedStatusFilter, setOccupiedStatusFilter] = useState("all");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    useEffect(() => {
        setPropertyUnitItems(propertyUnits)
        setFilteredPropertyUnitsItems(propertyUnits)
    }, [propertyUnits])


    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the propertyUnits according to the search criteria here
        let filteredPropertyUnits = propertyUnitsItems
            .filter(({ ref }) => !propertyRefFilter ? true : ref === propertyRefFilter)
            .filter(({ unit_type }) => !unitTypeFilter ? true : unit_type === unitTypeFilter)
            .filter(({ lease_id }) => occupiedStatusFilter === "all" ? true :
                occupiedStatusFilter === "occupied" ? lease_id : !lease_id)

        setFilteredPropertyUnitsItems(filteredPropertyUnits);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPropertyUnitsItems(propertyUnitsItems);
        setPropertyRefFilter("");
        setPropertyTypeFilter("");
        setOccupiedStatusFilter("all");
    };

    return (
        <Layout pageTitle="Property Details">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Summary" />
                    <Tab label="Rental Units" />
                    <Tab label="Financials" />
                    <Tab label="Payment Settings" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={3}>
                <PropertySettingsForm classes={classes} propertySettings={propertySettings} propertyToShowDetails={propertyToShowDetails}
                    handleItemSubmit={handleItemSubmit} />
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
                <PropertySummaryPage propertyToShowDetails={propertyToShowDetails} rentalPayments={rentalPayments}
                    propertyUnits={propertyUnitsItems} users={users} propertyActiveLeasesNumber={propertyActiveLeasesNumber} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <IndividualPropertyIncomeStatement propertyUnits={propertyUnits}
                    rentalPayments={rentalPayments} expenses={expenses} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Grid
                    container
                    spacing={3}
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Rental Units</Typography>
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
                                disabled={!selected.length}
                                component={Link}
                                to={`${match.url}/${selected[0]}/edit`}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item>
                            <PrintArrayToPdf
                                disabled={!selected.length}
                                reportName={'Rental Units Records'}
                                reportTitle={'Rental Units Data'}
                                headCells={headCells}
                                dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                disabled={!selected.length}
                                reportName={'Rental Units Records'}
                                reportTitle={'Rental Units Data'}
                                headCells={headCells}
                                dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ImportItemsBtn
                                baseObjectToAddProperties={{ property_id: propertyToShowDetails.id }}
                                savingUrl="property_units"
                                text="Upload Units"
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
                                id="propertySearchForm"
                                onSubmit={handleSearchFormSubmit}
                            >
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            name="unit_type"
                                            label="Unit Type"
                                            id="unit_type"
                                            onChange={(event) => {
                                                setPropertyTypeFilter(
                                                    event.target.value
                                                );
                                            }}
                                            value={unitTypeFilter}
                                        >
                                            {UNIT_TYPES.map(
                                                (unit_type, index) => (
                                                    <MenuItem key={index} value={unit_type.id}>
                                                        {unit_type.displayValue}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md>
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
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            id="occupied_status"
                                            name="occupied_status"
                                            label="Occupied Status"
                                            value={occupiedStatusFilter}
                                            onChange={(event) => {
                                                setOccupiedStatusFilter(
                                                    event.target.value
                                                );
                                            }}>
                                            <MenuItem key={1} value="all">All</MenuItem>
                                            <MenuItem key={2} value="occupied">Occupied</MenuItem>
                                            <MenuItem key={3} value="vacant">Vacant</MenuItem>
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
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredPropertyItems}
                            headCells={headCells}
                            deleteUrl={'property_units'}
                            handleDelete={handleItemDelete}
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    const unitsInProperty = state.propertyUnits
        .filter(({ property_id }) => property_id === ownProps.match.params.propertyId)
        .map(({ id }) => id)
    const propertyActiveLeases = state.leases
        .filter(({ property_id }) => property_id === ownProps.match.params.propertyId)
        .filter(({ terminated }) => terminated !== true)
    return {
        rentalPayments: state.rentalPayments.filter(({ unit_id }) => unitsInProperty.includes(unit_id)),
        expenses: state.expenses.filter(({ property_id }) => property_id === ownProps.match.params.propertyId),
        propertyToShowDetails: state.properties.find(({ id }) => id === ownProps.match.params.propertyId) || {},
        propertyUnits: state.propertyUnits.filter(({ id }) => unitsInProperty.includes(id))
            .map((property_unit) => {
                const latestUnitLease = propertyActiveLeases
                    .find(({ unit_id }) => unit_id === property_unit.id) || {}
                const tenant = state.contacts.find(
                    ({ id }) => Array.isArray(latestUnitLease.tenants) ? latestUnitLease.tenants.includes(id) : false)
                return Object.assign(
                    {},
                    property_unit,
                    {
                        tenant_name: tenant ? `${tenant.first_name} ${tenant.last_name}` : '-',
                        tenant_id_number: tenant ? tenant.id_number : '-',
                        lease_id: latestUnitLease.id,
                        rent_amount: latestUnitLease.rent_amount,
                    });
            }
            ).sort((unit1, unit2) => unit1.ref < unit2.ref ? -1 : unit1.ref > unit2.ref ? 1 : 0),
        propertyActiveLeasesNumber: propertyActiveLeases.length,
        propertySettings: state.propertySettings.find(({ property_id }) => property_id === ownProps.match.params.propertyId) || {},
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

PropertyDetailsPage = connect(mapStateToProps, mapDispatchToProps)(PropertyDetailsPage);

export default withRouter(PropertyDetailsPage);

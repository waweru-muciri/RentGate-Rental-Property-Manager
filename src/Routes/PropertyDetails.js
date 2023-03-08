import React, { useEffect, useState } from "react";
import Layout from "../components/myLayout";
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
import CustomizedSnackbar from "../components/CustomSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import IndividualPropertyIncomeStatement from "./IndividualPropertyIncomeStament";
import TabPanel from "../components/TabPanel";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { getUnitTypes } from "../assets/commonAssets.js";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import PropertySummaryPage from "./PropertySummaryPage";
import PropertySettingsForm from "../components/property/PropertySettingsForm";

const PROPERTY_TYPES = getUnitTypes();

const headCells = [
    {
        id: "unit_type",
        numeric: false,
        disablePadding: true,
        label: "Unit Type",
    },
    { id: "ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "beds", numeric: false, disablePadding: true, label: "Beds" },
    { id: "baths", numeric: false, disablePadding: true, label: "Baths" },
    {
        id: "address",
        numeric: false,
        disablePadding: true,
        label: "Unit Adddress",
    },
    {
        id: "sqft",
        numeric: false,
        disablePadding: true,
        label: "Square Footage",
    },
    // { id: "price", numeric: false, disablePadding: true, label: "Rent" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let PropertyDetailsPage = ({
    properties,
    propertyUnits,
    isLoading,
    transactions,
    expenses,
    meterReadings,
    currentUser,
    history,
    contacts,
    users,
    match,
    error, handleItemDelete
}) => {
    const classes = commonStyles()
    const propertyToShowDetailsId = match.params.propertyId;
    const propertyToShowDetails = properties.find(({ id }) => id === propertyToShowDetailsId) || {}
    let [propertyUnitsItems, setPropertyUnitItems] = useState([])
    let [filteredPropertyItems, setFilteredPropertyUnitsItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [propertyTypeFilter, setPropertyTypeFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    useEffect(() => {
        const mappedPropertyUnits = propertyUnits.filter(({ property_id }) => property_id === propertyToShowDetailsId).map(
            (property_unit) => {
                const tenant = contacts.find(
                    ({ id }) => property_unit.tenants ? property_unit.tenants.includes(id) : ''
                ) || {}
                return Object.assign({}, property_unit, { tenant_name: tenant.first_name + ' ' + tenant.last_name });
            }
        );

        setPropertyUnitItems(mappedPropertyUnits)
        setFilteredPropertyUnitsItems(mappedPropertyUnits)
    }, [propertyUnits, contacts])


    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the propertyUnits according to the search criteria here
        let filteredPropertyUnits = propertyUnitsItems
            .filter(({ ref }) => !propertyRefFilter ? true : ref === propertyRefFilter)
            .filter(({ unit_type }) => !propertyTypeFilter ? true : unit_type === propertyTypeFilter)

        setFilteredPropertyUnitsItems(filteredPropertyUnits);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPropertyUnitsItems(propertyUnitsItems);
        setPropertyRefFilter("");
        setPropertyTypeFilter("");
    };

    return (
        <Layout pageTitle="Rental Units">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Summary" />
                    <Tab label="Financials" />
                    <Tab label="Rental Units" />
                    <Tab label="Payment Settings" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={3}>
                <PropertySettingsForm classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
                <PropertySummaryPage propertyToShowDetails={propertyToShowDetails}
                    propertyUnits={propertyUnitsItems} users={users} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <IndividualPropertyIncomeStatement propertyUnits={propertyUnits}
                    transactions={transactions} expenses={expenses} meterReadings={meterReadings} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Grid
                    container
                    spacing={3}
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                reportName={'Rental Units Records'}
                                reportTitle={'Rental Units Data'}
                                headCells={headCells}
                                dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                disabled={selected.length <= 0}
                                reportName={'Rental Units Records'}
                                reportTitle={'Rental Units Data'}
                                headCells={headCells}
                                dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
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
                                    <Grid item xs={12} md={6}>
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
                                            value={propertyTypeFilter}
                                        >
                                            {PROPERTY_TYPES.map(
                                                (unit_type, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={unit_type}
                                                    >
                                                        {unit_type}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
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
                            deleteUrl={'property_units'}
                            tenantId={currentUser.tenant}
                            handleDelete={handleItemDelete}
                        />
                    </Grid>
                    {isLoading && <LoadingBackdrop open={isLoading} />}
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        transactions: state.transactions,
        meterReadings: state.meterReadings,
        expenses: state.expenses,
        properties: state.properties,
        propertyUnits: state.propertyUnits,
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

PropertyDetailsPage = connect(mapStateToProps, mapDispatchToProps)(PropertyDetailsPage);

export default withRouter(PropertyDetailsPage);

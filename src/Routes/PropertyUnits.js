import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import PrintIcon from "@material-ui/icons/Print";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/customizedSnackbar";
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
import { Typography } from "@material-ui/core";

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
    {
        id: "landlord_name",
        numeric: false,
        disablePadding: true,
        label: "Assigned To",
    },
];

let PropertyPage = ({
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
    const classes = commonStyles();
    let propertyToShowUnits = match.params.propertyId;
    let [propertyUnitsItems, setPropertyUnitItems] = useState([])
    let [filteredPropertyItems, setFilteredPropertyUnitsItems] = useState([])
    let [propertyRefFilter, setPropertyRefFilter] = useState("");
    let [propertyTypeFilter, setPropertyTypeFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(1);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    useEffect(() => {
        const mappedPropertyUnits = propertyUnits.filter(({ property_id }) => property_id == propertyToShowUnits).map(
            (property) => {
                const tenant = contacts.find(
                    (contact) => property.tenants ? contact.id === property.tenants[0] : ''
                );
                const landlord = users.find(
                    (user) => user.id === property.assigned_to
                );
                const propertyDetails = {}
                propertyDetails.landlord_name = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
                propertyDetails.tenant_name = typeof tenant !== 'undefined' ? tenant.first_name + ' ' + tenant.last_name : ''
                return Object.assign({}, property, propertyDetails);
            }
        );

        setPropertyUnitItems(mappedPropertyUnits)
        setFilteredPropertyUnitsItems(mappedPropertyUnits)
    }, [propertyUnits, contacts, users])

    const exportPropertyRecordsToExcel = () => {
        let items = propertyUnitsItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Rental Properties Records",
            "Rental Properties Data",
            items,
            "Rental Properties Data"
        );
    };

    const tableRowOnClickHandler = (propertyId) => {
        // history.push('/helloworld')
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the properties according to the search criteria here
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
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <IndividualPropertyIncomeStatement propertyUnits={propertyUnits} transactions={transactions} expenses={expenses} meterReadings={meterReadings}/>
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
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<PrintIcon />}
                                disabled={selected.length <= 0}
                                reportName={'Rental Records'}
                                reportTitle={'Rentals Records'}
                                headCells={headCells}
                                dataToPrint={propertyUnitsItems.filter(({ id }) => selected.includes(id))}
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
                                    <Grid item sm>
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
                                    <Grid item sm>
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
                            tableRowOnClickHandler={tableRowOnClickHandler}
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

PropertyPage = connect(mapStateToProps, mapDispatchToProps)(PropertyPage);

export default withRouter(PropertyPage);

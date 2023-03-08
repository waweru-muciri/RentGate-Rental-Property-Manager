import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import CustomizedSnackbar from "../components/CustomSnackbar";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import { getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getTransactionsFilterOptions, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";


const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()


const meterReadingsTableHeadCells = [
    {
        id: "reading_date",
        numeric: false,
        disablePadding: true,
        label: "Date Recorded",
    },
    {
        id: "property_ref",
        numeric: false,
        disablePadding: true,
        label: "Unit Number/Ref",
    },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant Id Number" },
    { id: "meter_type", numeric: false, disablePadding: true, label: "Meter Type" },
    { id: "prior_value", numeric: false, disablePadding: true, label: "Prior Value" },
    { id: "current_value", numeric: false, disablePadding: true, label: "Curent Value" },
    { id: "usage", numeric: false, disablePadding: true, label: "Usage" },
    { id: "base_charge", numeric: false, disablePadding: true, label: "Base Charge" },
    { id: "unit_charge", numeric: false, disablePadding: true, label: "Unit Charge" },
    { id: "amount", numeric: false, disablePadding: true, label: "Amount(Ksh)" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let MeterReadingsPage = ({
    currentUser,
    meterReadings,
    handleItemDelete,
    properties,
    match,
    error,
}) => {
    const classes = commonStyles();
    let [meterReadingItems, setMeterReadingItems] = useState([]);
    let [filteredMeterReadingItems, setFilteredMeterReadingItems] = useState([]);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [meterTypeFilter, setMeterTypeFilter] = useState("");
    let [propertyFilter, setPropertyFilter] = useState("all");
    const [selected, setSelected] = useState([]);

    const METER_TYPE_OPTIONS = Array.from(new Set(meterReadingItems.map((meterReading) => meterReading.meter_type)))

    useEffect(() => {
        setMeterReadingItems(meterReadings);
        setFilteredMeterReadingItems(meterReadings);
    }, [meterReadings]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the meterReadings here according to search criteria
        let filteredMeterReadings = meterReadingItems
        if (periodFilter) {
            let dateRange = []
            let startOfPeriod;
            let endOfPeriod;
            switch (periodFilter) {
                case 'last-month':
                    dateRange = getLastMonthFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'year-to-date':
                    dateRange = getYearToDateFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'last-year':
                    dateRange = getLastYearFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'month-to-date':
                    dateRange = getCurrentMonthFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case '3-months-to-date':
                    dateRange = getLastThreeMonthsFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
            }
            filteredMeterReadings = filteredMeterReadings.filter((meterReading) => {
                const meterReadingDate = parse(meterReading.reading_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(meterReadingDate, { start: startOfPeriod, end: endOfPeriod })
            })
        }
        filteredMeterReadings = filteredMeterReadings
        .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        .filter(({ reading_date }) =>
                !fromDateFilter ? true : reading_date >= fromDateFilter
            )
            .filter(({ reading_date }) =>
                !toDateFilter ? true : reading_date <= toDateFilter
            )
        setFilteredMeterReadingItems(filteredMeterReadings);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setPeriodFilter("");
        setToDateFilter("");
        setMeterTypeFilter("");
        setPropertyFilter("all");
        setFilteredMeterReadingItems(meterReadingItems);
    };

    return (
        <Layout pageTitle="Rental Units Meter Readings">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item lg={12}>
                    <PageHeading text="Rental Units Meter Readings" />
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
                            reportName={'Meter Readings Records'}
                            reportTitle={'Meter Readings Records'}
                            headCells={meterReadingsTableHeadCells}
                            dataToPrint={meterReadingItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Meter Readings Records'}
                            reportTitle={'Meter Readings Records'}
                            headCells={meterReadingsTableHeadCells}
                            dataToPrint={meterReadingItems.filter(({ id }) => selected.includes(id))}
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
                                direction="column"
                            >
                                <Grid
                                    container
                                    item
                                    spacing={2}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item container direction="row" xs={12} md={6} spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type="date"
                                                id="from_date_filter"
                                                name="from_date_filter"
                                                label="From Date"
                                                value={fromDateFilter}
                                                onChange={(event) => {
                                                    setFromDateFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type="date"
                                                name="to_date_filter"
                                                label="To Date"
                                                id="to_date_filter"
                                                onChange={(event) => {
                                                    setToDateFilter(event.target.value);
                                                }}
                                                value={toDateFilter}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            name="property_filter"
                                            label="Property"
                                            id="property_filter"
                                            onChange={(event) => {
                                                setPropertyFilter(
                                                    event.target.value
                                                );
                                            }}
                                            value={propertyFilter}
                                        >
                                            <MenuItem key={"all"} value={"all"}>All Properties</MenuItem>
                                            {properties.map(
                                                (property, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={property.id}
                                                    >
                                                        {property.ref}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                name="meter_type"
                                                label="Select Meter Type"
                                                id="meter_type"
                                                onChange={(event) => {
                                                    setMeterTypeFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                value={meterTypeFilter}
                                            >
                                                {METER_TYPE_OPTIONS.map((filterOption, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={filterOption}
                                                    >
                                                        {filterOption}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                select
                                                id="from_filter"
                                                name="from_filter"
                                                label="Period"
                                                value={periodFilter}
                                                onChange={(event) => {
                                                    setPeriodFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                InputLabelProps={{ shrink: true }}>
                                                {TRANSACTIONS_FILTER_OPTIONS.map((filterOption, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={filterOption.id}
                                                    >
                                                        {filterOption.text}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
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
                                            onClick={(event) => handleSearchFormSubmit(event)}
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
                                            onClick={(event) =>
                                                resetSearchForm(event)
                                            }
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
                        rows={filteredMeterReadingItems}
                        headCells={meterReadingsTableHeadCells}

                        handleDelete={handleItemDelete}
                        deleteUrl={"meter_readings"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.currentUser,
        meterReadings: state.meterReadings,
        properties: state.properties,
        propertyUnits: state.propertyUnits,
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

MeterReadingsPage = connect(mapStateToProps, mapDispatchToProps)(MeterReadingsPage);

export default withRouter(MeterReadingsPage);

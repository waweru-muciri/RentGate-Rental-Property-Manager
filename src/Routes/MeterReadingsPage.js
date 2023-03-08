import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import exportDataToXSL from "../assets/printToExcel";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";

const meterReadingsTableHeadCells = [
    {
        id: "reading_date",
        numeric: false,
        disablePadding: true,
        label: "Date",
    },
    { id: "meter_type", numeric: false, disablePadding: true, label: "Meter Type" },
    {
        id: "property_ref",
        numeric: false,
        disablePadding: true,
        label: "Property Ref/Unit",
    },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant Id Number" },
    { id: "prior_value", numeric: false, disablePadding: true, label: "Prior Value" },
    { id: "current_value", numeric: false, disablePadding: true, label: "Curent Value" },
    { id: "usage", numeric: false, disablePadding: true, label: "Usage" },
    { id: "base_charge", numeric: false, disablePadding: true, label: "Base Charge" },
    { id: "unit_charge", numeric: false, disablePadding: true, label: "Unit Charge" },
    { id: "amount", numeric: false, disablePadding: true, label: "Amount(Ksh)" },
];

let MeterReadingsPage = ({
    meterReadings,
    handleItemDelete,
    properties,
    contacts,
    match,
    error,
}) => {
    const classes = commonStyles();
    let [meterReadingItems, setMeterReadingItems] = useState([]);
    let [filteredMeterReadingItems, setFilteredMeterReadingItems] = useState([]);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [propertyFilter, setPropertyFilter] = useState("");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        const mappedMeterReadings = meterReadings.sort((meterReading1, meterReading2) => meterReading2.reading_date > meterReading1.reading_date).map((meterReading) => {
            const property = properties.find(
                (property) => property.id === meterReading.property
            );
            const meterReadingDetails = {};
            if (typeof property !== 'undefined') {
                const tenant = contacts.find(
                    (contact) => property.tenants.length ? contact.id === property.tenants[0] : ''
                );
                if (typeof tenant !== 'undefined') {
                    meterReadingDetails.tenant_id_number = tenant.id_number
                    meterReadingDetails.tenant_name = tenant.first_name + " " + tenant.last_name
                }
            }
            const usage = parseFloat(meterReading.current_value) - parseFloat(meterReading.prior_value)
            meterReadingDetails.usage = usage
            meterReadingDetails.amount = (usage * parseFloat(meterReading.unit_charge)) + parseFloat(meterReading.base_charge)
            meterReadingDetails.property_ref =
                typeof property !== "undefined" ? property.ref : null;
            return Object.assign({}, meterReading, meterReadingDetails);
        });
        setMeterReadingItems(mappedMeterReadings);
        setFilteredMeterReadingItems(mappedMeterReadings);
    }, [meterReadings,properties, contacts]);

    const exportMeterReadingsToExcel = () => {
        let items = meterReadingItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "MeterReadings  Records",
            "Expense Data",
            items,
            "ExpenseData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the meterReadings here according to search criteria
        let filteredMeterReadings = meterReadingItems
            .filter(({ reading_date }) =>
                !fromDateFilter ? true : reading_date >= fromDateFilter
            )
            .filter(({ reading_date }) =>
                !toDateFilter ? true : reading_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )

        setFilteredMeterReadingItems(filteredMeterReadings);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredMeterReadingItems(meterReadingItems);
        setFromDateFilter("");
        setToDateFilter("");
        setPropertyFilter("");
    };

    return (
        <Layout pageTitle="Property Meter Readings">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item lg={12}>
                    <PageHeading text="Property Meter Readings" />
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
                        <ExportToExcelBtn
                            aria-label="Export to Excel"
                            disabled={selected.length <= 0}
                            onClick={(event) => {
                                exportMeterReadingsToExcel();
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
                                <Grid
                                    container
                                    item
                                    lg={6} md={12} xs={12}
                                    spacing={1}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item lg={6} md={12} xs={12}>
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
                                    <Grid item lg={6} md={12} xs={12}>
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
                                <Grid item lg={6} md={12} xs={12}>
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
        meterReadings: state.meterReadings,
        properties: state.properties,
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

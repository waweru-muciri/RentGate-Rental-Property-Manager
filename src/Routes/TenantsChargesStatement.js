import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import CommonTable from "../components/table/commonTable";
import Autocomplete from '@material-ui/lab/Autocomplete';
import PageHeading from "../components/PageHeading";
import { getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getTransactionsFilterOptions, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";

const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type" },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Due Date", },
    { id: "charge_amount", numeric: false, disablePadding: true, label: "Charge Amount", },
];

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

let TenantStatementsPage = ({
    transactionsCharges,
    properties,
    contacts,
    classes
}) => {
    const [tenantChargesItems, setTenantChargesItems] = useState([]);
    const [filteredChargeItems, setFilteredChargeItems] = useState([]);
    const [contactFilter, setContactFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const dateRange = getCurrentMonthFromToDates()
        const startOfPeriod = dateRange[0]
        const endOfPeriod = dateRange[1]
        const chargesForCurrentMonth = transactionsCharges.filter((chargeItem) => {
            const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
            return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
        })
        setTenantChargesItems(chargesForCurrentMonth);
        setFilteredChargeItems(chargesForCurrentMonth);
    }, [transactionsCharges]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactionsCharges according to the search criteria here
        let statementsWithinDateRange = [];
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
            default:
                dateRange = getLastMonthFromToDates()
                startOfPeriod = dateRange[0]
                endOfPeriod = dateRange[1]
        }
        statementsWithinDateRange = transactionsCharges.filter((chargeItem) => {
            const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
            return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
        })
        const filteredStatements = statementsWithinDateRange
            .filter(({ charge_date }) => !fromDateFilter ? true : charge_date >= fromDateFilter)
            .filter(({ charge_date }) => !toDateFilter ? true : charge_date <= toDateFilter)
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
            .filter(({ tenant_id }) => !contactFilter ? true : tenant_id === contactFilter.id)


        setFilteredChargeItems(filteredStatements);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredChargeItems(tenantChargesItems);
        setPropertyFilter("all");
        setPeriodFilter("month-to-date");
        setContactFilter(null);
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Grid
            container
            spacing={3}
            justify="center" direction="column"
        >
            <Grid item key={2}>
                <PageHeading text={"Tenants Charges Statement"} />
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
                    <PrintArrayToPdf
                        disabled={!selected.length}
                        reportName={'Tenants Payments Records'}
                        reportTitle={'Tenants Payments Data'}
                        headCells={headCells}
                        dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
                <Grid item>
                    <ExportToExcelBtn
                        disabled={!selected.length}
                        reportName={'Tenants Charges Records'}
                        reportTitle={'Tenants Charges Records'}
                        headCells={headCells}
                        dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
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
                            <Grid
                                container
                                item
                                xs={12} lg={6}
                                spacing={1}
                                justify="center"
                                direction="row"
                            >
                                <Grid item xs={12} lg={6}>
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
                                <Grid item xs={12} lg={6}>
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
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    variant="outlined"
                                    name="propertyFilter"
                                    label="Property"
                                    id="propertyFilter"
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
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            justify="center"
                            direction="row"
                        >
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    select
                                    id="period_filter"
                                    name="period_filter"
                                    label="Period"
                                    value={periodFilter}
                                    onChange={(event) => {
                                        setPeriodFilter(
                                            event.target.value
                                        );
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                >
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
                            <Grid item xs={12} lg={6}>
                                <Autocomplete
                                    id="contact_filter"
                                    options={contacts}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    name="contact_filter"
                                    onChange={(event, newValue) => {
                                        setContactFilter(newValue);
                                    }}
                                    value={contactFilter}
                                    getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                    style={{ width: "100%" }}
                                    renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
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
                                    onClick={(event) => resetSearchForm(event)}
                                    type="reset"
                                    form="contactSearchForm"
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
                    rows={filteredChargeItems}
                    headCells={headCells}
                    noEditCol
                    noDeleteCol
                />
            </Grid>
        </Grid>
    );
};


export default TenantStatementsPage;

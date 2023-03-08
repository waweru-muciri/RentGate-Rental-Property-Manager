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
import { getStartEndDatesForPeriod, getTransactionsFilterOptions } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";

const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type" },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Due Date", },
    { id: "charge_amount", numeric: true, disablePadding: true, label: "Charge Amount", },
];

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

let TenantStatementsPage = ({
    rentalCharges,
    properties,
    contacts,
    classes
}) => {
    const [filteredChargeItems, setFilteredChargeItems] = useState([]);
    const [contactFilter, setContactFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setFilteredChargeItems(filterChargesByCriteria(rentalCharges));
    }, [rentalCharges]);

    const filterChargesByCriteria = (statementsToFilter) => {
        let statementsWithinDateRange = statementsToFilter;
        //filter the rentalCharges according to the search criteria here
        if (periodFilter) {
            const { startDate, endDate } = getStartEndDatesForPeriod(periodFilter)
            statementsWithinDateRange = statementsWithinDateRange.filter((chargeItem) => {
                const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(chargeItemDate, { start: startDate, end: endDate })
            })
        }
        const filteredStatements = statementsWithinDateRange
            .filter(({ charge_date, property_id, tenant_id }) =>
                (!fromDateFilter ? true : charge_date >= fromDateFilter)
                && (!toDateFilter ? true : charge_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (!contactFilter ? true : tenant_id === contactFilter.id)
            )
        return filteredStatements;
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        setFilteredChargeItems(filterChargesByCriteria(rentalCharges));
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
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
                        reportName={'Tenants Charges Records'}
                        reportTitle={'Tenants Charges Data'}
                        headCells={headCells}
                        dataToPrint={rentalCharges.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
                <Grid item>
                    <ExportToExcelBtn
                        disabled={!selected.length}
                        reportName={'Tenants Charges Records'}
                        reportTitle={'Tenants Charges Records'}
                        headCells={headCells}
                        dataToPrint={rentalCharges.filter(({ id }) => selected.includes(id))}
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
                        id="tenantChargesSearchForm"
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
                                xs={12} md={6}
                                spacing={1}
                                justify="center"
                                direction="row"
                            >
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
                                    <MenuItem key={"all"} value={"all"}>All</MenuItem>
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
                            <Grid item xs={12} md={6}>
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
                                    form="tenantChargesSearchForm"
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
                                    form="tenantChargesSearchForm"
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

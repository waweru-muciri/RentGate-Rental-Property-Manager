import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import { getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getTransactionsFilterOptions, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import Autocomplete from '@material-ui/lab/Autocomplete';


const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

const headCells = [
    { id: "payment_date", numeric: false, disablePadding: true, label: "Payment Date" },
    { id: "payment_label", numeric: false, disablePadding: true, label: "Payment Type" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Number/Ref" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID" },
    { id: "payment_amount", numeric: false, disablePadding: true, label: "Payment Amount" },
    { id: "memo", numeric: false, disablePadding: true, label: "Payment Notes/Memo" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];


let PaymentsPage = ({
    transactions,
    contacts,
    properties,
    match,
    handleItemDelete,
}) => {
    const classes = commonStyles();
    let [paymentsItems, setPaymentsItems] = useState([]);
    let [filteredPaymentsItems, setFilteredPaymentsItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("all");
    let [periodFilter, setPeriodFilter] = useState("all");
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [contactFilter, setContactFilter] = useState(null);

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setPaymentsItems(transactions);
        setFilteredPaymentsItems(transactions);
    }, [transactions]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the payments according to the search criteria here
        let filteredPayments = paymentsItems
        let startOfPeriod;
        let endOfPeriod;
        let dateRange = []
        if (periodFilter) {
            switch (periodFilter) {
                case 'all':
                    startOfPeriod = new Date(1990, 1, 1)
                    endOfPeriod = new Date(2100, 1, 1)
                    break;
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
            filteredPayments = filteredPayments.filter((paymentItem) => {
                const paymentDate = parse(paymentItem.payment_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(paymentDate, { start: startOfPeriod, end: endOfPeriod })
            })
        };
        filteredPayments = filteredPayments
            .filter(({ payment_date }) => !fromDateFilter ? true : payment_date >= fromDateFilter)
            .filter(({ payment_date }) => !toDateFilter ? true : payment_date <= toDateFilter)
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
            .filter(({ tenant_id }) => !contactFilter ? true : tenant_id === contactFilter.id)
        setFilteredPaymentsItems(filteredPayments);
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPaymentsItems(paymentsItems);
        setPropertyFilter("all");
        setPeriodFilter("all");
        setFromDateFilter("");
        setToDateFilter("");
        setContactFilter("");
    };

    return (
        <Layout pageTitle="Payments">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading text={'Payments'} />
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
                            reportName={'Rental Payments Records'}
                            reportTitle={'Rental Payments Data'}
                            headCells={headCells}
                            dataToPrint={paymentsItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Rental Payments Records'}
                            reportTitle={'Rental Payments Data'}
                            headCells={headCells}
                            dataToPrint={paymentsItems.filter(({ id }) => selected.includes(id))}
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
                            >
                                <Grid item container spacing={2}>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item container xs={12} md={6} direction="row" spacing={2}>
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
                                                <MenuItem key={"all"} value={"all"}>All</MenuItem>
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
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item md={6} xs={12}>
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
                                            form="rentRollSearchForm"
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
                                            form="rentRollSearchForm"
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
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredPaymentsItems}
                        headCells={headCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"charge-payments"}
                    />
                </Grid>

            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions
        .map((payment) => {
            const tenant = state.contacts.find((contact) => contact.id === payment.tenant_id) || {};
            const tenantUnit = state.propertyUnits.find(({ id }) => id === payment.unit_id) || {};

            return Object.assign({}, payment, {
                tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                tenant_id_number: tenant.id_number,
                unit_ref : tenantUnit.ref
            })
        })
        .sort((payment1, payment2) => parse(payment2.payment_date, 'yyyy-MM-dd', new Date()) -
        parse(payment1.payment_date, 'yyyy-MM-dd', new Date())),
        properties: state.properties,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

PaymentsPage = connect(mapStateToProps, mapDispatchToProps)(PaymentsPage);

export default withRouter(PaymentsPage);

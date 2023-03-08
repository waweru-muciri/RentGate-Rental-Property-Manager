import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import CommonTable from "../components/table/commonTable";
import { handleItemFormSubmit, handleDelete } from "../actions/actions";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getTransactionsFilterOptions, currencyFormatter, getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval, format, startOfToday } from "date-fns";
const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number", },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type", },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "charge_amount", numeric: false, disablePadding: true, label: "Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: false, disablePadding: true, label: "Total Amounts Paid" },
    { id: "balance", numeric: false, disablePadding: true, label: "Balance" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let TenantChargesStatementPage = ({
    properties,
    contacts,
    transactions,
    leases,
    transactionsCharges,
    handleItemSubmit,
    handleItemDelete,
}) => {
    const classes = commonStyles()
    let [tenantChargesItems, setTenantChargesItems] = useState([]);
    let [filteredChargeItems, setFilteredChargeItems] = useState([]);
    let [chargeType, setChargeTypeFilter] = useState("");
    let [fromDateFilter, setFromDateFilter] = useState('');
    let [toDateFilter, setToDateFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState("month-to-date");
    let [contactFilter, setContactFilter] = useState(null);
    let [propertyFilter, setPropertyFilter] = useState("all");

    const [selected, setSelected] = useState([]);

    const CHARGE_TYPES = Array.from(new Set(tenantChargesItems
        .map((chargeItem) => (JSON.stringify({ label: chargeItem.charge_label, value: chargeItem.charge_type })))))
        .map(chargeType => JSON.parse(chargeType))

    useEffect(() => {
        const dateRange = getCurrentMonthFromToDates()
        const startOfPeriod = dateRange[0]
        const endOfPeriod = dateRange[1]
        const chargesForCurrentMonth = transactionsCharges.filter((chargeItem) => {
            const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
            return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
        })
        setTenantChargesItems(transactionsCharges);
        setFilteredChargeItems(chargesForCurrentMonth);
    }, [transactionsCharges]);

    const totalNumOfCharges = filteredChargeItems.length

    const totalChargesAmount = filteredChargeItems
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const chargesWithPayments = filteredChargeItems.filter(charge => charge.payed_status === true).length

    const totalPaymentsAmount = filteredChargeItems
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactionsCharges according to the search criteria here
        let filteredStatements = tenantChargesItems
        let dateRange = []
        let startOfPeriod;
        let endOfPeriod;
        if (periodFilter) {
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
            filteredStatements = filteredStatements.filter((chargeItem) => {
                const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
            })
        }
        filteredStatements = filteredStatements
            .filter(({ charge_date }) => !fromDateFilter ? true : charge_date >= fromDateFilter)
            .filter(({ charge_date }) => !toDateFilter ? true : charge_date <= toDateFilter)
            .filter(({ charge_type }) => !chargeType ? true : charge_type === chargeType.value)
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
            .filter(({ tenant_id }) => !contactFilter ? true : tenant_id === contactFilter.id)
        setFilteredChargeItems(filteredStatements);
    };

    const handleChargeDelete = async (chargeId, url) => {
        transactions.filter((payment) => payment.charge_id === chargeId).forEach(async payment => {
            await handleItemDelete(payment.id, "charge-payments")
            if (payment.security_deposit_charge_id) {
                const leaseWithChargeOnDeposit = leases.find(({ id }) => id === payment.security_deposit_charge_id)
                if (leaseWithChargeOnDeposit) {
                    const securityDepositBeforePayment = parseFloat(leaseWithChargeOnDeposit.security_deposit) + parseFloat(payment.payment_amount)
                    const leaseToEdit = {
                        id: payment.security_deposit_charge_id,
                        security_deposit: securityDepositBeforePayment
                    }
                    await handleItemSubmit(leaseToEdit, 'leases')
                }
            }
        });
        await handleItemDelete(chargeId, url)
    }

    const setChargesPaidInFull = async () => {
        const chargesToAddPayments = transactionsCharges.filter(({ id }) => selected.includes(id))
            .filter(({ payed_status }) => payed_status === false)
        //post the charges here to show that they are payed
        chargesToAddPayments.forEach(async (charge) => {
            const chargePayment = {
                charge_id: charge.id,
                payment_amount: charge.charge_amount,
                payment_date: defaultDate,
                tenant_id: charge.tenant_id,
                unit_id: charge.unit_id,
                property_id: charge.property_id,
                payment_label: charge.charge_label,
                memo: `${charge.charge_label} Payment`,
                payment_type: charge.charge_type,
            };
            await handleItemSubmit(chargePayment, 'charge-payments')
            await handleItemSubmit({ id: charge.id, payed: true }, 'transactions-charges')
        })
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredChargeItems(tenantChargesItems);
        setChargeTypeFilter("");
        setFromDateFilter("");
        setToDateFilter("");
        setContactFilter(null)
        setPeriodFilter("month-to-date");
        setPropertyFilter("all")
    };

    return (
        <Layout pageTitle="Other Charges">
            <Grid
                container
                spacing={2}
                justify="center" direction="column"
            >
                <Grid item key={2}>
                    <PageHeading text={"Other Charges"} />
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
                            disabled={selected.length <= 0}
                            onClick={() => setChargesPaidInFull()}
                        >
                            Receive Full Payments
                            </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            disabled={selected.length <= 0}
                            startIcon={<AddIcon />}
                            component={Link}
                            to={`/app/payments/${selected[0]}/new`}
                        >
                            Receive Payment
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            disabled={selected.length <= 0}
                            startIcon={<AddIcon />}
                            to={`/app/payments/${selected[0]}/new?charge_deposit=1`}
                            component={Link}
                        >
                            Charge on Deposit
                            </Button>
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={`Tenants Charges Records`}
                            reportTitle={'Tenant Charges Data'}
                            headCells={headCells}
                            dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={selected.length <= 0}
                            reportName={'Tenant Charges Data'}
                            reportTitle={`Tenant Charges Records`}
                            headCells={headCells}
                            dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                </Grid>
                <Grid item container>
                    <Grid item sm={12}>
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
                                    <Grid item container direction="column" spacing={2}>
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
                                        </Grid>
                                        <Grid item container direction="row" spacing={2}>
                                            <Grid item xs={12} md={4}>
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
                                            <Grid item xs={12} md={4}>
                                                <Autocomplete
                                                    id="contact_filter"
                                                    options={contacts}
                                                    getOptionSelected={(option, value) => option.id === value.id}
                                                    name="contact_filter"
                                                    defaultValue=""
                                                    onChange={(event, newValue) => {
                                                        setContactFilter(newValue);
                                                    }}
                                                    value={contactFilter}
                                                    getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                                    style={{ width: "100%" }}
                                                    renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Autocomplete
                                                    id="charge_type_filter"
                                                    options={CHARGE_TYPES}
                                                    getOptionSelected={(option, value) => option.value === value.value}
                                                    name="charge_type_filter"
                                                    onChange={(event, newValue) => {
                                                        setChargeTypeFilter(newValue);
                                                    }}
                                                    value={chargeType}
                                                    getOptionLabel={(charge_type) => charge_type ? charge_type.label : ''}
                                                    style={{ width: "100%" }}
                                                    renderInput={(params) => <TextField {...params} label="Charge Type" variant="outlined" />}
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
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container>
                    <Grid item sm={12}>
                        <Box border={1} borderRadius="borderRadius" borderColor="grey.400" className={classes.form}>
                            <Grid container direction="row" spacing={1}>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Charges: {currencyFormatter.format(totalChargesAmount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Charges: {totalNumOfCharges}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total  Payments: {currencyFormatter.format(totalPaymentsAmount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Charges With Payments: {chargesWithPayments}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Outstanding Balances: {currencyFormatter.format((totalChargesAmount - totalPaymentsAmount))}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Charges Without Payments: {(totalNumOfCharges - chargesWithPayments)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container>
                    <Grid item sm={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredChargeItems}
                            headCells={headCells}
                            noDetailsCol={true}
                            noEditCol={true}
                            deleteUrl={'transactions-charges'}
                            handleDelete={handleChargeDelete}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Layout >
    );
};

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions.filter((payment) => payment.payment_type !== 'rent'),
        transactionsCharges: state.transactionsCharges
            .filter((charge) => charge.charge_type !== 'rent')
            .map((charge) => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const unitWithCharge = state.propertyUnits.find(({ id }) => id === charge.unit_id) || {};
                const chargeDetails = {}
                chargeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
                chargeDetails.tenant_id_number = tenant.id_number
                chargeDetails.unit_ref = unitWithCharge.ref
                //get payments with this charge id
                const chargePayments = state.transactions.filter((payment) => payment.charge_id === charge.id)
                chargeDetails.payed_status = chargePayments.length ? true : false;
                const payed_amount = chargePayments.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue.payment_amount) || 0
                }, 0)
                chargeDetails.payed_amount = payed_amount
                chargeDetails.balance = parseFloat(charge.charge_amount) - payed_amount
                return Object.assign({}, charge, chargeDetails);
            }).sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
        leases: state.leases,
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TenantChargesStatementPage = connect(mapStateToProps, mapDispatchToProps)(TenantChargesStatementPage);

export default withRouter(TenantChargesStatementPage);

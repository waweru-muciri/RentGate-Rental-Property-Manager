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
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import PrintIcon from "@material-ui/icons/Print";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { currencyFormatter, getTransactionsFilterOptions, getStartEndDatesForPeriod } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import { printInvoice } from "../assets/PrintingHelper";
import PaymentInputForm from "../components/payments/PaymentInputForm";
import CreditNoteInputForm from "../components/charges/AddCreditNote";
import { handleItemFormSubmit } from '../actions/actions'


const PERIOD_FILTER_OPTIONS = getTransactionsFilterOptions()

const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number", },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type", },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "charge_amount", numeric: true, disablePadding: true, label: "Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: true, disablePadding: true, label: "Total Amounts Paid" },
    { id: "balance", numeric: false, disablePadding: true, label: "Balance After Payments" },
    { id: "total_credit_amounts", numeric: true, disablePadding: true, label: "Total Credit Amount" },
    { id: "balance_after_credits", numeric: false, disablePadding: true, label: "Balance After Credit" },

];

let TenantChargesStatementPage = ({
    properties,
    contacts,
    rentalCharges,
    handleItemSubmit
}) => {
    const classes = commonStyles()
    let [tenantChargesItems, setTenantChargesItems] = useState([]);
    let [filteredChargeItems, setFilteredChargeItems] = useState([]);
    let [chargeType, setChargeTypeFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState('month-to-date');
    let [fromDateFilter, setFromDateFilter] = useState('');
    let [toDateFilter, setToDateFilter] = useState("");
    let [contactFilter, setContactFilter] = useState(null);
    let [propertyFilter, setPropertyFilter] = useState("all");
    const [addPaymentToChargeModalState, setAddPaymentToChargesModalState] = useState(false);
    const [addCreditNoteToChargeModalState, setAddCreditNoteToChargeModalState] = useState(false);

    const [selected, setSelected] = useState([]);

    const CHARGE_TYPES = Array.from(new Set(filteredChargeItems
        .map((chargeItem) => (JSON.stringify({ label: chargeItem.charge_label, value: chargeItem.charge_type })))))
        .map(chargeType => JSON.parse(chargeType))

    useEffect(() => {
        setTenantChargesItems(rentalCharges);
        setFilteredChargeItems(filterChargesByCriteria(rentalCharges));
    }, [rentalCharges]);

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

    const totalCreditAmount = filteredChargeItems
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.total_credit_amounts) || 0
        }, 0)

    const filterChargesByCriteria = (chargesToFilter) => {
        let filteredStatements = chargesToFilter
        if (periodFilter) {
            const { startDate, endDate } = getStartEndDatesForPeriod(periodFilter)
            filteredStatements = filteredStatements.filter((chargeItem) => {
                const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(chargeItemDate, { start: startDate, end: endDate })
            })
        }
        filteredStatements = filteredStatements
            .filter(({ charge_type, charge_date, property_id, tenant_id }) =>
                (!fromDateFilter ? true : charge_date >= fromDateFilter)
                && (!toDateFilter ? true : charge_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (!chargeType ? true : charge_type === chargeType.value)
                && (!contactFilter ? true : tenant_id === contactFilter.id)
            )
        return filteredStatements;
    }

    const toggleAddPaymentToChargeModal = () => {
        setAddPaymentToChargesModalState(!addPaymentToChargeModalState)
    }

    const toggleAddCreditNoteToChargeModal = () => {
        setAddCreditNoteToChargeModalState(!addCreditNoteToChargeModalState)
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the rentalCharges according to the search criteria here
        setFilteredChargeItems(filterChargesByCriteria(tenantChargesItems));
        setSelected([]);
    };


    const resetSearchForm = (event) => {
        event.preventDefault();
        setChargeTypeFilter("");
        setPeriodFilter("month-to-date");
        setFromDateFilter("");
        setToDateFilter("");
        setContactFilter(null)
        setPropertyFilter("all")
    };

    return (
        <Layout pageTitle="Outstanding Balances">
            <Grid
                container
                spacing={2}
                justify="center" direction="column"
            >
                <Grid item key={2}>
                    <PageHeading text={"Outstanding Balances"} />
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
                            disabled={selected.length !== 1}
                            startIcon={<AddIcon />}
                            onClick={() => toggleAddPaymentToChargeModal()}
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
                            disabled={selected.length !== 1}
                            startIcon={<AddIcon />}
                            onClick={() => toggleAddCreditNoteToChargeModal()}
                        >
                            Add Credit Note
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            aria-label="Print Invoice"
                            variant="contained"
                            size="medium"
                            color="primary"
                            disabled={!contactFilter || !selected.length}
                            onClick={() => {
                                const tenantDetails = contacts.find(({ id }) => id === contactFilter.id)
                                printInvoice(
                                    tenantDetails,
                                    filteredChargeItems.filter(({ id }) => selected.includes(id))
                                )
                            }}
                            startIcon={<PrintIcon />}>
                            Print Invoice
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Tenants Outstanding Balances Data'}
                            reportTitle={`Tenants Outstanding Balances Records`}
                            headCells={headCells}
                            dataToPrint={filteredChargeItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
                            reportName={`Tenants Outstanding Balances Records`}
                            reportTitle={'Tenants Outstanding Balances Data'}
                            headCells={headCells}
                            dataToPrint={filteredChargeItems.filter(({ id }) => selected.includes(id))}
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
                                            <Grid item md={4} xs={12}>
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
                                                >
                                                    {PERIOD_FILTER_OPTIONS.map((filterOption, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={filterOption.id}
                                                        >
                                                            {filterOption.text}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item container xs={12} md={8} direction="row" spacing={2}>
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
                                            <Grid item container xs={12} md={8} direction="row" spacing={2}>
                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        variant="outlined"
                                                        name="chargeType"
                                                        label="Charge Type"
                                                        id="chargeType"
                                                        onChange={(event) => {
                                                            setChargeTypeFilter(
                                                                event.target.value
                                                            );
                                                        }}
                                                        value={chargeType}
                                                    >
                                                        {CHARGE_TYPES.map(
                                                            (charge_type, index) => (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={charge_type.value}
                                                                >
                                                                    {charge_type.label}
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
                                            Total Credit Issued: {totalCreditAmount}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                {
                    addPaymentToChargeModalState ?
                        <PaymentInputForm open={addPaymentToChargeModalState}
                            chargeToAddPaymentTo={tenantChargesItems.find(({ id }) => selected.includes(id)) || {}}
                            handleClose={toggleAddPaymentToChargeModal}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                {
                    addCreditNoteToChargeModalState ?
                        <CreditNoteInputForm open={addCreditNoteToChargeModalState}
                            chargeToAddCreditNote={tenantChargesItems.find(({ id }) => selected.includes(id)) || {}}
                            handleClose={toggleAddCreditNoteToChargeModal}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                <Grid item container>
                    <Grid item sm={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredChargeItems}
                            headCells={headCells}
                            noDetailsCol={true}
                            noEditCol={true}
                            noDeleteCol={true}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Layout >
    );
};

const mapStateToProps = (state) => {
    console.log(state.creditNotes)
    return {
        rentalPayments: state.rentalPayments,
        rentalCharges: state.rentalCharges
            .map((charge) => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const unitWithCharge = state.propertyUnits.find(({ id }) => id === charge.unit_id) || {};
                const chargeDetails = {}
                chargeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
                chargeDetails.tenant_id_number = tenant.id_number
                chargeDetails.unit_ref = unitWithCharge.ref
                //get payments with this charge id
                const chargePayments = state.rentalPayments.filter((payment) => payment.charge_id === charge.id)
                chargeDetails.payed_status = chargePayments.length ? true : false;
                const payed_amount = chargePayments.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue.payment_amount) || 0
                }, 0)
                chargeDetails.payed_amount = payed_amount
                //get all credit notes issued under this charge
                const chargeCreditNotes = state.creditNotes.filter((creditNote) => creditNote.charge_id === charge.id)
                const totalCreditNoteAmounts = chargeCreditNotes.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue.credit_amount) || 0
                }, 0)
                //get total of all credit notes issued
                chargeDetails.total_credit_amounts = totalCreditNoteAmounts
                //get charge balance by subtracting payments + total credits from charge amount
                chargeDetails.balance = parseFloat(charge.charge_amount) - payed_amount
                chargeDetails.balance_after_credits = parseFloat(charge.charge_amount) - (payed_amount + totalCreditNoteAmounts)
                return Object.assign({}, charge, chargeDetails);
            })
            .filter((charge) => charge.balance > 0)
            .sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};
TenantChargesStatementPage = connect(mapStateToProps, mapDispatchToProps)(TenantChargesStatementPage);

export default withRouter(TenantChargesStatementPage);

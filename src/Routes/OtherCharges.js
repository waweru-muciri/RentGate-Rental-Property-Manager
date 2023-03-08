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
import AddPaymentToChargesModal from "../components/charges/AddPaymentToChargesModal";
import {
    getTransactionsFilterOptions, currencyFormatter, getStartEndDatesForPeriod
} from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import ChargeEditForm from "../components/charges/ChargeEditForm";
import PaymentInputForm from "../components/payments/PaymentInputForm";


const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()


const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number", },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type", },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "charge_amount", numeric: true, disablePadding: false, label: "Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: true, disablePadding: false, label: "Total Amounts Paid" },
    { id: "balance", numeric: true, disablePadding: false, label: "Balance" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let TenantChargesStatementPage = ({
    match,
    properties,
    contacts,
    rentalPayments,
    rentalCharges,
    handleItemSubmit,
    handleItemDelete,
}) => {
    const classes = commonStyles()
    const [allNonRentCharges, setAllNonRentCharges] = useState([]);
    const [filteredAllNonRentCharges, setFilteredAllNonRentCharges] = useState([]);
    const [chargeType, setChargeTypeFilter] = useState("");
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState("");
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [contactFilter, setContactFilter] = useState(null);
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [addFullPaymentsToChargesModalState, setAddFullPaymentsToChargesModalState] = useState(false);
    const [editChargeModalState, setEditChargeModalState] = useState(false);
    const [addPaymentToChargeModalState, setAddPaymentToChargesModalState] = useState(false);
    const [selected, setSelected] = useState([]);
    const [chargeToEditId, setChargeToEditId] = useState();

    const CHARGE_TYPES = Array.from(new Set(allNonRentCharges
        .map((chargeItem) => (JSON.stringify({ label: chargeItem.charge_label, value: chargeItem.charge_type })))))
        .map(chargeType => JSON.parse(chargeType))

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
            .filter(({ charge_date, property_id, tenant_id, charge_type }) =>
                (!fromDateFilter ? true : charge_date >= fromDateFilter)
                && (!toDateFilter ? true : charge_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (!chargeType ? true : charge_type === chargeType.value)
                && (!contactFilter ? true : tenant_id === contactFilter.id)
            )
        return filteredStatements;
    }

    useEffect(() => {
        setAllNonRentCharges(rentalCharges);
        setFilteredAllNonRentCharges(filterChargesByCriteria(rentalCharges));
    }, [rentalCharges]);

    const totalNumOfCharges = filteredAllNonRentCharges.length

    const totalChargesAmount = filteredAllNonRentCharges
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const chargesWithPayments = filteredAllNonRentCharges.filter(charge => charge.payed_status === true).length

    const totalPaymentsAmount = filteredAllNonRentCharges
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const toggleAddFullPaymentsToChargesModalState = () => {
        setAddFullPaymentsToChargesModalState(!addFullPaymentsToChargesModalState)
    }

    const toggleAddPaymentToChargeModal = () => {
        setAddPaymentToChargesModalState(!addPaymentToChargeModalState)
    }

    const toggleEditChargeModalState = () => {
        setEditChargeModalState(!editChargeModalState)
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the rentalCharges according to the search criteria here
        setFilteredAllNonRentCharges(filterChargesByCriteria(allNonRentCharges));
    };

    const handleChargeDelete = async (chargeId, url) => {
        try {
            //delete all payments for this charge
            rentalPayments.filter((payment) => payment.charge_id === chargeId).forEach(async payment => {
                await handleItemDelete(payment.id, "charge-payments")
            });
            //finally delete the charge itself
            await handleItemDelete(chargeId, url);
        } catch (error) {
            console.log("Error deleting charge => ", error)
        }
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
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
                            disabled={!selected.length}
                            onClick={() => toggleAddFullPaymentsToChargesModalState()}
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
                            to={`${match.url}/charge-on-deposit/${selected[0]}/new`}
                            component={Link}
                        >
                            Charge on Deposit
                            </Button>
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
                            reportName={`Tenants Charges Records`}
                            reportTitle={'Tenant Charges Data'}
                            headCells={headCells}
                            dataToPrint={allNonRentCharges.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Tenant Charges Data'}
                            reportTitle={`Tenant Charges Records`}
                            headCells={headCells}
                            dataToPrint={allNonRentCharges.filter(({ id }) => selected.includes(id))}
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
                {
                    addFullPaymentsToChargesModalState ?
                        <AddPaymentToChargesModal open={addFullPaymentsToChargesModalState}
                            chargesToAddPayments={rentalCharges.filter(({ id }) => selected.includes(id))
                                .filter(({ payed_status }) => payed_status === false)}
                            handleClose={toggleAddFullPaymentsToChargesModalState}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                {
                    editChargeModalState ?
                        <ChargeEditForm open={editChargeModalState}
                            chargeToEdit={rentalCharges.find(({ id }) => id === chargeToEditId)}
                            handleClose={toggleEditChargeModalState}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                {
                    addPaymentToChargeModalState ?
                        <PaymentInputForm open={addPaymentToChargeModalState}
                            chargeToAddPaymentTo={rentalCharges.find(({ id }) => selected.includes(id))}
                            handleClose={toggleAddPaymentToChargeModal}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                <Grid item container>
                    <Grid item sm={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredAllNonRentCharges}
                            headCells={headCells}
                            noDetailsCol={true}
                            optionalEditHandler={(selectedRowIndex) => {setChargeToEditId(selectedRowIndex); toggleEditChargeModalState()}}
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
        rentalPayments: state.rentalPayments.filter((payment) => payment.payment_type !== 'rent'),
        rentalCharges: state.rentalCharges
            .filter((charge) => charge.charge_type !== 'rent')
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
                chargeDetails.balance = parseFloat(charge.charge_amount) - payed_amount
                return Object.assign({}, charge, chargeDetails);
            }).sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
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

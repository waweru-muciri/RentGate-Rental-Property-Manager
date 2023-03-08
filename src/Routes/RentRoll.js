import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import TabPanel from "../components/TabPanel";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import CommonTable from "../components/table/commonTable";
import { connect } from "react-redux";
import { commonStyles } from "../components/commonStyles";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import RentBalancesPage from "./RentBalancesPage";
import { handleItemFormSubmit, handleDelete } from '../actions/actions'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getTransactionsFilterOptions, currencyFormatter, getStartEndDatesForPeriod } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import AddPaymentToChargesModal from "../components/charges/AddPaymentToChargesModal";
import ChargeEditForm from "../components/charges/ChargeEditForm";
import PaymentInputForm from "../components/payments/PaymentInputForm";


const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()


const headCells = [
    { id: "unit_details", numeric: false, disablePadding: true, label: "Unit Details", },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Rent Due Date", },
    { id: "charge_amount", numeric: true, disablePadding: false, label: "Rent Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: true, disablePadding: false, label: "Total Amounts Paid" },
    { id: "balance", numeric: true, disablePadding: false, label: "Rent Balance" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let RentRollPage = ({
    match,
    rentalCharges,
    properties,
    contacts,
    rentalPayments,
    handleItemSubmit,
    handleItemDelete
}) => {
    const [rentCharges, setRentCharges] = useState([]);
    const [filteredRentCharges, setFilteredRentCharges] = useState([]);
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [contactFilter, setContactFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [chargeToEditId, setChargeToEditId] = useState();
    const [addFullPaymentsToChargesModalState, setAddFullPaymentsToChargesModalState] = useState(false);
    const [editChargeModalState, setEditChargeModalState] = useState(false);
    const [addPaymentToChargeModalState, setAddPaymentToChargesModalState] = useState(false);

    const classes = commonStyles();

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const rentChargesWithBalances = rentCharges.filter(rentCharge => rentCharge.balance > 0)

    const totalRentCharges = filteredRentCharges
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalRentPayments = filteredRentCharges
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const handleAddFullPaymentsToChargesToggle = () => {
        setAddFullPaymentsToChargesModalState(!addFullPaymentsToChargesModalState)
    }

    const toggleEditChargeModalState = () => {
        setEditChargeModalState(!editChargeModalState)
    }

    const toggleAddPaymentToChargeModal = () => {
        setAddPaymentToChargesModalState(!addPaymentToChargeModalState)
    }

    const filterChargesByCriteria = (rentChargesToFilter) => {
        //filter the charges according to the search criteria here
        let filteredRentChargesItems = rentChargesToFilter
        if (periodFilter) {
            const { startDate, endDate } = getStartEndDatesForPeriod(periodFilter)
            filteredRentChargesItems = filteredRentChargesItems.filter((chargeItem) => {
                const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(chargeItemDate, { start: startDate, end: endDate })
            })
        }
        filteredRentChargesItems = filteredRentChargesItems
            .filter(({ charge_date, property_id, tenant_id }) =>
                (!fromDateFilter ? true : charge_date >= fromDateFilter)
                && (!toDateFilter ? true : charge_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (!contactFilter ? true : tenant_id === contactFilter.id)
            )
        return filteredRentChargesItems;
    }

    useEffect(() => {
        setRentCharges(rentalCharges);
        setFilteredRentCharges(filterChargesByCriteria(rentalCharges));
    }, [rentalCharges]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        setFilteredRentCharges(filterChargesByCriteria(rentCharges));
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("all");
        setContactFilter(null);
        setPeriodFilter("month-to-date");
        setFromDateFilter("");
        setToDateFilter("");
    };

    const handleRentChargeDelete = async (chargeId, url) => {
        try {
            rentalPayments.filter((payment) => payment.charge_id === chargeId).forEach(async payment => {
                await handleItemDelete(payment.id, "charge-payments")
            });
            await handleItemDelete(chargeId, url)
        } catch (error) {
            console.log("Error deleting rent charge => ", error)
        }
    }

    return (
        <Layout pageTitle="Rent Charges Roll">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Rent Charges Roll" />
                    <Tab label="Rent Outstanding Balances" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={1}>
                <RentBalancesPage rentalCharges={rentChargesWithBalances} properties={properties}
                    contacts={contacts} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
                <Grid
                    container
                    spacing={3}
                    justify="center" direction="column"
                >
                    <Grid item key={2}>
                        <PageHeading text={"Rent Charges Roll"} />
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
                                onClick={() => handleAddFullPaymentsToChargesToggle()}
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
                            <PrintArrayToPdf
                                disabled={!selected.length}
                                reportName={'Rent Charges Roll Records'}
                                reportTitle={'Rent Charges Roll Data'}
                                headCells={headCells}
                                dataToPrint={rentCharges.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                disabled={!selected.length}
                                reportName={'Rent Charges Roll Records'}
                                reportTitle={'Rent Charges Roll Data'}
                                headCells={headCells}
                                dataToPrint={rentCharges.filter(({ id }) => selected.includes(id))}
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
                                id="rentRollSearchForm"
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
                    <Grid item>
                        <Box border={1} borderRadius="borderRadius" borderColor="grey.400" className={classes.form}>
                            <Grid container direction="row" spacing={1}>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Rent Charges: {currencyFormatter.format(totalRentCharges)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Rent Payments: {currencyFormatter.format(totalRentPayments)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Outstanding Rent Balances: {currencyFormatter.format((totalRentCharges - totalRentPayments))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    {
                        addFullPaymentsToChargesModalState ?
                            <AddPaymentToChargesModal open={addFullPaymentsToChargesModalState}
                                chargesToAddPayments={rentalCharges.filter(({ id }) => selected.includes(id))
                                    .filter(({ payed_status }) => payed_status === false)}
                                handleClose={handleAddFullPaymentsToChargesToggle}
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
                    <Grid item xs={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredRentCharges}
                            headCells={headCells}
                            optionalEditHandler={(selectedRowIndex) => { setChargeToEditId(selectedRowIndex); toggleEditChargeModalState() }}
                            noDetailsCol={true}
                            deleteUrl={'transactions-charges'}
                            handleDelete={handleRentChargeDelete}
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        rentalPayments: state.rentalPayments.filter((payment) => payment.payment_type === 'rent'),
        rentalCharges: state.rentalCharges
            .filter((charge) => charge.charge_type === 'rent')
            .map((charge) => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const unitWithCharge = state.propertyUnits.find(({ id }) => id === charge.unit_id) || {};
                const chargePayments = state.rentalPayments.filter((payment) => payment.charge_id === charge.id)
                const payed_amount = chargePayments.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue.payment_amount) || 0
                }, 0)
                const property = state.properties.find(property => property.id === charge.property_id) || {}
                const chargeDetails = {
                    tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                    tenant_id_number: tenant.id_number,
                    payed_status: chargePayments.length ? true : false,
                    payed_amount: payed_amount,
                    balance: (parseFloat(charge.charge_amount) - payed_amount),
                    unit_details: `${property.ref} - ${unitWithCharge.ref}`,
                }
                return Object.assign({}, charge, chargeDetails);
            }).sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
        leases: state.leases,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(RentRollPage);

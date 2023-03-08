import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
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
import moment from "moment";
import { handleItemFormSubmit } from '../actions/actions'

const defaultDate = moment().format('YYYY-MM-DD')

const headCells = [
    { id: "unit_details", numeric: false, disablePadding: true, label: "Unit Details", },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Rent Due Date", },
    { id: "charge_amount", numeric: false, disablePadding: true, label: "Rent Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: false, disablePadding: true, label: "Total Amounts Paid" },
    { id: "balance", numeric: false, disablePadding: true, label: "Rent Balance" },
];

let RentRollPage = ({
    transactionsCharges,
    properties,
    contacts,
    users,
    handleItemSubmit
}) => {
    let [chargeItems, setChargeItems] = useState([]);
    let [filteredChargeItems, setFilteredChargeItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [contactFilter, setContactFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    let [fromDateFilter, setFromDateFilter] = useState(moment().format('YYYY-MM-DD'));
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const classes = commonStyles();

    useEffect(() => {
        setChargeItems(transactionsCharges);
        setFilteredChargeItems(transactionsCharges);
    }, [transactionsCharges]);


    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the charges according to the search criteria here
        let filteredStatements = chargeItems
            .filter(({ charge_date }) =>
                !fromDateFilter ? true : charge_date >= fromDateFilter
            )
            .filter(({ charge_date }) =>
                !toDateFilter ? true : charge_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )
            .filter(({ tenant_id }) =>
                !contactFilter ? true : tenant_id === contactFilter
            )
        setFilteredChargeItems(filteredStatements);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredChargeItems(chargeItems);
        setPropertyFilter("");
        setContactFilter("");
        setAssignedToFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    const setPayedChargesPayedInFull = () => {
        const chargesToAddPayments = transactionsCharges.filter(({ id }) => selected.includes(id))
        .filter(({payed_status}) => payed_status === false)
        //post the charges here to show that they are payed
        chargesToAddPayments.forEach(async(charge) => {
            const chargePayment = {
                charge_id: charge.id,
                amount: charge.charge_amount,
                payment_date: defaultDate,
                tenant_id: charge.tenant_id,
                unit_ref: charge.unit_ref,
                unit_id: charge.unit_id,
                payment_label: charge.charge_label,
                payment_type: charge.charge_type,
            };
            await handleItemSubmit(chargePayment, 'charge-payments')
        })
    }

    return (
        <Layout pageTitle="Rent Roll">
            <Grid
                container
                spacing={3}
                justify="center" direction="column"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={"Rent Roll"} />
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
                            disabled={selected.length <= 0}
                            onClick={() => setPayedChargesPayedInFull()}
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
                            to={`/payments/${selected[0]}/new`}
                        >
                            Add Payment
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={selected.length <= 0}
                            reportName={'Rent Roll Records'}
                            reportTitle={'Rent Roll Data'}
                            headCells={headCells}
                            dataToPrint={chargeItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Rent Roll Records'}
                            reportTitle={'Rent Roll Data'}
                            headCells={headCells}
                            dataToPrint={chargeItems.filter(({ id }) => selected.includes(id))}
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
                                    spacing={1}
                                    justify="center"
                                    direction="row"
                                >
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
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            variant="outlined"
                                            id="assigned_to"
                                            name="assigned_to"
                                            label="Assigned To"
                                            value={assignedToFilter}
                                            onChange={(event) => {
                                                setAssignedToFilter(
                                                    event.target.value
                                                );
                                            }}
                                        >
                                            {users.map((user, index) => (
                                                <MenuItem key={index} value={user.id}>
                                                    {user.first_name} {user.last_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            variant="outlined"
                                            type="text"
                                            name="contact_filter"
                                            label="Contact"
                                            id="contact_filter"
                                            onChange={(event) => {
                                                setContactFilter(event.target.value);
                                            }}
                                            value={contactFilter}
                                            InputLabelProps={{ shrink: true }}
                                        >
                                            {contacts.map((contact, contactIndex) => (
                                                <MenuItem key={contactIndex} value={contact.id}>
                                                    {contact.first_name} {contact.last_name}
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
                        noDetailsCol={true}
                        noEditCol={true}
                        noDeleteCol={true}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions.filter((payment) => payment.payment_type === 'rent'),
        properties: state.properties,
        transactionsCharges: state.transactionsCharges
            .filter((charge) => charge.charge_type === 'rent').sort((charge1, charge2) => charge2.charge_date > charge1.charge_date)
            .map((charge) => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const chargeDetails = {}
                chargeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
                chargeDetails.tenant_id_number = tenant.id_number
                chargeDetails.status = moment(charge.lease_end).month() > moment().month() ? 'Active' : 'Inactive'
                // const daysLeft = moment(charge.lease_end).diff(moment(), 'days')
                // chargeDetails.days_left = daysLeft < 0 ? 0 : daysLeft
                //get payments with this charge id
                const chargePayments = state.transactions.filter((payment) => payment.charge_id === charge.id)
                chargeDetails.payed_status = chargePayments.length ? true : false;
                let payed_amount = 0
                chargePayments.forEach(chargePayment => {
                    payed_amount += parseFloat(chargePayment.amount) || 0
                });
                chargeDetails.payed_amount = payed_amount
                chargeDetails.balance = charge.charge_amount - chargeDetails.payed_amount
                const property = state.properties.find(property => property.id === charge.property_id) || {}
                chargeDetails.unit_details = `${property.ref} - ${charge.unit_ref}`;
                return Object.assign({}, charge, chargeDetails);
            }),
        contacts: state.contacts,
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(RentRollPage);

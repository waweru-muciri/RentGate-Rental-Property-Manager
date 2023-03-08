import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import CustomizedSnackbar from "../components/CustomSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import { getTransactionsFilterOptions } from "../assets/commonAssets";
import moment from "moment";


const PERIOD_FILTER_OPTIONS = getTransactionsFilterOptions()

const headCells = [
    { id: "payment_date", numeric: false, disablePadding: true, label: "Payment Date" },
    { id: "payment_label", numeric: false, disablePadding: true, label: "Payment Type" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Number/Ref" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID" },
    { id: "amount", numeric: false, disablePadding: true, label: "Payment Amount" },
    { id: "memo", numeric: false, disablePadding: true, label: "Payment Notes/Memo" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];


let PaymentsPage = ({
    transactions,
    properties,
    match,
    handleItemDelete,
    error,
}) => {
    const classes = commonStyles();
    let [paymentsItems, setPaymentsItems] = useState([]);
    let [filteredPaymentsItems, setFilteredPaymentsItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState();
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
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
        if (periodFilter) {
            switch (periodFilter) {
                case 'last-month':
                    startOfPeriod = moment().subtract(1, 'months').startOf('month')
                    endOfPeriod = moment().subtract(1, 'months').endOf('month')
                    break;
                case 'year-to-date':
                    startOfPeriod = moment().startOf('year')
                    endOfPeriod = moment()
                    break;
                case 'last-year':
                    startOfPeriod = moment().subtract(1, 'years').startOf('year')
                    endOfPeriod = moment().subtract(1, 'years').endOf('year')
                    break;
                default:
                    startOfPeriod = moment().subtract(periodFilter, 'months').startOf('month')
                    endOfPeriod = moment()
                    break;
            }
            filteredPayments = filteredPayments.filter((paymentItem) => {
                const paymentDate = moment(paymentItem.payment_date)
                return paymentDate.isSameOrAfter(startOfPeriod) && paymentDate.isSameOrBefore(endOfPeriod)
            })
        };
        filteredPayments = filteredPayments.filter(({ payment_date }) =>
            !fromDateFilter ? true : payment_date >= fromDateFilter)
            .filter(({ payment_date }) =>
                !toDateFilter ? true : payment_date <= toDateFilter)
            .filter(({ property_id }) =>
                !propertyFilter ? true : property_id === propertyFilter)
        setFilteredPaymentsItems(filteredPayments);
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredPaymentsItems(paymentsItems);
        setPropertyFilter("");
        setPeriodFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Layout pageTitle="Payments">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Payments'} />
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
                                direction="row"
                            >
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="property_filter"
                                        label="Select Property"
                                        id="property_filter"
                                        onChange={(event) => {
                                            setPropertyFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={propertyFilter}
                                    >
                                        {properties.map((property, index) => (
                                            <MenuItem
                                                key={index}
                                                value={property.id}
                                            >
                                                {property.ref}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
        transactions: state.transactions.map((payment) => {
            const tenant = state.contacts.find((contact) => contact.id === payment.tenant_id) || {};
            return Object.assign({}, payment, {
                tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                tenant_id_number: tenant.id_number,
            })
        }).sort((payment1, payment2) => payment1.payment_date > payment2.payment_date),
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

PaymentsPage = connect(mapStateToProps, mapDispatchToProps)(PaymentsPage);

export default withRouter(PaymentsPage);

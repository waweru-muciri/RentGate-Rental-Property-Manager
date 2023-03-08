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


const PERIOD_FILTER_OPTIONS = getTransactionsFilterOptions()

const headCells = [
    { id: "payment_date", numeric: false, disablePadding: true, label: "Payment Date" },
    { id: "payment_label", numeric: false, disablePadding: true, label: "Payment Type" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Number/Ref" },
    { id: "amount", numeric: false, disablePadding: true, label: "Payment Amount" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];


let TransactionPage = ({
    transactions,
    properties,
    match,
    handleItemDelete,
    error,
}) => {
    const classes = commonStyles();
    let [transactionItems, setTransactionItems] = useState([]);
    let [filteredTransactionItems, setFilteredTransactionItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState();
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setTransactionItems(transactions);
        setFilteredTransactionItems(transactions);
    }, [transactions]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredTransactions = transactionItems
            .filter(({ payment_date }) =>
                !fromDateFilter ? true : payment_date >= fromDateFilter
            )
            .filter(({ payment_date }) =>
                !toDateFilter ? true : payment_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )
        setFilteredTransactionItems(filteredTransactions);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredTransactionItems(transactionItems);
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
                            dataToPrint={transactionItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Rental Payments Records'}
                            reportTitle={'Rental Payments Data'}
                            headCells={headCells}
                            dataToPrint={transactionItems.filter(({ id }) => selected.includes(id))}
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
                        rows={filteredTransactionItems}
                        headCells={headCells}

                        handleDelete={handleItemDelete}
                        deleteUrl={"transactions"}
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
            })
        }).sort((payment1, payment2) => payment2.payment_date > payment1.payment_date),
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

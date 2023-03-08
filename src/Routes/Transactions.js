import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/customizedSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";

const headCells = [
    {
        id: "transaction_type",
        numeric: false,
        disablePadding: true,
        label: "Transaction Type",
    },
    {
        id: "tenant",
        numeric: false,
        disablePadding: true,
        label: "Tenant Name",
    },
    {
        id: "landlord",
        numeric: false,
        disablePadding: true,
        label: "Landlord Name",
    },
    {
        id: "property",
        numeric: false,
        disablePadding: true,
        label: "Property Ref",
    },
    {
        id: "transaction_price",
        numeric: false,
        disablePadding: true,
        label: "Transaction Price",
    },
    {
        id: "agent_commission",
        numeric: false,
        disablePadding: true,
        label: "Agent Commission",
    },
    {
        id: "assigned_to",
        numeric: false,
        disablePadding: true,
        label: "Assigned To",
    },
    {
        id: "transaction_date",
        numeric: true,
        disablePadding: false,
        label: "Transaction Date",
    },
];
//sample working data here
const transactionRows = [
    {
        id: 1,
        transaction_type: "Studio",
        buyer_tenant: 2,
        seller_landlord: 1,
        agent_commission: 1333,
        property_details: "23675 Dwedney Trunk Road",
        transaction_price: 4000,
        assigned_to: "Brian Muciri",
        transaction_date: "12-12-19",
    },
    {
        id: 2,
        transaction_type: "Single Family",
        buyer_tenant: 2,
        seller_landlord: 1,
        agent_commission: 1500,
        property_details: "23675 Dwedney Trunk Road",
        transaction_price: 8000,
        assigned_to: "Brian Muciri",
        transaction_date: "12-12-19",
    },
    {
        id: 3,
        transaction_type: "Duplex",
        buyer_tenant: 1,
        seller_landlord: 1,
        agent_commission: 1600,
        property_details: "23675 Dwedney Trunk Road",
        transaction_price: 6000,
        assigned_to: "Brian Muciri",
        transaction_date: "12-12-19",
    },
    {
        id: 4,
        transaction_type: "Apartment/Condo",
        buyer_tenant: 0,
        seller_landlord: 1,
        agent_commission: 1200,
        property_details: "23675 Dwedney Trunk Road",
        transaction_price: 5000,
        assigned_to: "Brian Muciri",
        transaction_date: "12-12-19",
    },
];

let TransactionPage = ({
    isLoading,
    transactions,
    properties,
    contacts,
    match,
    error,
    handleDelete,
}) => {
    let [transactionItems, setTransactionItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);

    const USERS = []

    useEffect(() => {
        setTransactionItems(getMappedTransactions());
    }, [transactions, contacts]);

    const classes = commonStyles();

    const getMappedTransactions = () => {
        const mappedTransactions = transactions.map((transaction) => {
            const tenant = contacts.find(
                    (contact) => contact.id === transaction.tenant
                );
            const landlord = contacts.find(
                    (contact) => contact.id === transaction.landlord
                );
            const property = properties.find(
                    (property) => property.id === transaction.property
                );
            const transactionDetails = {}
            transactionDetails.tenant = typeof tenant !== 'undefined' ? tenant.first_name + ' ' + tenant.last_name : ''
            transactionDetails.landlord = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
            transactionDetails.property = typeof property !== 'undefined' ?  property.ref : null
            return Object.assign({}, transaction, transactionDetails);
        });
        return mappedTransactions;
    }

    const exportTransactionsRecordsToExcel = () => {
        let items = transactionItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Transactions  Records",
            "Transactions Data",
            items,
            "TansactionsData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredTransactions = getMappedTransactions()
            .filter(({ transaction_date }) =>
                !fromDateFilter ? true : transaction_date >= fromDateFilter
            )
            .filter(({ transaction_date }) =>
                !toDateFilter ? true : transaction_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )
            .filter(({ assigned_to }) =>
                !assignedToFilter ? true : assigned_to === assignedToFilter
            );
        setTransactionItems(filteredTransactions);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setTransactionItems(getMappedTransactions());
        setPropertyFilter("");
        setAssignedToFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Layout pageTitle="Transactions">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <PageHeading text="Transactions" />
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
                            component={Link}
                            to={`${match.url}/new`}
                        >
                            NEW
                        </Button>
                    </Grid>
                    <Grid item>
                        {" "}
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
                            Edit Transaction
                        </Button>
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            aria-label="Export to Excel"
                            disabled={selected.length <= 0}
                            onClick={(event) => {
                                exportTransactionsRecordsToExcel();
                            }}
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
                                <Grid item lg={6} md={12} xs={12}>
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
                                    {USERS.map((user, index) => (
                                <MenuItem key={index} value={user.id}>
                                    {user.first_name + user.last_name}
                                </MenuItem>
                            ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
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
                                <Grid item lg={6} md={12} xs={12}>
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
                                <Grid item lg={6} md={12} xs={12}>
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
                                        type="submit"
                                        form="contactSearchForm"
                                        color="primary"
                                        variant="contained"
                                        size="medium"
                                        startIcon={<SearchIcon />}
                                    >
                                        SEARCH{" "}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={(event) => resetSearchForm}
                                        type="reset"
                                        form="contactSearchForm"
                                        color="primary"
                                        variant="contained"
                                        size="medium"
                                        startIcon={<UndoIcon />}
                                    >
                                        RESET{" "}
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
                        rows={transactionItems}
                        headCells={headCells}
                        handleDelete={handleDelete}
                        deleteUrl={'transactions'}
                    />
                </Grid>
                {isLoading && <LoadingBackdrop open={isLoading} />}
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        transactions: state.transactions,
        properties: state.properties,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleDelete: (id) => {
            dispatch(handleDelete(id, "transactions"));
        },
    };
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

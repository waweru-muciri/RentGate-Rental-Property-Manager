import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import {
    Box,
    TextField,
    Button,
    MenuItem,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/customizedSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";

const headCells = [
    {
        id: "transaction_date",
        numeric: false,
        disablePadding: true,
        label: "Transaction Date",
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
        id: "property_ref",
        numeric: false,
        disablePadding: true,
        label: "Property Ref",
    },
    {
        id: "lease_start",
        numeric: false,
        disablePadding: true,
        label: "Lease Start",
    },
    {
        id: "lease_end",
        numeric: false,
        disablePadding: true,
        label: "Lease End",
    },
    {
        id: "security_deposit",
        numeric: false,
        disablePadding: true,
        label: "Deposit Held",
    },
    {
        id: "rent_balance",
        numeric: false,
        disablePadding: true,
        label: "Rent Balance",
    },
    {
        id: "transaction_price",
        numeric: false,
        disablePadding: true,
        label: "Rent",
    },
];

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box m={2}>{children}</Box>}
        </div>
    );
}

let TransactionPage = ({
    isLoading,
    transactions,
    properties,
    contacts,
    match,
    users,
    error,
}) => {
    const classes = commonStyles();
    let [transactionItems, setTransactionItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);

    useEffect(() => {
        setTransactionItems(getMappedTransactions());
    }, [transactions, contacts]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getMappedTransactions = () => {
        const mappedTransactions = transactions.map((transaction) => {
            const tenant = contacts.find(
                (contact) => contact.id === transaction.tenant
            );
            const landlord = users.find(
                (user) => user.id === transaction.landlord
            );
            const property = properties.find(
                (property) => property.id === transaction.property
            );
            const transactionDetails = {};
            transactionDetails.tenant =
                typeof tenant !== "undefined"
                    ? tenant.first_name + " " + tenant.last_name
                    : "";
            transactionDetails.landlord =
                typeof landlord !== "undefined"
                    ? landlord.first_name + " " + landlord.last_name
                    : "";
            if (typeof property !== "undefined") {
                transactionDetails.property_ref = property.ref
                transactionDetails.rent_balance = parseFloat(property.price) - parseFloat(transaction.transaction_price)
            }
            transactionDetails.property =
                typeof property !== "undefined" ? property.id : null;
            return Object.assign({}, transaction, transactionDetails);
        });
        return mappedTransactions;
    };

    const exportTransactionsRecordsToExcel = () => {
        let items = transactionItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Leases  Records",
            "Leases Data",
            items,
            "Leases Data"
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
            .filter(({ landlord }) =>
                !assignedToFilter ? true : landlord === assignedToFilter
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
        <Layout pageTitle="Leases">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Leases'} />
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
                            Edit
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
                                        {users.map((user, index) => (
                                            <MenuItem
                                                key={index}
                                                value={user.id}
                                            >
                                                {user.first_name + ' ' +
                                                    user.last_name}
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
                        rows={transactionItems}
                        headCells={headCells}
                        handleDelete={handleDelete}
                        deleteUrl={"transactions"}
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
        users: state.users,
        expenses: state.expenses,
        currentUser: state.currentUser,
        properties: state.properties,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

TransactionPage = connect(mapStateToProps)(TransactionPage);

export default withRouter(TransactionPage);

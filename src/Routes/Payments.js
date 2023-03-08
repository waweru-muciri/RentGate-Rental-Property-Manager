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
import PrintIcon from "@material-ui/icons/Print";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import CustomizedSnackbar from "../components/CustomSnackbar";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const headCells = [
    {
        id: "transaction_date",
        numeric: false,
        disablePadding: true,
        label: "Payment Date",
    },
    {
        id: "tenant",
        numeric: false,
        disablePadding: true,
        label: "Tenant Name",
    },
    {
        id: "landlord_name",
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
        id: "transaction_price",
        numeric: false,
        disablePadding: true,
        label: "Rent",
    },{
        id: "rent_balance",
        numeric: false,
        disablePadding: true,
        label: "Rent Balance",
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
    currentUser,
    isLoading,
    transactions,
    properties,
    contacts,
    match,
    users,
    handleItemDelete,
    error,
}) => {
    const classes = commonStyles();
    let [transactionItems, setTransactionItems] = useState([]);
    let [filteredTransactionItems, setFilteredTransactionItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState(currentUser.id);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);

    useEffect(() => {
        const mappedTransactions = transactions.sort((transaction1, transaction2) => transaction2.transaction_date > transaction1.transaction_date).map((transaction) => {
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
            transactionDetails.landlord_name =
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
        setTransactionItems(mappedTransactions);
        setFilteredTransactionItems(mappedTransactions);
    }, [transactions, contacts, properties, users]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const exportTransactionsRecordsToExcel = () => {
        let items = transactionItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Payments  Records",
            "Payments Data",
            items,
            "Payments Data"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredTransactions = transactionItems
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
        setFilteredTransactionItems(filteredTransactions);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredTransactionItems(transactionItems);
        setPropertyFilter("");
        setAssignedToFilter("");
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
                            startIcon={<AddIcon />}
                            component={Link}
                            to={`${match.url}/new`}
                        >
                            NEW
                        </Button>
                    </Grid>
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
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<PrintIcon />}
                            disabled={selected.length <= 0}
							reportName ={'Rental Payments Records'}
							reportTitle = {'Rental Payments Records'}
                            headCells={headCells}
                            dataToPrint={transactionItems.filter(({ id }) => selected.includes(id))}
                        >
                            Pdf
                        </PrintArrayToPdf>
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
                        tenantId={currentUser.tenant}
                        handleDelete={handleItemDelete}
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
        currentUser: state.currentUser,
        expenses: state.expenses,
        properties: state.properties,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (tenantId, itemId, url) => dispatch(handleDelete(tenantId, itemId, url)),
    };
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

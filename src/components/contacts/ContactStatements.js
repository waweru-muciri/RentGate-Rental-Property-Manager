import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../../components/ExportToExcelBtn";
import CommonTable from "../../components/table/commonTable";
import { commonStyles } from "../../components/commonStyles";

const headCells = [
    {
        id: "tenant",
        numeric: false,
        disablePadding: true,
        label: "Tenant's Name",
    },
    {
        id: "transaction_date",
        numeric: false,
        disablePadding: true,
        label: "Transaction Date",
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
        label: "Lease Start Date",
    },
    {
        id: "lease_end",
        numeric: false,
        disablePadding: true,
        label: "Lease End Date",
    },
    {
        id: "property_price",
        numeric: false,
        disablePadding: true,
        label: "Property Rent",
    }, {
        id: "transaction_price",
        numeric: false,
        disablePadding: true,
        label: "Transaction Price",
    },
    {
        id: "transaction_balance",
        numeric: false,
        disablePadding: true,
        label: "Transaction Balance",
    },{
        id: "security_deposit",
        numeric: false,
        disablePadding: true,
        label: "Security Deposit",
    },{
        id: "water_deposit",
        numeric: false,
        disablePadding: true,
        label: "Water deposit",
    },
];

let TenantStatementsPage = ({
    transactions,
    properties,
    contacts,
    users
}) => {
    let [statementItems, setStatementItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [contactFilter, setContactFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setStatementItems(getMappedStatements());
    }, [transactions, contacts]);

    const classes = commonStyles();

    const getMappedStatements = () => {
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
            transactionDetails.tenantId = typeof tenant !== 'undefined' ? tenant.id : ''
            transactionDetails.landlord = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
            transactionDetails.property_ref = typeof property !== 'undefined' ?  property.ref : null
            transactionDetails.property = typeof property !== 'undefined' ?  property.id : null
            transactionDetails.property_price = typeof property !== 'undefined' ?  property.price : null
            transactionDetails.security_deposit = typeof transaction !== 'undefined' ?  transaction.security_deposit : null
            transactionDetails.water_deposit = typeof transaction !== 'undefined' ?  transaction.water_deposit : null
            transactionDetails.transaction_balance = typeof property !== 'undefined' ?  property.price - transaction.transaction_price : null
            return Object.assign({}, transaction, transactionDetails);
        });
        return mappedTransactions;
    }

    const exportTransactionsRecordsToExcel = () => {
        let items = statementItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Tenant Statements Records",
            "Tenant Statements Data",
            items,
            "TenantStatements"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredStatements = getMappedStatements()
            .filter(({ transaction_date }) =>
                !fromDateFilter ? true : transaction_date >= fromDateFilter
            )
            .filter(({ transaction_date }) =>
                !toDateFilter ? true : transaction_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )
            .filter(({ tenantId }) =>
                !contactFilter ? true : tenantId === contactFilter
            )
            .filter(({ assigned_to }) =>
                !assignedToFilter ? true : assigned_to === assignedToFilter
            );
        setStatementItems(filteredStatements);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setStatementItems(getMappedStatements());
        setPropertyFilter("");
        setContactFilter("");
        setAssignedToFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <React.Fragment>
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid
                    container
                    spacing={2}
                    item
                    alignItems="center"
                    direction="row"
                    key={1}
                >
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
                            <Grid
                                container
                                item
                                lg={6} md={12} xs={12}
                                spacing={1}
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
                                <Grid item lg={6} md={12} xs={12}>
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
                                <MenuItem key={index} value={user.id}>
                                    {user.first_name + user.last_name}
                                </MenuItem>
                            ))}
                                    </TextField>
                                </Grid>
                            <Grid item lg={6} md={12} xs={12}>
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
                                    {contact.first_name + ' '+ contact.last_name}
                                </MenuItem>
                            ))}
                                    </TextField>
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
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={statementItems}
                        headCells={headCells}
                        noDetailsCol={true}
                        noEditCol={true}
                        noDeleteCol={true}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};


export default TenantStatementsPage;

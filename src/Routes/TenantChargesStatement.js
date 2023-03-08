import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import CommonTable from "../components/table/commonTable";
import { connect } from "react-redux";
import { commonStyles } from "../components/commonStyles";
import { getTransactionsFilterOptions, currencyFormatter } from "../assets/commonAssets";
import moment from "moment";

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()
const headCells = [
    {
        id: "tenant_name",
        numeric: false,
        disablePadding: true,
        label: "Tenant",
    },
    {
        id: "property_ref",
        numeric: false,
        disablePadding: true,
        label: "Unit Ref/Number",
    },
    {
        id: "transaction_date",
        numeric: false,
        disablePadding: true,
        label: "Transaction Date",
    },
    {
        id: "transaction_date",
        numeric: false,
        disablePadding: true,
        label: "Charge Type",
    },
    {
        id: "property_price",
        numeric: false,
        disablePadding: true,
        label: "Charge Amount",
    },
];

let TenantStatementsPage = ({
    transactions,
    properties,
    contacts,
    users
}) => {
    let [statementItems, setStatementItems] = useState([]);
    let [filteredStatementItems, setFilteredStatementItems] = useState([]);
    let [chargeType, setChargeTypeFilter] = useState("");
    let [periodFilter, setPeriodFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const CHARGE_TYPES = []

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
            const transactionDetails = {}
            transactionDetails.tenant_name = typeof tenant !== 'undefined' ? tenant.first_name + ' ' + tenant.last_name : ''
            transactionDetails.tenantId = typeof tenant !== 'undefined' ? tenant.id : ''
            transactionDetails.landlord_name = typeof landlord !== 'undefined' ? landlord.first_name + ' ' + landlord.last_name : ''
            transactionDetails.property_ref = typeof property !== 'undefined' ? property.ref : null
            transactionDetails.property = typeof property !== 'undefined' ? property.id : null
            transactionDetails.property_price = typeof property !== 'undefined' ? property.price : null
            transactionDetails.security_deposit = typeof transaction !== 'undefined' ? transaction.security_deposit : null
            transactionDetails.water_deposit = typeof transaction !== 'undefined' ? transaction.water_deposit : null
            transactionDetails.transaction_balance = typeof property !== 'undefined' ? property.price - transaction.transaction_price : null
            return Object.assign({}, transaction, transactionDetails);
        });
        setStatementItems(mappedTransactions);
        setFilteredStatementItems(mappedTransactions);
    }, [transactions, contacts, users, properties]);

    const classes = commonStyles();

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
        let startOfPeriod;
        let endOfPeriod;
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

        const filteredStatements = statementItems.filter((chargeItem) => {
            const chargeItemDate = moment(chargeItem.charge_date)
            return chargeItemDate.isSameOrAfter(startOfPeriod) && chargeItemDate.isSameOrBefore(endOfPeriod)
        }).filter(({ charge_type }) =>
            !chargeType ? true : charge_type === chargeType
        )
        setFilteredStatementItems(filteredStatements);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredStatementItems(statementItems);
        setChargeTypeFilter("");
        setPeriodFilter("");
    };

    return (
        <Grid
            container
            spacing={3}
            justify="center" direction="column"
        >
            <Grid item key={2}>
                <Typography variant="h6">Tenant Charges Statement</Typography>
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
                    <ExportToExcelBtn
                        aria-label="Export to Excel"
                        disabled={selected.length <= 0}
                        onClick={(event) => {
                            exportTransactionsRecordsToExcel();
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item>
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
                                                value={charge_type}
                                            >
                                                {charge_type}
                                            </MenuItem>
                                        )
                                    )}
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
            <Grid item>
                <CommonTable
                    selected={selected}
                    setSelected={setSelected}
                    rows={filteredStatementItems}
                    headCells={headCells}
                    noDetailsCol={true}
                    noEditCol={true}
                    noDeleteCol={true}
                />
            </Grid>
        </Grid>
    );
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        properties: state.properties,
        transactions: state.transactions,
        contacts: state.contacts,
        users: state.users,
    };
};

export default connect(mapStateToProps)(TenantStatementsPage);

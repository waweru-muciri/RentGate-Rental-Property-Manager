import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import React, { useState, useEffect } from "react";
import exportDataToXSL from "../assets/printToExcel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import moment from "moment";


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

let PropertyIncomeStatement = ({
    transactions,
    expenses,
    meterReadings,
    properties,
    users,
}) => {
    const classes = commonStyles();
    let [incomeStatements, setIncomeStatements] = useState([]);
    let [headCells, setHeadCells] = useState([]);
    let [expensesStatements, setExpensesStatements] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState("");
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");

    const getIncomeStatementThreeMonthsBack = () => {
        //go back [numMonths] months from current date
		const numberOfMonthsBack = 12;
        const eachPastMonthDate = Array.from(Array(numberOfMonthsBack), (_, i) => i + 1).map((value) => moment().subtract(value, 'months').format('YYYY-MM-DD'))
        setHeadCells(eachPastMonthDate.map((monthDate) => moment(monthDate).format('MMMM YYYY')))
        const incomeMappedByMonth = []
        const expensesMappedByMonth = []
        const totalIncomeObject = { income_type: 'Total Income' }
        const totalExpensesObject = { expense_type: 'Total Expenses' }
        const rentalIncomeObject = { income_type: 'Rental Income' }
        eachPastMonthDate.forEach((monthDate) => {
            //get transactions recorded in the same month and year
            //as monthDate
            const totalRentalIncome = transactions.filter((transaction) => {
                const momentTransactionDate = moment(transaction.transaction_date)
                return momentTransactionDate.isSame(monthDate, 'year') && momentTransactionDate.isSame(monthDate, 'month')
            }).reduce((total, currentTransaction) => total + parseFloat(currentTransaction.transaction_price), 0)
            rentalIncomeObject[moment(monthDate).format('MMMM YYYY')] = totalRentalIncome
        })
        incomeMappedByMonth.push(rentalIncomeObject)
        const utilityIncomeObject = { income_type: 'Utility Income' }
        eachPastMonthDate.forEach((monthDate) => {
            //get utility bills recorded in the same month and year
            //as monthDate
            const totalUtilityIncome = meterReadings.filter((meterReading) => {
                const momentMeterReadingDate = moment(meterReading.reading_date)
                return momentMeterReadingDate.isSame(monthDate, 'year') && momentMeterReadingDate.isSame(monthDate, 'month')
            }).reduce((total, currentMeterReading) => {
                const usage = parseFloat(currentMeterReading.current_value) - parseFloat(currentMeterReading.prior_value)
                return total + ((usage * parseFloat(currentMeterReading.unit_charge)) + parseFloat(currentMeterReading.base_charge))
            }, 0)
            utilityIncomeObject[moment(monthDate).format('MMMM YYYY')] = totalUtilityIncome
        })
        incomeMappedByMonth.push(utilityIncomeObject)
        incomeMappedByMonth.forEach((incomeObject) => {
            headCells.forEach((headCell) => {
                const incomeAmount = parseFloat(incomeObject[headCell]) || 0
                totalIncomeObject[headCell] = (parseFloat(totalIncomeObject[headCell]) || 0 ) + incomeAmount
            })
        })
        incomeMappedByMonth.push(totalIncomeObject)
        const expenseObjectsInMonth = []
        eachPastMonthDate.forEach((monthDate) => {
            //get expenses recorded in the same month and year
            //as monthDate
            expenses.filter((expense) => {
                const momentExpenseDate = moment(expense.expense_date)
                return momentExpenseDate.isSame(monthDate, 'year') && momentExpenseDate.isSame(monthDate, 'month')
            }).forEach((monthExpense) => {
                const { type, amount } = monthExpense
                const expenseObject = {};
                expenseObject['expense_type'] = type
                expenseObject['amount'] = (parseFloat(amount) || 0)
                expenseObject['month'] = moment(monthDate).format('MMMM YYYY')
                expenseObjectsInMonth.push(expenseObject)
            })
        })
        const expensesTypesSet = new Set(expenseObjectsInMonth.map((expenseObject) => expenseObject.expense_type))
            expensesTypesSet.forEach((expenseType) => {
        expenseObjectsInMonth.filter((expenseObject) => expenseObject.expense_type === expenseType).forEach((expenseObject) => {
                    //make or obtain an object and push it to the expenses array
                    const expenseObjectByType = expensesMappedByMonth.find((expense) => expense.expense_type === expenseType)
                    if (typeof expenseObjectByType !== 'undefined') {
                        expenseObjectByType[expenseObject.month] = (parseFloat(expenseObjectByType[expenseObject.month]) || 0) + parseFloat(expenseObject.amount)
                    } else {
                        const totalExpensesByTypeObject = {}
                        totalExpensesByTypeObject['expense_type'] = expenseType
                        totalExpensesByTypeObject[expenseObject.month] = parseFloat(expenseObject.amount
) || 0
					   expensesMappedByMonth.push(totalExpensesByTypeObject)
                    }
            })
        })
        expensesMappedByMonth.forEach((expenseObject) => {
            headCells.forEach((headCell) => {
                const expenseAmount = parseFloat(expenseObject[headCell]) || 0
                totalExpensesObject[headCell] = (parseFloat(totalExpensesObject[headCell]) || 0 ) + expenseAmount
            })
        })
        expensesMappedByMonth.push(totalExpensesObject)
        setIncomeStatements(incomeMappedByMonth);
        setExpensesStatements(expensesMappedByMonth);
    }

    useEffect(() => {
        getIncomeStatementThreeMonthsBack()
    }, [expenses, transactions, meterReadings])

    const exportTransactionsRecordsToExcel = () => {
        exportDataToXSL(
            "Income Statement",
            "Income Statement",
            incomeStatements,
            "Income Statements"
        );
        exportDataToXSL(
            "Expenses Statement",
            "Expenses Statement",
            expensesStatements,
            "Expenses Statement"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredTransactions = incomeStatements
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
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("");
        setAssignedToFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Layout pageTitle="Property Income Statement">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Property Income Statement'} />
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
                                                {user.first_name +
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
                <Grid item sm={12}>
                    <div style={{ width: '100%' }}>
                        <Box display="flex" key={'adadf'} flexDirection="row" p={1} bgcolor="grey.300">
                            <Box key="first1" width={1} textAlign="left" flexGrow={1} p={1} >
                                Income
                            </Box>
                            {
                                headCells.map((headCell, index) =>
                                    <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                        {headCell}
                                    </Box>
                                )
                            }
                        </Box>
                        {
                            incomeStatements.map((incomeStatement, incomeIndex) => {
                                const otherColumns = headCells.map((headCell, index) =>
                                    <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                        Ksh: {incomeStatement[headCell]}
                                    </Box>
                                )
                                return (
                                    <Box display="flex" key={incomeIndex} flexDirection="row" p={1} bgcolor="background.paper">
                                        <Box textAlign="left" width={1} key={incomeIndex + "jl"} flexGrow={1} p={1} >
                                            {incomeStatement['income_type']}
                                        </Box>
                                        {otherColumns}
                                    </Box>
                                )
                            })
                        }
                    </div>
                    <div style={{ width: '100%' }}>
                        <Box display="flex" key={'adlaldadf'} flexDirection="row" p={1} bgcolor="grey.300">
                            <Box key="faldirst1" width={1} textAlign="left" flexGrow={1} p={1} >
                                Expenses
                            </Box>
                            {
                                headCells.map((headCell, index) =>
                                    <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                        {headCell}
                                    </Box>
                                )
                            }
                        </Box>
                        {
                            expensesStatements.map((expenseStatement, incomeIndex) => {
                                const otherColumns = headCells.map((headCell, index) =>
                                    <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                        Ksh: {expenseStatement[headCell] || 0 }
                                    </Box>
                                )
                                return (
                                    <Box display="flex" key={incomeIndex} flexDirection="row" p={1} bgcolor="background.paper">
                                        <Box textAlign="left" width={1} key={incomeIndex + "iiajl"} flexGrow={1} p={1} >
                                            {expenseStatement['expense_type']}
                                        </Box>
                                        {otherColumns}
                                    </Box>
                                )
                            })
                        }
                    </div>
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        transactions: state.transactions,
        meterReadings: state.meterReadings,
        expenses: state.expenses,
        users: state.users,
        currentUser: state.currentUser,
        properties: state.properties,
        error: state.error,
        match: ownProps.match,
    };
};

PropertyIncomeStatement = connect(mapStateToProps)(PropertyIncomeStatement);

export default withRouter(PropertyIncomeStatement);

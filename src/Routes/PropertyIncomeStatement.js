import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { getTransactionsFilterOptions, currencyFormatter } from "../assets/commonAssets";
import { startOfToday, parse, subMonths, subYears, startOfYear, addMonths, getMonth, format, isSameMonth } from 'date-fns'

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()


let PropertyIncomeStatement = ({
    transactions,
    expenses,
    meterReadings,
    properties,
}) => {
    const classes = commonStyles();
    let [expensesItems, setExpensesItems] = useState([]);
    let [paymentItems, setPaymentItems] = useState([]);
    let [meterReadingItems, setMeterReadingItems] = useState([]);
    let [propertiesItems, setPropertiesItems] = useState([]);
    let [incomeStatements, setIncomeStatements] = useState([]);
    let [headCells, setHeadCells] = useState([]);
    let [expensesStatements, setExpensesStatements] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [fromFilter, setFromFilter] = useState(1);

    useEffect(() => {
        //go back [numMonths] months from current date
        let eachPastMonthDate;
        switch (fromFilter) {
            case 'last-month':
                eachPastMonthDate = [subMonths(startOfToday(), 1)]
                break;
            case 'year-to-date':
                eachPastMonthDate = [...Array((getMonth(startOfToday()) + 1)).keys()].map((value) => addMonths(startOfYear(startOfToday()), value))
                break;
            case 'last-year':
                eachPastMonthDate = [...Array(12).keys()].map((value) => addMonths(startOfYear(subYears(startOfToday(), 1)), value))
                break;
            default:
                eachPastMonthDate = [...Array(fromFilter).keys()].reverse().map((value) => subMonths(startOfToday(), value))
                break;
        }
        setHeadCells(eachPastMonthDate.map((monthDate) => format(monthDate, 'MMMM yyyy')))
        const incomeMappedByMonth = []
        const expensesMappedByMonth = []
        const totalIncomeObject = { income_type: 'Total Income' }
        const totalExpensesObject = { expense_type: 'Total Expenses' }
        const rentalIncomeObject = { income_type: 'Rental Income' }
        let totalRentalIncomeForPeriod = 0
        eachPastMonthDate.forEach((monthDate) => {
            //get transactions recorded in the same month and year as monthDate
            const totalRentalIncome = paymentItems.filter((transaction) => {
                const transactionDate = parse(transaction.transaction_date, 'yyyy-MM-dd', new Date())
                return isSameMonth(monthDate, transactionDate)
            }).reduce((total, currentTransaction) => total + parseFloat(currentTransaction.payment_amount), 0)
            totalRentalIncomeForPeriod += totalRentalIncome
            rentalIncomeObject[format(monthDate, 'MMMM yyyy')] = totalRentalIncome
        })
        rentalIncomeObject[headCells[headCells.length - 1]] = totalRentalIncomeForPeriod
        incomeMappedByMonth.push(rentalIncomeObject)
        const utilityIncomeObject = { income_type: 'Utility Income' }
        let totalUtilityIncomeForPeriod = 0
        eachPastMonthDate.forEach((monthDate) => {
            //get utility bills recorded in the same month and year
            //as monthDate
            const totalUtilityIncome = meterReadingItems.filter((meterReading) => {
                const meterReadingDate = parse(meterReading.reading_date, 'yyyy-MM-dd', new Date())
                return isSameMonth(monthDate, meterReadingDate)
            }).reduce((total, currentMeterReading) => {
                const usage = parseFloat(currentMeterReading.current_value) - parseFloat(currentMeterReading.prior_value)
                return total + ((usage * parseFloat(currentMeterReading.unit_charge)) + parseFloat(currentMeterReading.base_charge))
            }, 0)
            totalUtilityIncomeForPeriod += totalUtilityIncome
            utilityIncomeObject[format(monthDate, 'MMMM yyyy')] = totalUtilityIncome
        })
        utilityIncomeObject[headCells[headCells.length - 1]] = totalUtilityIncomeForPeriod
        incomeMappedByMonth.push(utilityIncomeObject)
        incomeMappedByMonth.forEach((incomeObject) => {
            headCells.forEach((headCell) => {
                const incomeAmount = parseFloat(incomeObject[headCell]) || 0
                totalIncomeObject[headCell] = (parseFloat(totalIncomeObject[headCell]) || 0) + incomeAmount
            })
        })
        incomeMappedByMonth.push(totalIncomeObject)
        const expenseObjectsInMonth = []
        eachPastMonthDate.forEach((monthDate) => {
            //get expenses recorded in the same month and year
            //as monthDate
            expensesItems.filter((expense) => {
                const expenseDate = parse(expense.expense_date, 'yyyy-MM-dd', new Date())
                return isSameMonth(monthDate, expenseDate)
            }).forEach((monthExpense) => {
                const { type, amount } = monthExpense
                const expenseObject = {};
                expenseObject['expense_type'] = type
                expenseObject['amount'] = (parseFloat(amount) || 0)
                expenseObject['month'] = format(monthDate, 'MMMM yyyy')
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
                    expenseObjectByType[headCells[headCells.length - 1]] = (parseFloat(expenseObjectByType[headCells[headCells.length - 1]]) || 0) + parseFloat(expenseObject.amount)
                } else {
                    const totalExpensesByTypeObject = {}
                    totalExpensesByTypeObject['expense_type'] = expenseType
                    totalExpensesByTypeObject[expenseObject.month] = parseFloat(expenseObject.amount) || 0
                    totalExpensesByTypeObject[headCells[headCells.length - 1]] = parseFloat(expenseObject.amount) || 0
                    expensesMappedByMonth.push(totalExpensesByTypeObject)
                }
            })
        })
        expensesMappedByMonth.forEach((expenseObject) => {
            headCells.forEach((headCell) => {
                const expenseAmount = parseFloat(expenseObject[headCell]) || 0
                totalExpensesObject[headCell] = (parseFloat(totalExpensesObject[headCell]) || 0) + expenseAmount
            })
        })
        expensesMappedByMonth.push(totalExpensesObject)
        setIncomeStatements(incomeMappedByMonth);
        setExpensesStatements(expensesMappedByMonth);
    }, [expensesItems, paymentItems, meterReadingItems])

    useEffect(() => {
        setExpensesItems(expenses)
    }, [expenses])

    useEffect(() => {
        setPropertiesItems(properties)
    }, [properties])

    useEffect(() => {
        setMeterReadingItems(meterReadings)
    }, [meterReadings])

    useEffect(() => {
        setPaymentItems(transactions)
    }, [transactions])

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactions according to the search criteria here
        let filteredTransactions = paymentItems
            .filter((transaction_item) =>
                !propertyFilter ? true : transaction_item.property === propertyFilter)
        setPaymentItems(filteredTransactions)
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("");
        setFromFilter(1);
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
                            reportName={'Income Statements Records'}
                            reportTitle={'Income Statements Records'}
                            headCells={headCells}
                            dataToPrint={incomeStatements}
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
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="property_filter"
                                        label="Select Property"
                                        id="property_filter"
                                        value={propertyFilter}
                                        onChange={(event) => {
                                            setPropertyFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {propertiesItems.map((property, index) => (
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
                                        id="from_filter"
                                        name="from_filter"
                                        label="Period"
                                        value={fromFilter}
                                        onChange={(event) => {
                                            setFromFilter(
                                                event.target.value
                                            );
                                        }}
                                        InputLabelProps={{ shrink: true }}>
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
                                        {headCell} (Ksh)
                                    </Box>
                                )
                            }
                        </Box>
                        {
                            incomeStatements.map((incomeStatement, incomeIndex) => {
                                const otherColumns = headCells.map((headCell, index) =>
                                    <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                        {currencyFormatter.format(incomeStatement[headCell])}
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
                                        {currencyFormatter.format(expenseStatement[headCell] || 0)}
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
        currentUser: state.currentUser,
        properties: state.properties,
        error: state.error,
        match: ownProps.match,
    };
};

PropertyIncomeStatement = connect(mapStateToProps)(PropertyIncomeStatement);

export default withRouter(PropertyIncomeStatement);

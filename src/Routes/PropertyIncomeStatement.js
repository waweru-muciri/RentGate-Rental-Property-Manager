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
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { getTransactionsFilterOptions, getExpensesCategories, currencyFormatter, getMonthlyDatesFromPeriod } from "../assets/commonAssets";
import { parse, format, isSameMonth } from 'date-fns'
import { ExportStatementToExcelBtn } from "../components/ExportToExcelBtn";
import InfoDisplayPaper from "../components/InfoDisplayPaper";

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()
const EXPENSES_CATEGORIES = getExpensesCategories()


let PropertyIncomeStatement = ({
    rentalPayments,
    expenses,
    leases,
    properties,
}) => {
    const classes = commonStyles();
    const [expensesItems, setExpensesItems] = useState([]);
    const [leaseItems, setLeaseItems] = useState([]);
    const [paymentItems, setPaymentItems] = useState([]);
    const [netIncomeObject, setNetIncomeObject] = useState({});
    const [incomeStatements, setIncomeStatements] = useState([]);
    const [headCells, setHeadCells] = useState([]);
    const [expensesStatements, setExpensesStatements] = useState([]);
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [fromFilter, setFromFilter] = useState('month-to-date');

    useEffect(() => {
        //go back [numMonths] months from current date
        const eachPastMonthDate = getMonthlyDatesFromPeriod(fromFilter);
        const headCellsForMonths = [...eachPastMonthDate.map((monthDate) => format(monthDate, 'MMMM yyyy')), `Total as of ${format(eachPastMonthDate[eachPastMonthDate.length - 1], 'MMMM yyyy')}`]
        // calculate income from rent
        const incomeMappedByMonth = []
        const rentalIncomeObject = { income_type: 'Rental Income' }
        const totalIncomeObject = { income_type: 'Total Income' }
        const totalNetIncomeObject = { income_type: 'Net Income' }
        let totalRentalIncomeForPeriod = 0
        eachPastMonthDate.forEach((monthDate) => {
            //get rentalPayments recorded in the same month and year as monthDate
            const totalRentalIncomeForMonth = paymentItems.filter(({ payment_type }) => payment_type === 'rent')
                .filter((payment) => {
                    const paymentDate = parse(payment.payment_date, 'yyyy-MM-dd', new Date())
                    return isSameMonth(monthDate, paymentDate)
                }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payment_amount) || 0), 0)
            totalRentalIncomeForPeriod += totalRentalIncomeForMonth
            rentalIncomeObject[format(monthDate, 'MMMM yyyy')] = totalRentalIncomeForMonth
        })
        rentalIncomeObject[headCellsForMonths[headCellsForMonths.length - 1]] = totalRentalIncomeForPeriod
        incomeMappedByMonth.push(rentalIncomeObject)
        // calculate income from other sources
        const otherIncomeObject = { income_type: 'Other Income' }
        let totalOtherIncomeForPeriod = 0
        eachPastMonthDate.forEach((monthDate) => {
            //get rentalPayments recorded in the same month and year as monthDate
            const totalOtherIncome = paymentItems.filter(({ payment_type }) => payment_type !== 'rent')
                .filter((payment) => {
                    const paymentDate = parse(payment.payment_date, 'yyyy-MM-dd', new Date())
                    return isSameMonth(monthDate, paymentDate)
                }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payment_amount) || 0), 0)
            totalOtherIncomeForPeriod += totalOtherIncome
            otherIncomeObject[format(monthDate, 'MMMM yyyy')] = totalOtherIncome
        })
        otherIncomeObject[headCellsForMonths[headCellsForMonths.length - 1]] = totalOtherIncomeForPeriod
        incomeMappedByMonth.push(otherIncomeObject)
        // get total of all incomes
        incomeMappedByMonth.forEach((incomeObject) => {
            headCellsForMonths.forEach((headCell) => {
                const incomeAmount = parseFloat(incomeObject[headCell]) || 0
                totalIncomeObject[headCell] = (parseFloat(totalIncomeObject[headCell]) || 0) + incomeAmount
            })
        })
        incomeMappedByMonth.push(totalIncomeObject)
        //calucate expenses
        const expensesMappedByMonth = []
        const totalExpensesObject = { expense_type: 'Total Expenses', expense_name: "Total Expenses" }
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
                    expenseObjectByType[headCellsForMonths[headCellsForMonths.length - 1]] = (parseFloat(expenseObjectByType[headCellsForMonths[headCellsForMonths.length - 1]]) || 0) + parseFloat(expenseObject.amount)
                } else {
                    const totalExpensesByTypeObject = {}
                    totalExpensesByTypeObject['expense_type'] = expenseType
                    const EXPENSE_IN_FULL_DETAILS = EXPENSES_CATEGORIES.find(({ id }) => id === expenseType) || {}
                    totalExpensesByTypeObject['expense_name'] = EXPENSE_IN_FULL_DETAILS.displayValue
                    totalExpensesByTypeObject[expenseObject.month] = parseFloat(expenseObject.amount) || 0
                    totalExpensesByTypeObject[headCellsForMonths[headCellsForMonths.length - 1]] = parseFloat(expenseObject.amount) || 0
                    expensesMappedByMonth.push(totalExpensesByTypeObject)
                }
            })
        })
        expensesMappedByMonth.forEach((expenseObject) => {
            headCellsForMonths.forEach((headCell) => {
                const expenseAmount = parseFloat(expenseObject[headCell]) || 0
                totalExpensesObject[headCell] = (parseFloat(totalExpensesObject[headCell]) || 0) + expenseAmount
            })
        })
        expensesMappedByMonth.push(totalExpensesObject)
        // get net income
        headCellsForMonths.forEach((headCell) => {
            totalNetIncomeObject[headCell] = (parseFloat(totalIncomeObject[headCell]) || 0) - (parseFloat(totalExpensesObject[headCell]) || 0)
        })
        setHeadCells(headCellsForMonths)
        setNetIncomeObject(totalNetIncomeObject);
        setIncomeStatements(incomeMappedByMonth);
        setExpensesStatements(expensesMappedByMonth);
    }, [expensesItems, paymentItems])

    useEffect(() => {
        setExpensesItems(expenses)
    }, [expenses])

    useEffect(() => {
        setPaymentItems(rentalPayments)
    }, [rentalPayments])

    useEffect(() => {
        setLeaseItems(leases)
    }, [leases])

    //for each lease item calculate the amount of the above liabilities
    const TOTAL_SECURITY_DEPOSIT_LIABILITY = leaseItems
        .reduce((total, currentValue) => total + (parseFloat(currentValue.security_deposit) || 0), 0);
    const TOTAL_WATER_DEPOSIT_LIABILITY = leaseItems
        .reduce((total, currentValue) => total + (parseFloat(currentValue.water_deposit) || 0), 0);
    const TOTAL_ELECTRICITY_DEPOSIT_LIABILITY = leaseItems
        .reduce((total, currentValue) => total + (parseFloat(currentValue.electricity_deposit) || 0), 0);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the rentalPayments according to the search criteria here
        const filteredTransactions = rentalPayments
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        const filteredExpenses = expenses
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        const filteredLeases = leases
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        setPaymentItems(filteredTransactions)
        setLeaseItems(filteredLeases)
        setExpensesItems(filteredExpenses)
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("all");
        setFromFilter("month-to-date");
        setExpensesItems(expenses)
        setPaymentItems(rentalPayments)
        setLeaseItems(leases)
    };

    return (
        <Layout pageTitle="Properties Income Statement">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading text={'Properties Income Statement'} />
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
                        <ExportStatementToExcelBtn
                            displayText={"Export Income"}
                            reportName={'Properties Income Records'}
                            reportTitle={'Properties Income Records'}
                            headCells={headCells}
                            dataToPrint={incomeStatements}
                        />
                    </Grid>
                    <Grid item>
                        <ExportStatementToExcelBtn
                            displayText={"Export Expenses"}
                            reportName={"Properties Expenses  Records"}
                            reportTitle={"Properties Expenses Data"}
                            headCells={headCells}
                            dataToPrint={expensesStatements}
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
                                        <MenuItem key={"all"} value={"all"}>All</MenuItem>
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
                <Grid item container sm={12} spacing={2}>
                    <Grid item container direction="row" spacing={2}>
                        <InfoDisplayPaper value={TOTAL_SECURITY_DEPOSIT_LIABILITY} title="Total Security Deposit Liability" />
                        <InfoDisplayPaper value={TOTAL_WATER_DEPOSIT_LIABILITY} title="Total Water Deposit Liability" />
                        <InfoDisplayPaper value={TOTAL_ELECTRICITY_DEPOSIT_LIABILITY} title="Total Electricity Deposit Liability" />
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
                                                {expenseStatement['expense_name']}
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
                                    Net Income
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
                                <Box display="flex" key={'kjb'} flexDirection="row" p={1} bgcolor="background.paper">
                                    <Box textAlign="left" width={1} key={"iiajl"} flexGrow={1} p={1} >
                                        Net Income
                                    </Box>
                                    {headCells.map((headCell, index) =>
                                        <Box key={index} width={1} textAlign="left" flexGrow={1} p={1} >
                                            {currencyFormatter.format(netIncomeObject[headCell] || 0)}
                                        </Box>
                                    )
                                    }
                                </Box>

                            }
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};


const mapStateToProps = (state, ownProps) => {
    return {
        rentalPayments: state.rentalPayments,
        expenses: state.expenses,
        properties: state.properties,
        leases: state.leases,
    };
};

PropertyIncomeStatement = connect(mapStateToProps)(PropertyIncomeStatement);

export default withRouter(PropertyIncomeStatement);

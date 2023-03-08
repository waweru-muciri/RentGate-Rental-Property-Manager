import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { Bar, HorizontalBar } from 'react-chartjs-2';
import { commonStyles } from '../components/commonStyles'
import { getMonthsInYear, currencyFormatter } from "../assets/commonAssets";
import * as Yup from "yup";
import { Formik } from "formik";
import { format, getYear, parse, getMonth } from "date-fns";

const options = {
    responsive: true,
    tooltips: {
        mode: 'label'
    },
    elements: {
        line: {
            fill: false
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    min: 0,
                }
            }
        ],
        xAxes: [
            {
                ticks: {
                    min: 0,
                }
            }
        ]
    }
};

const FilterYearSchema = Yup.object().shape({
    filter_year: Yup.number()
        .typeError("Year must be a number!")
        .required("Year is required")
        .positive()
        .min(0, "Must be greater than 0")
        .max(2100, "Sorry but we won't be here during those times.")
        .integer(),
});

const monthsInYear = getMonthsInYear()

let PropertyPerformancePage = ({ transactionsCharges, expenses, properties }) => {
    const classes = commonStyles()
    let [propertyFilter, setPropertyFilter] = useState("all");
    const [chargesItems, setChargesItems] = useState([]);
    const [expensesItems, setExpensesItems] = useState(expenses);

    useEffect(() => {
        setChargesItems(transactionsCharges
            .filter(({ charge_date }) => getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === getYear(new Date()))
        );
    }, [transactionsCharges]);

    useEffect(() => {
        setExpensesItems(expenses
            .filter(({ expense_date }) => getYear(parse(expense_date, 'yyyy-MM-dd', new Date())) === getYear(new Date()))
        );
    }, [expenses]);

    const setFilteredTransactionItemsByYear = (filterYear) => {
        setChargesItems(
            transactionsCharges
                .filter(({ charge_date }) => getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === filterYear)
                .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        );
        setExpensesItems(
            expenses
                .filter(({ expense_date }) => getYear(parse(expense_date, 'yyyy-MM-dd', new Date())) === filterYear)
                .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        );
    };
    //get the different charges types as a set
    const paymentsTypes = [...new Set(chargesItems.filter(chargeItem => chargeItem.payed_status)
        .map(charge => charge.charge_type))]
    //get totals payments for each payment type
    const paymentTotalsForPaymentType = paymentsTypes.map(paymentType => {
        return chargesItems.filter(charge => charge.charge_type === paymentType && charge.payed_status)
            .reduce((total, currentValue) => {
                return total + parseFloat(currentValue.payed_amount) || 0
            }, 0)
    })

    const paymentsTypesForDisplay = paymentsTypes.map(paymentType => {
        let result;
        switch (paymentType) {
            case 'security_deposit':
                result = "Security Deposit"
                break;
            case 'rent':
                result = "Rent"
                break;
            case 'recurring_charge':
                result = "Recurring Charges"
                break;
            case 'one_time_charge':
                result = "Recurring Charges"
                break;
            default:
                result = "Others"
                break;
        }
        return result;
    })

    //get the total values of the various charges and payments 
    const totalRentCharges = chargesItems.filter(charge => charge.charge_type === 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalOtherCharges = chargesItems.filter(charge => charge.charge_type !== 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalRentPayments = chargesItems.filter(payment => payment.charge_type === 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const totalOtherChargesPayments = chargesItems.filter(payment => payment.charge_type !== 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)
    const totalRentChargesBalances = totalRentCharges - totalRentPayments
    const totalOtherChargesBalances = totalOtherCharges - totalOtherChargesPayments
    //get months in an year in short format
    const monthsOfYearLabels = monthsInYear.map((monthDate) => format(monthDate, 'MMMM'));
    //get charges and payments graph data from previous values
    const chargesAndPaymentsGraphData = {
        labels: monthsOfYearLabels,
        datasets: []
    }

    //get income categories graph data from previous values
    const incomeCategoriesGraphData = {
        labels: paymentsTypesForDisplay,
        datasets: [
            {
                label: 'Income Categories',
                backgroundColor: 'rgba(130, 224, 170,0.6)',
                borderColor: 'rgba(130, 224, 170,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(130, 224, 170,1)',
                hoverBorderColor: 'rgba(130, 224, 170,1)',
                data: paymentTotalsForPaymentType
            }
        ]
    }
    const totalEachMonthPayments = monthsInYear.map((monthDate) => {
        //get transactions recorded in the same month and year as monthDate
        return chargesItems
            .filter((charge) => {
                const chargeDate = parse(charge.charge_date, 'yyyy-MM-dd', new Date())
                return getMonth(monthDate) === getMonth(chargeDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payed_amount) || 0), 0)
    })
    const totalEachMonthExpenses = monthsInYear.map((monthDate) => {
        //get transactions recorded in the same month and year as monthDate
        return expensesItems
            .filter((expense) => {
                const expenseDate = parse(expense.expense_date, 'yyyy-MM-dd', new Date())
                return getMonth(monthDate) === getMonth(expenseDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.amount) || 0), 0)
    })

    const totalEachMonthCharges = monthsInYear.map((monthDate) => {
        //get transactions recorded in the same month and year as monthDate
        return chargesItems
            .filter((charge) => {
                const chargeDate = parse(charge.charge_date, 'yyyy-MM-dd', new Date())
                return getMonth(monthDate) === getMonth(chargeDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.charge_amount) || 0), 0)
    })

    //get expenses categories graph data from previous values
    const expensesCategoriesGraphData = {
        labels: monthsOfYearLabels,
        datasets: [
            {
                label: 'Expenses',
                backgroundColor: "rgba(174, 182, 191,0.6)",
                borderColor: 'rgba(174, 182, 191,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(174, 182, 191, 1)',
                hoverBorderColor: 'rgba(174, 182, 191,1)',
                data: totalEachMonthExpenses
            }
        ]
    }

    chargesAndPaymentsGraphData.datasets.push({
        data: totalEachMonthPayments,
        label: 'Monthly Payments Collection', type: 'bar',
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
    })

    chargesAndPaymentsGraphData.datasets.push({
        data: totalEachMonthCharges,
        label: 'Monthly Charges', type: 'line', borderColor: '#EC932F', fill: false,
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
    })

    return (
        <Layout pageTitle="Property Performance">
            <Grid container justify="center" direction="column" spacing={4}>
                <Grid item key={0}>
                    <PageHeading text={"Property Performance"} />
                </Grid>
                <Grid container item direction="column" spacing={2}>
                    <Grid item>
                        <Box
                            border={1}
                            borderRadius="borderRadius"
                            borderColor="grey.400"
                        >
                            <Formik
                                initialValues={{ filter_year: getYear(new Date()) }}
                                validationSchema={FilterYearSchema}
                                onSubmit={(values) => {
                                    setFilteredTransactionItemsByYear(parseInt(values.filter_year));
                                }}
                            >
                                {({
                                    values,
                                    handleSubmit,
                                    touched,
                                    errors,
                                    handleChange,
                                    handleBlur,
                                }) => (
                                    <form
                                        className={classes.form}
                                        id="yearFilterForm"
                                        onSubmit={handleSubmit}
                                    >
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            justify="center"
                                            direction="row"
                                        >
                                            <Grid item sm={3}>
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
                                                    <MenuItem key={"all"} value={"all"}>All Properties</MenuItem>
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
                                            <Grid item>
                                                <TextField
                                                    variant="outlined"
                                                    id="filter_year"
                                                    name="filter_year"
                                                    label="Year"
                                                    value={values.filter_year}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.filter_year && touched.filter_year}
                                                    helperText={
                                                        touched.filter_year && errors.filter_year
                                                    }
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    form="yearFilterForm"
                                                    color="primary"
                                                    variant="contained"
                                                    size="medium"
                                                    startIcon={<SearchIcon />}
                                                >
                                                    SEARCH
                            </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    spacing={2}
                    direction="row"
                    alignItems="stretch"
                    justify="space-around"
                    key={3}
                >
                    <InfoDisplayPaper xs={12} title={"Total Rent Charges"} value={currencyFormatter.format(totalRentCharges)} />
                    <InfoDisplayPaper xs={12} title={"Total Rent Payments"} value={currencyFormatter.format(totalRentPayments)} />
                    <InfoDisplayPaper xs={12} title={"Total Rent Outstanding Balances"} value={currencyFormatter.format(totalRentChargesBalances)} />
                </Grid>
                <Grid
                    item
                    container
                    spacing={2}
                    direction="row"
                    alignItems="stretch"
                    justify="space-around"
                >
                    <InfoDisplayPaper xs={12} title={"Total Other Charges"} value={currencyFormatter.format(totalOtherCharges)} />
                    <InfoDisplayPaper xs={12} title={"Total Other Payments"} value={currencyFormatter.format(totalOtherChargesPayments)} />
                    <InfoDisplayPaper xs={12} title={"Total Other Charges Outstanding Balances"} value={currencyFormatter.format(totalOtherChargesBalances)} />
                </Grid>
                <Grid item>
                    <Typography variant="h6" align="center" gutterBottom>
                        Monthly Charges &amp; Payments
                    </Typography>
                    <Bar
                        data={chargesAndPaymentsGraphData}
                        options={options}>
                    </Bar>
                </Grid>
                <Grid item container direction="row" spacing={4}>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Income Categories
                    </Typography>
                        <HorizontalBar
                            height={250}
                            data={incomeCategoriesGraphData}
                            options={options}>
                        </HorizontalBar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Expenses
                    </Typography>
                        <HorizontalBar
                            height={250}
                            data={expensesCategoriesGraphData}
                            options={options}>
                        </HorizontalBar>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        transactionsCharges: state.transactionsCharges.map((charge) => {
            const chargeDetails = {}
            //get payments with this charge id
            const chargePayments = state.transactions.filter((payment) => payment.charge_id === charge.id)
            chargeDetails.payed_status = chargePayments.length ? true : false;
            const payed_amount = chargePayments.reduce((total, currentValue) => {
                return total + parseFloat(currentValue.payment_amount) || 0
            }, 0)
            chargeDetails.payed_amount = payed_amount
            chargeDetails.balance = parseFloat(charge.charge_amount) - payed_amount
            return Object.assign({}, charge, chargeDetails);
        }),
        expenses: state.expenses,
    };
};

export default connect(mapStateToProps)(PropertyPerformancePage);

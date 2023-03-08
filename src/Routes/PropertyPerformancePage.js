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
import * as Yup from "yup";
import { Formik } from "formik";
import { format, getYear, parse, isWithinInterval, addDays, isSameDay } from "date-fns";
import { getMonthsInYear, currencyFormatter } from "../assets/commonAssets";
import isSameMonth from "date-fns/isSameMonth";


const chargesPerformanceGraphsOptions = {
    responsive: true,
    tooltips: {
        mode: 'label'
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    min: 0,
                    max: 100,
                }
            }
        ]
    }
};

const graphOptions = {
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
        .positive("Year must be greater than 0")
        .max(2100, "Sorry but we won't be here during those times.")
        .integer(),
});

const monthsInYear = getMonthsInYear()

let PropertyPerformancePage = ({ rentalCharges, expenses, properties }) => {
    const classes = commonStyles()
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [chargesItems, setChargesItems] = useState([]);
    const [expensesItems, setExpensesItems] = useState(expenses);

    useEffect(() => {
        //get only rent charges for display in bar graph
        setChargesItems(rentalCharges
            .filter(({ charge_date }) =>
                getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === getYear(new Date())
            )
        );
    }, [rentalCharges]);

    useEffect(() => {
        setExpensesItems(expenses
            .filter(({ expense_date }) => getYear(parse(expense_date, 'yyyy-MM-dd', new Date())) === getYear(new Date()))
        );
    }, [expenses]);

    const setFilteredTransactionItemsByYear = (filterYear) => {
        setChargesItems(
            rentalCharges
                .filter(({ charge_date, property_id }) =>
                    (getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === filterYear)
                    && (propertyFilter === "all" ? true : property_id === propertyFilter)
                )
        );
        setExpensesItems(
            expenses
                .filter(({ expense_date, property_id }) =>
                    (getYear(parse(expense_date, 'yyyy-MM-dd', new Date())) === filterYear)
                    && (propertyFilter === "all" ? true : property_id === propertyFilter)
                )
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
        switch (paymentType.toLowerCase()) {
            case 'security_deposit':
                result = "Security Deposit"
                break;
            case 'rent':
                result = "Rent"
                break;
            case 'water':
                result = "Water"
                break;
            case 'electric':
                result = "Electricity"
                break;
            case 'recurring_charge':
                result = "Recurring Charges"
                break;
            case 'meter_type' || "meter":
                result = "Utility Charge"
                break;
            case 'one_time_charge':
                result = "One Time Charge"
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

    //get total security deposit charges 
    const totalSecurityDepositCharges = chargesItems.filter(charge => charge.charge_type === 'security_deposit')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalOtherCharges = chargesItems.filter(charge => charge.charge_type !== 'rent' && charge.charge_type !== 'security_deposit')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalRentPayments = chargesItems.filter(payment => payment.charge_type === 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    //get total security deposit payments
    const totalSecurityDepositPayments = chargesItems.filter(payment => payment.charge_type === 'security_deposit')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const totalOtherChargesPayments = chargesItems.filter(payment => payment.charge_type !== 'rent' && payment.charge_type !== 'security_deposit')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const totalRentChargesBalances = totalRentCharges - totalRentPayments
    const totalSecurityDepositChargesBalances = totalSecurityDepositCharges - totalSecurityDepositPayments
    const totalOtherChargesBalances = totalOtherCharges - totalOtherChargesPayments
    //get months in an year in short format
    const monthsOfYearLabels = monthsInYear.map((monthDate) => format(monthDate, 'MMMM'));

    //GET INCOME CATEGORIES GRAPH DATA FROM PREVIOUS VALUES
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
    //get ONLY RENT charges for each month of the year
    const totalEachMonthRentCharges = monthsInYear.map((monthDate) => {
        //get rentalPayments recorded in the same month and year as monthDate
        return chargesItems
            .filter(({ charge_date, charge_type }) => {
                const chargeDate = parse(charge_date, 'yyyy-MM-dd', new Date())
                return (charge_type === 'rent') && isSameMonth(monthDate, chargeDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.charge_amount) || 0), 0)
    })
    //get ONLY RENT payments for each month of the year
    const totalEachMonthRentPayments = monthsInYear.map((monthDate) => {
        //get rentalPayments recorded in the same month and year as monthDate
        return chargesItems
            .filter(({ charge_date, charge_type }) => {
                const chargeDate = parse(charge_date, 'yyyy-MM-dd', new Date())
                return (charge_type === 'rent') && isSameMonth(monthDate, chargeDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payed_amount) || 0), 0)
    })
    const totalEachMonthExpenses = monthsInYear.map((monthDate) => {
        //get rentalPayments recorded in the same month and year as monthDate
        return expensesItems
            .filter((expense) => {
                const expenseDate = parse(expense.expense_date, 'yyyy-MM-dd', new Date())
                return isSameMonth(monthDate, expenseDate)
            }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.amount) || 0), 0)
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

    //get charges and payments graph data from previous values
    const chargesAndPaymentsGraphData = {
        labels: monthsOfYearLabels,
        datasets: [
            {
                data: totalEachMonthRentCharges,
                label: 'Monthly Rent Charges', type: 'line', borderColor: '#EC932F', fill: false,
                backgroundColor: '#EC932F',
                pointBorderColor: '#EC932F',
                pointBackgroundColor: '#EC932F',
                pointHoverBackgroundColor: '#EC932F',
                pointHoverBorderColor: '#EC932F',
            },
            {
                data: totalEachMonthRentPayments,
                label: 'Monthly Rent Payments Collection', type: 'bar',
                fill: false,
                backgroundColor: '#71B37C',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
            },
        ]
    }

    const rentChargesPaymentsPeformanceData = {
        due_date: 0,
        next_thirty: 0,
        next_sixty: 0,
        next_ninety: 0,
        next_three_months: 0,
    }
    const otherChargesPaymentsPeformanceData = {
        due_date: 0,
        next_thirty: 0,
        next_sixty: 0,
        next_ninety: 0,
        next_three_months: 0,
    }

    chargesItems.filter(({ charge_type, payed_status }) => charge_type === "rent" && payed_status)
        .forEach(rentCharge => {
            const rentChargeLastPaymentDate = parse(rentCharge.last_payment_date, 'yyyy-MM-dd', new Date())
            const rentChargeDueDate = parse(rentCharge.due_date, 'yyyy-MM-dd', new Date())
            const endOfNextThirtyDays = addDays(rentChargeDueDate, 30);
            const endOfNextSixtyDays = addDays(rentChargeDueDate, 60);
            const endOfNextNinetyDays = addDays(rentChargeDueDate, 90);
            const endOfNextThreeMonths = new Date(2100, 0, 1);
            //check if payment was made on the due date
            if (isSameDay(rentChargeLastPaymentDate, rentChargeDueDate)) {
                rentChargesPaymentsPeformanceData['due_date'] += 1
            }
            //check if payment was made within 7 days
            else if (isWithinInterval(rentChargeLastPaymentDate, { start: rentChargeDueDate, end: endOfNextThirtyDays })) {
                rentChargesPaymentsPeformanceData['next_thirty'] += 1
            }
            //check if payment was made within 14 days
            else if (isWithinInterval(rentChargeLastPaymentDate, { start: endOfNextThirtyDays, end: endOfNextSixtyDays })) {
                rentChargesPaymentsPeformanceData['next_sixty'] += 1
            }
            //check if payment was made within 30 days
            else if (isWithinInterval(rentChargeLastPaymentDate, { start: endOfNextSixtyDays, end: endOfNextNinetyDays })) {
                rentChargesPaymentsPeformanceData['next_ninety'] += 1
            }
            //check if payment was made within 120+ days
            else if (isWithinInterval(rentChargeLastPaymentDate, { start: endOfNextNinetyDays, end: endOfNextThreeMonths })) {
                rentChargesPaymentsPeformanceData['next_three_months'] += 1
            }
        })
    chargesItems.filter(({ charge_type, payed_status }) => charge_type !== "rent" && payed_status)
        .forEach(otherCharge => {
            const otherChargeLastPaymentDate = parse(otherCharge.last_payment_date, 'yyyy-MM-dd', new Date())
            const otherChargeDueDate = parse(otherCharge.due_date, 'yyyy-MM-dd', new Date())
            const endOfNextThirtyDays = addDays(otherChargeDueDate, 30);
            const endOfNextSixtyDays = addDays(otherChargeDueDate, 60);
            const endOfNextNinetyDays = addDays(otherChargeDueDate, 90);
            const endOfNextThreeMonths = new Date(2100, 0, 1);
            //check if payment was made on the due date
            if (otherChargeLastPaymentDate === otherChargeDueDate) {
                otherChargesPaymentsPeformanceData['due_date'] += 1
            }
            //check if payment was made within 7 days
            else if (isWithinInterval(otherChargeLastPaymentDate, { start: otherChargeDueDate, end: endOfNextThirtyDays })) {
                otherChargesPaymentsPeformanceData['next_thirty'] += 1
            }
            //check if payment was made within 14 days
            else if (isWithinInterval(otherChargeLastPaymentDate, { start: endOfNextThirtyDays, end: endOfNextSixtyDays })) {
                otherChargesPaymentsPeformanceData['next_sixty'] += 1
            }
            //check if payment was made within 30 days
            else if (isWithinInterval(otherChargeLastPaymentDate, { start: endOfNextSixtyDays, end: endOfNextNinetyDays })) {
                otherChargesPaymentsPeformanceData['next_ninety'] += 1
            }
            //check if payment was made within 120+ days
            else if (isWithinInterval(otherChargeLastPaymentDate, { start: endOfNextNinetyDays, end: endOfNextThreeMonths })) {
                otherChargesPaymentsPeformanceData['next_three_months'] += 1
            }
        })

    const getPeriodDisplayValue = (objectKeys) => {
        return Array.from(objectKeys).map(key => {
            let displayName;
            switch (key) {
                case "due_date":
                    displayName = "Due Date"
                    break;
                case "next_thirty":
                    displayName = "Due Date + 30 days"
                    break;
                case "next_sixty":
                    displayName = "Due Date + 60 days"
                    break;
                case "next_ninety":
                    displayName = "Due Date + 90 days"
                    break;
                case "next_three_months":
                    displayName = "Due Date + 120 days"
                    break;
                default:
                    break;
            }
            return displayName;
        })
    }

    const getPerformanceDataFromObject = (performanceObject) => {
        const totalPerformanceDataPoints = Object.values(performanceObject)
            .reduce((total, dataPoint) => total + dataPoint, 0)
        return Object.values(performanceObject)
            .map(performanceDataPoint => (performanceDataPoint / totalPerformanceDataPoints) * 100)
    }

    //get charges payments performance graph data
    const rentCollectionPerformanceData = {
        labels: getPeriodDisplayValue(Object.keys(rentChargesPaymentsPeformanceData)),
        datasets: [
            {
                label: 'Rent',
                backgroundColor: "rgba(174, 184, 191,0.6)",
                borderColor: 'rgba(174, 184, 191,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(174, 184, 191, 1)',
                hoverBorderColor: 'rgba(174, 184, 191,1)',
                data: getPerformanceDataFromObject(rentChargesPaymentsPeformanceData)
            }
        ]
    }

    //get charges payments performance graph data
    const otherChargesCollectionPerformanceData = {
        labels: getPeriodDisplayValue(Object.keys(otherChargesPaymentsPeformanceData)),
        datasets: [
            {
                label: 'Service Charges',
                backgroundColor: "rgba(174, 182, 191,0.6)",
                borderColor: 'rgba(174, 182, 191,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(174, 182, 191, 1)',
                hoverBorderColor: 'rgba(174, 182, 191,1)',
                data: getPerformanceDataFromObject(otherChargesPaymentsPeformanceData)
            }
        ]
    }

    return (
        <Layout pageTitle="Property Performance">
            <Grid container justify="center" direction="column" spacing={4}>
                <Grid item key={0}>
                    <PageHeading text="Property Performance" />
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
                                                    <MenuItem key={"all"} value={"all"}>All</MenuItem>
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
                    <InfoDisplayPaper xs={12} title={"Total Rent Balances"} value={currencyFormatter.format(totalRentChargesBalances)} />
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
                    <InfoDisplayPaper xs={12} title={"Total Security Deposit Charges"} value={currencyFormatter.format(totalSecurityDepositCharges)} />
                    <InfoDisplayPaper xs={12} title={"Total Security Deposit Payments"} value={currencyFormatter.format(totalSecurityDepositPayments)} />
                    <InfoDisplayPaper xs={12} title={"Total Security Deposit Balances"} value={currencyFormatter.format(totalSecurityDepositChargesBalances)} />
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
                    <InfoDisplayPaper xs={12} title={"Total Other Charges Balances"} value={currencyFormatter.format(totalOtherChargesBalances)} />
                </Grid>
                <Grid item>
                    <Typography variant="h6" align="center" gutterBottom>
                        Monthly Charges &amp; Payments
                    </Typography>
                    <Bar
                        data={chargesAndPaymentsGraphData}
                        options={graphOptions}>
                    </Bar>
                </Grid>
                <Grid item container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h5" align="center" gutterBottom>
                            Collection Performance
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography component="div" align="center">
                            Collected by:
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="row" spacing={4}>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Rent Collection
                        </Typography>
                        <HorizontalBar
                            height={250}
                            data={rentCollectionPerformanceData}
                            options={chargesPerformanceGraphsOptions}>
                        </HorizontalBar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Service Charge Collection
                        </Typography>
                        <HorizontalBar
                            height={250}
                            data={otherChargesCollectionPerformanceData}
                            options={chargesPerformanceGraphsOptions}>
                        </HorizontalBar>
                    </Grid>
                </Grid>
                <Grid item container direction="row" spacing={4}>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Income Categories
                        </Typography>
                        <HorizontalBar
                            height={250}
                            data={incomeCategoriesGraphData}
                            options={graphOptions}>
                        </HorizontalBar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" align="center" gutterBottom>
                            Expenses
                        </Typography>
                        <HorizontalBar
                            height={250}
                            data={expensesCategoriesGraphData}
                            options={graphOptions}>
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
        rentalCharges: state.rentalCharges.map((charge) => {
            const chargeDetails = {}
            //get payments with this charge id
            const chargePayments = state.rentalPayments.filter((payment) => payment.charge_id === charge.id)
            if (chargePayments.length) {
                chargeDetails.payed_status = true
                chargeDetails.last_payment_date = chargePayments.slice(-1)[0].payment_date
            } else {
                chargeDetails.payed_status = false
            }
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

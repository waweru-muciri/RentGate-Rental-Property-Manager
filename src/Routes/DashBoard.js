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
import { Bar } from 'react-chartjs-2';
import { commonStyles } from '../components/commonStyles'
import * as Yup from "yup";
import { Formik } from "formik";
import { format, getYear, startOfYear, endOfYear, startOfToday, parse, eachMonthOfInterval, getMonth } from "date-fns";

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

var monthsInYear = eachMonthOfInterval({
  start: startOfYear(startOfToday()),
  end: endOfYear(startOfToday()),
})

let DashBoardPage = (props) => {
  const classes = commonStyles()
  const { propertyUnits, transactions, transactionsCharges, leases, properties } = props;
  const [transactionItems, setTransactionItems] = useState([]);
  let [propertyFilter, setPropertyFilter] = useState("all");
  const [chargesItems, setChargesItems] = useState([]);
  const propertyActiveLeases = leases.filter(({ terminated }) => terminated !== true)

  useEffect(() => {
    setChargesItems(transactionsCharges);
  }, [transactionsCharges]);

  useEffect(() => {
    setTransactionItems(transactions);
  }, [transactions]);

  const setFilteredTransactionItemsByYear = (filterYear) => {
    setTransactionItems(
      transactions
        .filter(({ payment_date }) => getYear(parse(payment_date, 'yyyy-MM-dd', new Date())) === filterYear)
    );
    setChargesItems(
      transactionsCharges
        .filter(({ charge_date }) => getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === filterYear)
    );
  };

  const totalProperties = propertyUnits.length;
  //get the number of the different units by category
  const bedSitterUnits = propertyUnits.filter((property) => property.unit_type === 'Bedsitter').length;
  const oneBedUnits = propertyUnits.filter((property) => property.unit_type === 'One Bedroom').length;
  const twoBedUnits = propertyUnits.filter((property) => property.unit_type === 'Two Bedroom').length;
  const singleRoomUnits = propertyUnits.filter((property) => property.unit_type === 'Single Room').length;
  const doubleRoomUnits = propertyUnits.filter((property) => property.unit_type === 'Double Room').length;
  const shopUnits = propertyUnits.filter((property) => property.unit_type === 'Shop').length;
  //get the current number of occupied houses
  const occupiedHouses = propertyActiveLeases.length;
  //get months in an year in short format
  const rentIncomeData = { datasets: [] }
  rentIncomeData.labels = monthsInYear.map((monthDate) => format(monthDate, 'MMMM'));
  const totalEachMonthPayments = monthsInYear.map((monthDate) => {
    //get transactions recorded in the same month and year as monthDate
    return transactionItems
      .filter((payment) => {
        const paymentDate = parse(payment.payment_date, 'yyyy-MM-dd', new Date())
        return getMonth(monthDate) === getMonth(paymentDate)
      }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payment_amount) || 0), 0)
  })
  rentIncomeData.datasets.push({
    data: totalEachMonthPayments, label: 'Monthly Payments Collection', type: 'bar',
    fill: false,
    backgroundColor: '#71B37C',
    borderColor: '#71B37C',
    hoverBackgroundColor: '#71B37C',
    hoverBorderColor: '#71B37C',
  })

  const totalEachMonthCharges = monthsInYear.map((monthDate) => {
    //get transactions recorded in the same month and year as monthDate
    return chargesItems
      .filter((charge) => {
        const chargeDate = parse(charge.charge_date, 'yyyy-MM-dd', new Date())
        return getMonth(monthDate) === getMonth(chargeDate)
      }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.charge_amount) || 0), 0)
  })
  rentIncomeData.datasets.push({
    data: totalEachMonthCharges,
    label: 'Monthly Charges', type: 'line', borderColor: '#EC932F', fill: false,
    backgroundColor: '#EC932F',
    pointBorderColor: '#EC932F',
    pointBackgroundColor: '#EC932F',
    pointHoverBackgroundColor: '#EC932F',
    pointHoverBorderColor: '#EC932F',
  })

  return (
    <Layout pageTitle="Dashboard">
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item key={0}>
          <PageHeading text={"Dashboard"} />
        </Grid>
        <Grid item>
          <Grid container item direction="column" spacing={4}>
            <Grid item>
              <Box
                border={1}
                borderRadius="borderRadius"
                borderColor="grey.400"
              >
                <Formik
                  initialValues={{ filter_year: getYear(startOfToday()) }}
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
          <InfoDisplayPaper xs={6} title={"Bed Sitters"} value={bedSitterUnits} />
          <InfoDisplayPaper xs={6} title={"1 Bed"} value={oneBedUnits} />
          <InfoDisplayPaper xs={6} title={"2 Beds"} value={twoBedUnits} />
          <InfoDisplayPaper xs={6} title={"Single Room"} value={singleRoomUnits} />
          <InfoDisplayPaper xs={6} title={"Double Room"} value={doubleRoomUnits} />
          <InfoDisplayPaper xs={6} title={"Shop"} value={shopUnits} />
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          justify="space-around"
          key={2}
        >
          <InfoDisplayPaper xs={12} title={"Total Rentals"} value={totalProperties} />
          <InfoDisplayPaper xs={12} title={"Currently Occupied Rentals"} value={occupiedHouses} />
          <InfoDisplayPaper xs={12} title={"Currently Unoccupied Rentals"} value={totalProperties - occupiedHouses} />
          <InfoDisplayPaper xs={12} title={"Current Month Occupancy Rate"} value={((occupiedHouses / totalProperties) * 100) | 0} />
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            Monthly Charges &amp; Payments
          </Typography>
          <Bar
            data={rentIncomeData}
            options={options}>
          </Bar>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    leases: state.leases,
    properties: state.properties,
    propertyUnits: state.propertyUnits,
    transactionsCharges: state.transactionsCharges,
    transactions: state.transactions,
  };
};

export default connect(mapStateToProps)(DashBoardPage);

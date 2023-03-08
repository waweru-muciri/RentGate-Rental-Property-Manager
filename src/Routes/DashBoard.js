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
import { format, getYear, startOfYear, endOfYear, startOfToday, parse, eachMonthOfInterval, isSameMonth } from "date-fns";
import { getUnitTypes } from "../assets/commonAssets";


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
  }
};

const FilterYearSchema = Yup.object().shape({
  filter_year: Yup.number()
    .typeError("Year must be a number!")
    .required("Year is required")
    .min(2000, "Sorry, were not present then.")
    .max(2100, "Sorry, but we won't be here during those times.")
    .integer(),
});

var monthsInYear = eachMonthOfInterval({
  start: startOfYear(startOfToday()),
  end: endOfYear(startOfToday()),
})

//get the various unit types 
const UNIT_TYPES = getUnitTypes();

const currentYear = new Date().getFullYear()

let DashBoardPage = (props) => {
  const classes = commonStyles()
  const { propertyUnits, rentalPayments, rentalCharges, leases, properties } = props;
  const [transactionItems, setTransactionItems] = useState([]);
  const [propertyUnitItems, setPropertyUnitItems] = useState([]);
  const [leaseItems, setLeaseItems] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [chargesItems, setChargesItems] = useState([]);
  const propertyActiveLeases = leaseItems.filter(({ terminated }) => terminated !== true)

  useEffect(() => {
    setPropertyUnitItems(propertyUnits);
  }, [propertyUnits]);

  useEffect(() => {
    setLeaseItems(leases);
  }, [leases]);

  useEffect(() => {
    const rentalChargesForCurrentYear = rentalCharges
      .filter(({ charge_date }) => getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === currentYear)
    setChargesItems(rentalChargesForCurrentYear);
  }, [rentalCharges]);

  useEffect(() => {
    const rentalPaymentsPaymentsForCurrentYear = rentalPayments
      .filter(({ payment_date }) => getYear(parse(payment_date, 'yyyy-MM-dd', new Date())) === currentYear)
    setTransactionItems(rentalPaymentsPaymentsForCurrentYear);
  }, [rentalPayments]);

  const setFilteredTransactionItemsByYear = (filterYear) => {
    setTransactionItems(
      rentalPayments
        .filter(({ payment_date, property_id }) =>
          (getYear(parse(payment_date, 'yyyy-MM-dd', new Date())) === filterYear)
          && (propertyFilter === "all" ? true : property_id === propertyFilter)
        )
    );
    setChargesItems(
      rentalCharges
        .filter(({ charge_date, property_id }) =>
          (getYear(parse(charge_date, 'yyyy-MM-dd', new Date())) === filterYear)
          && (propertyFilter === "all" ? true : property_id === propertyFilter)
        )
    );
    setPropertyUnitItems(propertyUnits.filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter))
    setLeaseItems(leases.filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter))
  };
  //GET THE TOTAL NUMBER OF PROPERTY UNITS
  const TOTAL_PROPERTY_UNITS = propertyUnitItems.length;

  //GET THE NUMBER OF THE DIFFERENT UNIT TYPES 
  const EACH_UNIT_TYPE_WITH_AMOUNT = UNIT_TYPES.map(unitType => {
    const numberOfUnitsOfType = propertyUnitItems.filter((property) => property.unit_type === unitType.id).length;
    return {
      units_name: `${unitType.displayValue}(s)`,
      units_amount: numberOfUnitsOfType,
    }
  })
  //GET THE NUMBER OF CURRENTLY OCCUPIED UNITS
  const OCCUPIED_HOUSES = propertyActiveLeases.length;

  // CREATE A UNIT OCCUPANCY DISPLAY DATA ARRAY INSTEAD OF REPEATING MULTIPLE ELEMENTS
  const UNIT_OCCUPANCY_SUMMARY_DATA = [
    { title: "Total Units", value: TOTAL_PROPERTY_UNITS },
    { title: "Currently Occupied Units", value: OCCUPIED_HOUSES },
    { title: "Currently Unoccupied Units", value: TOTAL_PROPERTY_UNITS - OCCUPIED_HOUSES },
    { title: "Current Month Occupancy Rate", value: ((OCCUPIED_HOUSES / TOTAL_PROPERTY_UNITS) * 100) | 0 },
  ]

  //GET THE TOTAL PAYMENTS FOR EACH MONTH IN THE SELECTED YEAR
  const totalEachMonthPayments = monthsInYear.map((monthDate) => {
    //get rentalPayments recorded in the same month and year as monthDate
    return transactionItems
      .filter((payment) => {
        const paymentDate = parse(payment.payment_date, 'yyyy-MM-dd', new Date())
        return isSameMonth(monthDate, paymentDate)
      }).reduce((total, currentTransaction) => total + (parseFloat(currentTransaction.payment_amount) || 0), 0)
  })
  // MAKE AN OBJECT FOR SHOWING AN INCOME GRAPH, BY MONTH, LATER
  // LABELS ARE MONTHS IN THE YEAR IN SHORT FORMAT
  const rentIncomeData = {
    datasets: [{
      data: totalEachMonthPayments, label: 'Monthly Payments Collection', type: 'bar',
      fill: false,
      backgroundColor: '#71B37C',
      borderColor: '#71B37C',
      hoverBackgroundColor: '#71B37C',
      hoverBorderColor: '#71B37C',
    }],
    labels: monthsInYear.map((monthDate) => format(monthDate, 'MMMM')),
  }

  const totalEachMonthCharges = monthsInYear.map((monthDate) => {
    //get rentalPayments recorded in the same month and year as monthDate
    return chargesItems
      .filter((charge) => {
        const chargeDate = parse(charge.charge_date, 'yyyy-MM-dd', new Date())
         return isSameMonth(monthDate, chargeDate)
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
    <Layout pageTitle="Overview">
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item key={0}>
          <PageHeading text={"Overview"} />
        </Grid>
        <Grid item container>
          <Grid container item direction="column" spacing={4}>
            <Grid item>
              <Box
                border={1}
                borderRadius="borderRadius"
                borderColor="grey.400"
              >
                <Formik
                  initialValues={{ filter_year: currentYear }}
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
          {
            EACH_UNIT_TYPE_WITH_AMOUNT.map((unitTypeWithAmount, index) =>
              <InfoDisplayPaper key={index} xs={6} title={unitTypeWithAmount.units_name} value={unitTypeWithAmount.units_amount} />)
          }

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
          {
            UNIT_OCCUPANCY_SUMMARY_DATA.map((unitOccupancyData, index) =>
              <InfoDisplayPaper key={index} xs={12} title={unitOccupancyData.title} value={unitOccupancyData.value} />
            )
          }
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
    rentalCharges: state.rentalCharges,
    rentalPayments: state.rentalPayments,
  };
};

export default connect(mapStateToProps)(DashBoardPage);

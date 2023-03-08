import React, { useEffect, useState } from "react";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import { Grid, Typography, Box, TextField, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { commonStyles } from "../components/commonStyles";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment";

const FilterYearSchema = Yup.object().shape({
  filter_year: Yup.number()
    .typeError("Year must be a number!")
    .required("Year is required")
    .positive()
    .min(2000, "Must be greater than 2000")
    .max(10000, "Max year is 10000")
    .integer(),
});

let DashBoardPage = (props) => {
  const classes = commonStyles();
  const [transactionItems, setTransactionItems] = useState([]);
  const [filterYear, setFilterYear] = useState(moment().get("year"));
  const { properties, contacts, transactions, notices } = props;

  useEffect(() => {
    setTransactionItems(transactions);
  }, [transactions]);

  const setFilteredTransactionItemsByYear = () => {
    setTransactionItems(
      transactions.filter(
        ({ transaction_date }) =>
          moment(transaction_date).get("year") === filterYear
      )
    );
  };

  const totalProperties = properties.length;

  const occupiedHouses = properties.filter((property) => property.tenant)
    .length;

  const monthsOfTheYear = moment.monthsShort();

  const transactionsGraphData = Array.from(monthsOfTheYear, (monthOfYear) => ({
    month: monthOfYear,
    amount: 0,
    numberOfTransactions: 0,
  }));

  transactionItems.forEach(({ transaction_date, transaction_price }) => {
    const currentMonth = moment(transaction_date).get("month");
    transactionsGraphData[currentMonth].amount =
      transactionsGraphData[currentMonth].amount +
      parseFloat(transaction_price);
    transactionsGraphData[currentMonth].numberOfTransactions =
      transactionsGraphData[currentMonth].numberOfTransactions + 1;
  });

  const occupancyRateData = transactionsGraphData.map((transaction) => ({
    month: transaction.month,
    rate: (transaction.numberOfTransactions / totalProperties) * 100,
  }));

  return (
    <Layout pageTitle="Dashboard">
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item key={0}>
          <PageHeading paddingLeft={2} text={"Dashboard"} />
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="space-evenly"
          key={2}
        >
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Total Rentals
              </Typography>
              <Typography variant="subtitle2" align="center">
                {totalProperties}
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Current Month Occupancy Rate
              </Typography>
              <Typography variant="subtitle2" align="center">
                {(occupiedHouses / totalProperties) * 100}
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Currently Occupied Rentals
              </Typography>
              <Typography variant="subtitle2" align="center">
                {occupiedHouses}
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Currently Unoccupied Rentals
              </Typography>
              <Typography variant="subtitle2" align="center">
                {totalProperties - occupiedHouses}
              </Typography>
            </InfoDisplayPaper>
          </Grid>
        </Grid>
        <Grid item>
          <Box
            border={1}
            p={4}
            borderRadius="borderRadius"
            borderColor="grey.400"
          >
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Box
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Formik
                    initialValues={{ filter_year: filterYear }}
                    validationSchema={FilterYearSchema}
                    onSubmit={(values) => {
                      setFilterYear(values.filter_year);
                      setFilteredTransactionItemsByYear();
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
              <Grid item>
                <Box
                  p={2}
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Typography variant="h6" align="center" gutterBottom>
                    Monthly Rent Collection
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={transactionsGraphData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Legend />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  p={2}
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Typography variant="h6" align="center" gutterBottom>
                    Monthly House Occupany Rate
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={occupancyRateData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <Legend />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    notices: state.notices,
    properties: state.properties,
    transactions: state.transactions,
    users: state.users,
    currentUser: state.currentUser,
    contacts: state.contacts,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(DashBoardPage);

import React from "react";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import { Grid, Typography } from "@material-ui/core";
import { commonStyles } from "../components/commonStyles";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import moment from "moment";

let DashBoardPage = (props) => {
  const classes = commonStyles();

  const { properties, contacts, transactions, notices } = props;

  const totalProperties  = properties.length
  const occupiedHouses = properties.filter((property) => property.tenant).length
  const monthsOfTheYear = moment.monthsShort()
  const transactionsGraphData = Array.from(monthsOfTheYear, monthOfYear => ({month : monthOfYear, amount: 0, numberOfTransactions: 0 }));
  transactions.forEach(({transaction_date, transaction_price}) => {
    const currentMonth = moment(transaction_date).get('month')
    transactionsGraphData[currentMonth].amount = transactionsGraphData[currentMonth].amount + parseFloat(transaction_price)
    transactionsGraphData[currentMonth].numberOfTransactions = transactionsGraphData[currentMonth].numberOfTransactions + 1
  })
  const occupancyRateData = transactionsGraphData.map((transaction) => ({
    month: transaction.month, rate: (transaction.numberOfTransactions/ totalProperties) * 100
  }))
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
              <Typography variant="subtitle1" align="center">Total Rentals</Typography>
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
                {(occupiedHouses / totalProperties) * 100 }
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
        <Grid item container direction="column" justify="center" key={1}>
          <Grid item>
            <Typography variant="subtitle1" align="center" gutterBottom>Monthly Rent Collection</Typography>
            <LineChart
              width={1000}
              height={300}
              data={transactionsGraphData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Monthly House Occupany Rate
            </Typography>
            <LineChart
              width={1000}
              height={300}
              data={occupancyRateData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="rate" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Grid>
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

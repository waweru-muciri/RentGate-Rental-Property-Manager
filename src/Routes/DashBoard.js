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

let DashBoardPage = (props) => {
  const classes = commonStyles();

  const { properties, contacts, transactions, notices } = props;
  const transactionsGraphData = [
    { month: "January", amount: 256400 },
    { month: "February", amount: 248600 },
    { month: "March", amount: 240800 },
    { month: "April", amount: 240890 },
    { month: "May", amount: 140640 },
    { month: "June", amount: 340640 },
    { month: "July", amount: 280640 },
    { month: "August", amount: 50640 },
    { month: "September", amount: 0 },
    { month: "October", amount: 0 },
    { month: "November", amount: 0 },
    { month: "December", amount: 0 },
  ];
  const occupancyRateData = [
    { month: "January", rate: 100 },
    { month: "February", rate: 95 },
    { month: "March", rate: 100 },
    { month: "April", rate: 100 },
    { month: "May", rate: 100 },
    { month: "June", rate: 100 },
    { month: "July", rate: 98 },
    { month: "August", rate: 90 },
    { month: "September", rate: 0 },
    { month: "October", rate: 0 },
    { month: "November", rate: 0 },
    { month: "December", rate: 0 },
  ];

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
                130
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Current Month Occupancy Rate
              </Typography>
              <Typography variant="subtitle2" align="center">
                90%
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Currently Occupied Rentals
              </Typography>
              <Typography variant="subtitle2" align="center">
                100
              </Typography>
            </InfoDisplayPaper>
          </Grid>
          <Grid item md={3}>
            <InfoDisplayPaper>
              <Typography variant="subtitle1" align="center">
                Currently Unoccupied Rentals
              </Typography>
              <Typography variant="subtitle2" align="center">
                20
              </Typography>
            </InfoDisplayPaper>
          </Grid>
        </Grid>
        <Grid item container direction="column" justify="center" key={1}>
          <Grid item>
            <Typography variant="subtitle1">Monthly Rent Collection</Typography>
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
            <Typography variant="subtitle1">
              Monthly House Occupany Rate.
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

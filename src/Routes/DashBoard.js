import React from "react";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import { Grid, Typography } from "@material-ui/core";

let DashBoard = (props) => {

  return (
    <Layout pageTitle="Dashboard">
      <Grid container justify="center" direction="column">
        <Grid item key={2}>
          <PageHeading paddingLeft={2} text={"Dashboard"} />
        </Grid>
        <Grid container direction="column" justify="center" item key={3}>
          <Typography variant="subtitle1">It's a dream. It's just a dream.</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default DashBoard;

import React from "react";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DataGridTable from '../components/DataGridTable'
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { getMonthsInYear } from "../assets/commonAssets";
import { format } from "date-fns";

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

const propertiesColumns = [
    { field: 'ref', headerName: 'Property Name/Ref' },
    { field: "address", headerName: "Property Address" },
    { field: "city", headerName: "Location" },
    { field: "units", headerName: "Number of Units" },
];

const monthsInYear = getMonthsInYear()


let UserDetailsPage = ({
    activeLeases,
    totalPropertyUnits,
    properties,
    userDetails,
}) => {
    const classes = commonStyles()
    const managementRevenueGraphData = { datasets: [] }
    //get months in an year in short format
    managementRevenueGraphData.labels = monthsInYear.map((monthDate) => format(monthDate, 'MMMM'));
    return (
        <Layout pageTitle="User Profile">
            <Grid container justify="center" direction="column" spacing={2}>
                <Grid item xs={12} >
                    <PageHeading text="User Details" />
                </Grid>
                <Grid
                    container
                    direction="row"
                    item
                    spacing={4}
                >
                    <Grid container item direction="column" xs={12} md={4} spacing={2} justify="space-between" alignItems="stretch">
                        <Grid item>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Grid container spacing={2} direction="column" alignItems="center"
                                        justify="center">
                                        <Grid item>
                                            <Avatar
                                                alt="User Image"
                                                src={userDetails.user_avatar_url}
                                                className={classes.largeAvatar}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                                {userDetails.title} {userDetails.first_name} {userDetails.last_name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Contact Info
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        ID Number: {userDetails.id_number || '-'}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Personal Phone Number: {userDetails.phone_number || '-'}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Work Phone Number: {userDetails.work_mobile_number || '-'}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Home Phone Number: {userDetails.home_phone_number || '-'}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Email: {userDetails.primary_email || '-'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={8}>
                        <Grid item xs={12}>
                            <Card variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Properties Under Management
                                    </Typography>
                                    <DataGridTable rows={properties} headCells={propertiesColumns} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" item alignItems="stretch" spacing={4}>
                    <Grid item xs={12} md={4} container spacing={2} direction="column" alignItems="center" justify="center">
                        <InfoDisplayPaper xs={12} title={"Total Rental Units"} value={totalPropertyUnits} />
                        <InfoDisplayPaper xs={12} title={"Total Active Rental Agreements"} value={activeLeases} />
                        <InfoDisplayPaper xs={12} title={"Total Unoccupied Units"} value={totalPropertyUnits - activeLeases} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                            <CardContent>
                                <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                    Management Revenue
                                </Typography>
                                <Bar
                                    data={managementRevenueGraphData}
                                    options={options}>
                                </Bar>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        properties: state.properties
            .filter(({ assigned_to }) => assigned_to === ownProps.match.params.userId)
            .map(property => Object.assign(property, { units: state.propertyUnits.filter(({ property_id }) => property_id === property.id).length })),
        activeLeases: state.leases.filter(({ terminated }) => terminated !== true).length,
        totalPropertyUnits: state.propertyUnits.length,
        userDetails: state.users.find(({ id }) => id === ownProps.match.params.userId) || {}
    }
};


UserDetailsPage = connect(mapStateToProps)(UserDetailsPage);

export default withRouter(UserDetailsPage);

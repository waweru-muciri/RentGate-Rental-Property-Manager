import React, { useState, useEffect } from "react";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DataGridTable from '../components/DataGridTable';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TabPanel from "../components/TabPanel";
import Button from '@material-ui/core/Button';
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import CommonTable from "../components/table/commonTable";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { handleDelete } from "../actions/actions";
import { Doughnut } from 'react-chartjs-2';
import TEAL from '@material-ui/core/colors/teal';
import RED from '@material-ui/core/colors/red';
import GREY from "@material-ui/core/colors/grey";
import { getUnitTypes } from "../assets/commonAssets";


const UNIT_TYPES_WITH_DETAILS = getUnitTypes();


const legendOpts = {
    display: true,
    position: 'top',
    fullWidth: true,
    reverse: false,
    labels: {
        fontColor: GREY[800],
        fontSize: 14,
    }
};

const headCells = [
    { id: "from_date", numeric: false, disablePadding: true, label: "From Date" },
    { id: "to_date", numeric: false, disablePadding: true, label: "To Date" },
    { id: "property_ref", numeric: false, disablePadding: true, label: "Property" },
    { id: "collection_date", numeric: false, disablePadding: true, label: "Date Collected" },
    { id: "fees_amount", numeric: false, disablePadding: true, label: "Amount Collected" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

const propertiesColumns = [
    { field: 'ref', headerName: 'Property Name/Ref' },
    { field: "address", headerName: "Property Address" },
    { field: "city", headerName: "Location" },
    { field: "units", headerName: "Number of Units" },
];


let UserDetailsPage = ({
    totalAssetsRentValue,
    activeLeasesNumber,
    propertyUnits,
    properties,
    userDetails,
    managementFees,
    match,
    handleItemDelete
}) => {
    const classes = commonStyles()
    const [tabValue, setTabValue] = React.useState(0);
    const [managementFeesItems, setManagementFeesItems] = useState([])
    const [filteredManagementFeesItems, setFilteredManagementFeesItems] = useState([])
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setManagementFeesItems(managementFees)
        setFilteredManagementFeesItems(managementFees)
    }, [managementFees])

    const totalPropertyUnits = propertyUnits.length

    //get occupancy graph data
    const rentalUnitsOccupancyData = { datasets: [], labels: [] }
    rentalUnitsOccupancyData.labels.push('Occupied Units', 'Vacant Units')
    rentalUnitsOccupancyData.datasets.push(
        {
            data: [activeLeasesNumber, (propertyUnits.length - activeLeasesNumber)],
            backgroundColor: [RED[800], RED[200]]
        })
    //get the number of the different units by category
    const rentalUnitsDistributionData = { datasets: [], labels: [] }
    //get the unique unit types for the property units
    const unitTypes = Array.from(new Set(propertyUnits.map(unit => unit.unit_type)))
    //get the unit names for display to the user
    const unitNamesForDisplay = unitTypes.map(unitType => {
        const unitTypeDetails = UNIT_TYPES_WITH_DETAILS.find(({ id }) => id === unitType) || {}
        return `${unitTypeDetails.displayValue}s`
    })
    //push the unit names for display to the labels array 
    rentalUnitsDistributionData.labels.push(...unitNamesForDisplay);

    rentalUnitsDistributionData.datasets.push({
        data: unitTypes
            .map(unit_type => {
                return propertyUnits.filter((property) => property.unit_type === unit_type).length
            }),
        backgroundColor: unitTypes.map((_unit_type, key) => TEAL[(key + 1) * 100])
    })

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the management fees according to the search criteria here
        const managementFeesForProperty =
            managementFeesItems
                .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
        setFilteredManagementFeesItems(managementFeesForProperty);

    };

    return (
        <Layout pageTitle="User Profile">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="User Profile" />
                    <Tab label="Management Revenue" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <Grid container justify="center" direction="column" spacing={2}>
                    <Grid item xs={12} >
                        <Typography variant="h6">User Details</Typography>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        item
                        justify="center"
                        spacing={4}
                    >
                        <Grid container item direction="column" xs={12} md={4} spacing={2} justify="center" alignItems="stretch">
                            <Grid item md>
                                <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                    <CardContent>
                                        <Grid container spacing={2} direction="column" alignItems="center" justify="center">
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
                                            Personal Phone Number: {userDetails.personal_phone_number || '-'}
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
                                            Property Portfolio
                                        </Typography>
                                        <DataGridTable rows={properties} headCells={propertiesColumns} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" item alignItems="stretch" justify="center" spacing={4}>
                        <Grid item xs={12} md={4} container spacing={2} direction="column" alignItems="center" justify="center">
                            <InfoDisplayPaper xs={12} title={"Total Rental Units"} value={totalPropertyUnits} />
                            <InfoDisplayPaper xs={12} title={"Total Units Rent Value"} value={totalAssetsRentValue} />
                            <InfoDisplayPaper xs={12} title={"Total Active Rental Agreements"} value={activeLeasesNumber} />
                        </Grid>
                        <Grid container item xs={12} md={8} spacing={2} direction="row" alignItems="stretch" justify="center">
                            <Grid item xs={12} md>
                                <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                    <CardContent>
                                        <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                            Current Unit Occupancy
                                        </Typography>
                                        <Doughnut height={300} data={rentalUnitsOccupancyData} legend={legendOpts} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md>
                                <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                    <CardContent>
                                        <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                            Unit Types Distribution
                                        </Typography>
                                        <Doughnut height={300} data={rentalUnitsDistributionData} legend={legendOpts} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Grid
                    container
                    spacing={3}
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Management Fees</Typography>
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
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<AddIcon />}
                                component={Link}
                                to={`${match.url}/management-fees/new`}
                            >
                                Collect Fees
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<EditIcon />}
                                disabled={!selected.length}
                                component={Link}
                                to={`${match.url}/management-fees/${selected[0]}/edit`}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item>
                            <PrintArrayToPdf
                                disabled={!selected.length}
                                reportName={'Management Fees Records'}
                                reportTitle={'Management Fees Data'}
                                headCells={headCells}
                                dataToPrint={managementFeesItems.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                disabled={!selected.length}
                                reportName={'Management Fees Records'}
                                reportTitle={'Management Fees Data'}
                                headCells={headCells}
                                dataToPrint={managementFeesItems.filter(({ id }) => selected.includes(id))}
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
                                id="managementFeesSearchForm"
                                onSubmit={handleSearchFormSubmit}
                            >
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                    direction="row"
                                >
                                    <Grid item xs={12} md={6}>
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
                                        <Button
                                            type="submit"
                                            form="managementFeesSearchForm"
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
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredManagementFeesItems}
                            headCells={headCells}
                            deleteUrl={'management-fees'}
                            handleDelete={handleItemDelete}
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    const propertiesAssignedToUser = state.properties
        .filter(({ assigned_to }) => assigned_to === ownProps.match.params.userId)
        .map(property => Object.assign(
            property,
            {
                units: state.propertyUnits.filter(({ property_id }) => property_id === property.id).length,
            }));
    //map ids of properties assigned to user to enable for a quick search
    const idsOfPropertiesAssignedToUser = propertiesAssignedToUser.map(({ id }) => id)
    //get all active leases assigned to user's properties
    const totalActiveLeases = state.leases
        .filter(({ property_id }) => idsOfPropertiesAssignedToUser.includes(property_id))
        .filter(({ terminated }) => terminated !== true);
    return {
        managementFees: state.managementFees
            .filter(({ user_id }) => user_id === ownProps.match.params.userId).map(managementFee => {
                const propertyWithFeeDetails = state.properties.find(({ id }) => id === managementFee.property_id) || {}
                return Object.assign({}, managementFee, { property_ref: propertyWithFeeDetails.ref })

            }),
        properties: propertiesAssignedToUser,
        activeLeasesNumber: totalActiveLeases.length,
        totalAssetsRentValue: totalActiveLeases
            .reduce((total, currentValue) => total + parseFloat(currentValue.rent_amount) || 0, 0),
        propertyUnits: state.propertyUnits
            .filter(({ property_id }) => idsOfPropertiesAssignedToUser.includes(property_id)),
        userDetails: state.users.find(({ id }) => id === ownProps.match.params.userId) || {}
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

UserDetailsPage = connect(mapStateToProps, mapDispatchToProps)(UserDetailsPage);

export default withRouter(UserDetailsPage);

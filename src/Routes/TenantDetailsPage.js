import React from "react";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { handleDelete } from "../actions/actions";
import IndividualTenantChargesStatement from "./IndividualTenantChargesStatement";
import TabPanel from "../components/TabPanel";
import DataGridTable from '../components/DataGridTable'
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { startOfToday, startOfMonth, endOfMonth, parse, isWithinInterval } from "date-fns";

const chargesColumns = [
    { field: 'charge_label', headerName: 'Charge Type', width: 200 },
    { field: 'charge_date', headerName: 'Date Charged', width: 200 },
    { field: 'charge_amount', headerName: 'Amount', type: "number", width: 90 },
]

const paymentsColumns = [
    { field: 'payment_label', headerName: 'Payment For', width: 200 },
    { field: 'payment_date', headerName: 'Date Made', width: 200 },
    { field: 'payment_amount', headerName: 'Amount', type: "number", width: 90 },
]

let TenantDetailsPage = ({
    transactions,
    transactionsCharges,
    tenantUnit,
    tenantDetails,
    handleItemDelete,
}) => {
    const classes = commonStyles()
    const emergencyContact = {
        emergency_contact_name: tenantDetails.emergency_contact_name,
        emergency_contact_relationship: tenantDetails.emergency_contact_relationship,
        emergency_contact_phone_number: tenantDetails.emergency_contact_phone_number,
        emergency_contact_email: tenantDetails.emergency_contact_email,
    }
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const currentMonthCharges = transactionsCharges.filter((chargeItem) => {
        const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
        return isWithinInterval(chargeItemDate, { start: startOfMonth(startOfToday()), end: endOfMonth(startOfToday()) })
    })
    const currentMonthPayments = transactions.filter((paymentItem) => {
        const paymentItemDate = parse(paymentItem.payment_date, 'yyyy-MM-dd', new Date())
        return isWithinInterval(paymentItemDate, { start: startOfMonth(startOfToday()), end: endOfMonth(startOfToday()) })
    })

    return (
        <Layout pageTitle="Tenant Summary">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Tenant Details" />
                    <Tab label="Rent &amp; Other Charges" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={1}>
                <IndividualTenantChargesStatement tenantTransactionCharges={transactionsCharges}
                    tenantDetails={tenantDetails} handleItemDelete={handleItemDelete} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
                <Grid container justify="center" direction="column" spacing={2}>
                    <Grid item key={0}>
                        <Typography variant="h6">Tenant Details</Typography>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        item
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item xs={12} md>
                            <TenantInfoDisplayCard title="Tenant Details"
                                subheader="Personal Info"
                                avatarSrc={tenantDetails.contact_avatar_url}
                                cardContent={[
                                    { name: 'Name', value: `${tenantDetails.title} ${tenantDetails.first_name} ${tenantDetails.last_name}` },
                                    { name: 'ID Number', value: tenantDetails.id_number || '-' },
                                    { name: 'Personal Phone Number', value: tenantDetails.phone_number || tenantUnit.address || '-' },
                                    { name: 'Work Phone Number', value: tenantDetails.work_mobile_number || '-' },
                                    { name: 'Home Phone Number', value: tenantDetails.home_phone_number || '-' },
                                    { name: 'Email', value: tenantDetails.contact_email || '-' },
                                    { name: 'Emergency Contact Name', value: emergencyContact.emergency_contact_name },
                                    { name: 'Emergency Contact Relationship', value: emergencyContact.emergency_contact_relationship },
                                    { name: 'Emergency Contact Phone Number', value: emergencyContact.emergency_contact_phone_number || '-' },
                                    { name: 'Emergency Contact Email', value: emergencyContact.emergency_contact_email || '-' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardMedia
                                    height="200"
                                    component="img"
                                    image={tenantUnit.unit_image_url}
                                    title="Unit Image"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="body2">
                                        Unit: {tenantUnit.ref}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Unit Type: {tenantUnit.unit_type}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Beds: {tenantUnit.beds}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Baths: {tenantUnit.baths}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Unit Sqft: {tenantUnit.sqft}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Rent Amount: {tenantUnit.rent_amount}
                                    </Typography>
                                    <Typography gutterBottom variant="body2">
                                        Rent Cycle: {tenantUnit.rent_cycle}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" item alignItems="stretch" spacing={2}>
                        <Grid item xs={12} md>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Recent Charges History
                                    </Typography>
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGridTable rows={currentMonthCharges} headCells={chargesColumns} pageSize={5} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Recent Payments History
                                    </Typography>
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGridTable rows={currentMonthPayments} headCells={paymentsColumns} pageSize={5} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    const currentTenantActiveLease = state.leases.filter(({ terminated }) => terminated !== true)
        .find(({ tenants }) => Array.isArray(tenants) ? tenants.includes(ownProps.match.params.contactId) : false) || {}
    const unitInLease = state.propertyUnits.find(({ id }) => id === currentTenantActiveLease.unit_id) || {}
    return {
        transactionsCharges: state.transactionsCharges
            .filter((charge) => charge.tenant_id === ownProps.match.params.contactId).sort((charge1, charge2) => charge2.charge_date > charge1.charge_date)
            .map((charge) => {
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
            })
            .sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        tenantUnit: Object.assign({}, unitInLease, currentTenantActiveLease),
        transactions: state.transactions.filter((payment) => payment.tenant_id === ownProps.match.params.contactId),
        tenantDetails: state.contacts.find(({ id }) => id === ownProps.match.params.contactId) || {}
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TenantDetailsPage = connect(mapStateToProps, mapDispatchToProps)(TenantDetailsPage);

export default withRouter(TenantDetailsPage);

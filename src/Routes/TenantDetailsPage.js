import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { handleDelete } from "../actions/actions";
import TenantChargesStatement from "./TenantChargesStatement";
import TabPanel from "../components/TabPanel";
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


let TenantDetailsPage = ({
    transactionsCharges,
    tenantUnit,
    history,
    tenantDetails,
    handleItemDelete,
}) => {
    const classes = commonStyles()
    const [tenantChargesItems, setTenantChargesItems] = useState([])
    const emergencyContact = {
        emergency_contact_name: tenantDetails.emergency_contact_name,
        emergency_contact_relationship: tenantDetails.emergency_contact_relationship,
        emergency_contact_phone_number: tenantDetails.emergency_contact_phone_number,
        emergency_contact_email: tenantDetails.emergency_contact_email,
    }
    const [tabValue, setTabValue] = React.useState(1);

    useEffect(() => {
        setTenantChargesItems(transactionsCharges)
    }, [transactionsCharges])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout pageTitle="Tenant Summary">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Tenant Details" />
                    <Tab label="Rent &amp; Other Charges" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={1}>
                <TenantChargesStatement tenantTransactionCharges={tenantChargesItems}
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
                                    { name: 'Title', value: tenantDetails.title || '-' },
                                    { name: 'Name', value: `${tenantDetails.first_name} ${tenantDetails.last_name}` },
                                    { name: 'Gender', value: tenantDetails.gender || '-' },
                                    { name: 'ID Number', value: tenantDetails.id_number || '-' },
                                    { name: 'Personal Phone Number', value: tenantDetails.personal_mobile_number || tenantUnit.address || '-' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md>
                            <TenantInfoDisplayCard title="Tenant Details"
                                subheader="Contact Info"
                                avatar={''}
                                cardContent={[
                                    { name: 'Work Phone Number', value: tenantDetails.work_mobile_number || '-' },
                                    { name: 'Home Phone Number', value: tenantDetails.home_phone_number || '-' },
                                    { name: 'Unit', value: tenantUnit.ref || '-' },
                                    { name: 'Email', value: tenantDetails.contact_email || '-' },
                                    { name: 'Current Address', value: tenantDetails.present_address || tenantUnit.address || '-' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md>
                            <TenantInfoDisplayCard title="Tenant Emergency Contact"
                                subheader="Emergency Contact"
                                avatar={emergencyContact.emergency_contact_name ? emergencyContact.emergency_contact_name[0] : 'EC'}
                                cardContent={[
                                    { name: 'Name', value: emergencyContact.emergency_contact_name },
                                    { name: 'Relationship', value: emergencyContact.emergency_contact_relationship },
                                    { name: 'Phone Number', value: emergencyContact.emergency_contact_phone_number || '-' },
                                    { name: 'Email', value: emergencyContact.emergency_contact_email || '-' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
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
            }),
        tenantUnit: state.propertyUnits.find((unit) => unit.tenants.includes(ownProps.match.params.contactId)) || {},
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

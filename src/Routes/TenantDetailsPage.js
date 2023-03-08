import React from "react";
import Layout from "../components/myLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import TenantChargesStatement from "./TenantChargesStatement";
import TenantPaymentsSummary from "./TenantPaymentsSummary";
import TabPanel from "../components/TabPanel";
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import {commonStyles} from '../components/commonStyles'
import { withRouter } from "react-router-dom";


let TenantDetailsPage = ({
    tenantUnit,
    isLoading,
    transactions,
    expenses,
    meterReadings,
    currentUser,
    history,
    contacts,
    users,
    match,
    error, handleItemDelete
}) => {
    const classes = commonStyles()
    const contactToShowDetailsId = match.params.contactId;
    const contactToShowDetails = contacts.find(({ id }) => id === contactToShowDetailsId) || {}
    const emergencyContact = {
        emergency_contact_name: contactToShowDetails.emergency_contact_name,
        emergency_contact_relationship: contactToShowDetails.emergency_contact_relationship,
        emergency_contact_phone_number: contactToShowDetails.emergency_contact_phone_number,
        emergency_contact_email: contactToShowDetails.emergency_contact_email,
    }
    const [tabValue, setTabValue] = React.useState(0);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout pageTitle="Tenant Summary">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Tenant Details" />
                    <Tab label="Rent &amp; Other Charges" />
                    <Tab label="Payments History" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={2}>
                <TenantPaymentsSummary transactions={transactions} expenses={expenses} meterReadings={meterReadings} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <TenantChargesStatement transactions={transactions} expenses={expenses} meterReadings={meterReadings} />
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
                                avatarSrc={contactToShowDetails.contact_avatar_url}
                                cardContent={[
                                    { name: 'Title', value: contactToShowDetails.title || '-' },
                                    { name: 'Name', value: `${contactToShowDetails.first_name} ${contactToShowDetails.last_name}` },
                                    { name: 'Gender', value: contactToShowDetails.gender || '-' },
                                    { name: 'ID Number', value: contactToShowDetails.id_number || '-' },
                                    { name: 'Personal Phone Number', value: contactToShowDetails.personal_mobile_number || tenantUnit.address || '-' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md>
                            <TenantInfoDisplayCard title="Tenant Details"
                                subheader="Contact Info"
                                avatar={''}
                                cardContent={[
                                    { name: 'Work Phone Number', value: contactToShowDetails.work_mobile_number || '-' },
                                    { name: 'Home Phone Number', value: contactToShowDetails.home_phone_number || '-' },
                                    { name: 'Unit', value: tenantUnit.ref || '-' },
                                    { name: 'Email', value: contactToShowDetails.contact_email || '-' },
                                    { name: 'Current Address', value: contactToShowDetails.present_address || tenantUnit.address || '-' },
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
        transactions: state.transactions,
        meterReadings: state.meterReadings,
        expenses: state.expenses,
        tenantUnit: state.propertyUnits.find((unit) => unit.tenants.includes(ownProps.match.tenantId)) || {},
        currentUser: state.currentUser,
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (tenantId, itemId, url) => dispatch(handleDelete(tenantId, itemId, url)),
    };
};

TenantDetailsPage = connect(mapStateToProps, mapDispatchToProps)(TenantDetailsPage);

export default withRouter(TenantDetailsPage);

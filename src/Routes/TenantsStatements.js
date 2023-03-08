import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from "../components/TabPanel";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ContactsChargesStatement from "./ContactsChargesStatement";
import ContactsPaymentsStatement from "./ContactsPaymentsStatement";

let TenantStatementsPage = ({
    transactions,
    transactionsCharges,
    contacts,
    properties,
}) => {
    const classes = commonStyles()

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout pageTitle="Tenants Statement">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Tenants Charges Statement" />
                    <Tab label="Tenants Payments Statement" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <ContactsChargesStatement contacts={contacts} transactionsCharges={transactionsCharges} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <ContactsPaymentsStatement contacts={contacts} transactions={transactions} properties={properties} classes={classes} />
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        transactionsCharges: state.transactionsCharges,
        transactions: state.transactions,
        contacts: state.contacts,
        properties: state.properties,
    };
};

TenantStatementsPage = connect(mapStateToProps)(TenantStatementsPage);

export default withRouter(TenantStatementsPage);

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import NoticeInputForm from "../components/notices/NoticeInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'
import queryString from 'query-string';

let NoticePage = (props) => {
    const { notices, history, contacts, propertyUnits, leases, submitForm } = props;
    const activeMappedLeases = leases.filter(({ terminated }) => terminated !== true)
        .filter(({ tenants }) => tenants && tenants.length)
        .map((lease) => {
            const tenantDetails = contacts.find(({ id }) => lease.tenants ? lease.tenants.includes(id) : false) || {}
            return Object.assign({}, lease, {tenant_name: `${tenantDetails.first_name} ${tenantDetails.last_name}`})
        })
        .map((lease) => {
            const unitDetails = propertyUnits.find(({ id }) => lease.unit_id === id) || {}
            return Object.assign({}, lease, {unit_ref: `${unitDetails.ref}`})
        })
    let noticeToEditId = props.match.params.noticeId;
    let noticeToEdit = notices.find(({ id }) => id === noticeToEditId) || {};
    // Get the leaseId to end agreement
    const params = queryString.parse(props.location.search)
    var leaseToEnd = params.lease;
    if (leaseToEnd) {
        noticeToEdit.lease_id = leaseToEnd
    }
    let pageTitle = noticeToEdit.id ? "Edit Intent To Move Out" : "Record Intent To Move Out";

    return (
        <Layout pageTitle="Notice Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <NoticeInputForm
                        history={history}
                        submitForm={submitForm}
                        activeLeases={activeMappedLeases}
                        noticeToEdit={noticeToEdit}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        notices: state.notices,
        propertyUnits: state.propertyUnits,
        leases: state.leases,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: (item, itemUrl) => dispatch(handleItemFormSubmit(item, itemUrl)),
    };
};

NoticePage = connect(mapStateToProps, mapDispatchToProps)(NoticePage);

export default withRouter(NoticePage);

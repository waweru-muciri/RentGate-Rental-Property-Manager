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
    const { noticeToEdit, history, activeMappedLeases, submitForm } = props;
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
                    <PageHeading  text={pageTitle} />
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

const mapStateToProps = (state, ownProps) => {
    return {
        noticeToEdit: state.notices.find(({ id }) => id === ownProps.match.params.noticeId) || {},
        activeMappedLeases: state.leases.filter(({ terminated }) => terminated !== true)
        .map((lease) => {
            const tenantDetails = state.contacts.find(({ id }) => Array.isArray(lease.tenants) ? lease.tenants.includes(id) : false) || {}
            return Object.assign({}, lease, {tenant_name: `${tenantDetails.first_name} ${tenantDetails.last_name}`})
        })
        .map((lease) => {
            const unitDetails = state.propertyUnits.find(({ id }) => lease.unit_id === id) || {}
            return Object.assign({}, lease, {unit_ref: `${unitDetails.ref}`})
        }),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: (item, itemUrl) => dispatch(handleItemFormSubmit(item, itemUrl)),
    };
};

NoticePage = connect(mapStateToProps, mapDispatchToProps)(NoticePage);

export default withRouter(NoticePage);

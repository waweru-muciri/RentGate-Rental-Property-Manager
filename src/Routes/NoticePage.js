import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import NoticeInputForm from "../components/notices/NoticeInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let NoticePage = (props) => {
    const { notices, contacts, leases, submitForm } = props;
    const activeMappedLeases = leases.filter(({ terminated }) => terminated !== true)
        .filter(({ tenants }) => tenants && tenants.length)
        .map((lease) => {
            const tenantDetails = contacts.find(({ id }) => lease.tenants ? lease.tenants.includes(id) : false) || {}
            return Object.assign({}, lease, {tenant_name: `${tenantDetails.first_name} ${tenantDetails.last_name}`})
        })
    let noticeToEditId = props.match.params.noticeId;
    let noticeToEdit = notices.find(({ id }) => id === noticeToEditId) || {};
    let pageTitle = noticeToEdit.id ? "Edit Notice" : "New Notice";

    return (
        <Layout pageTitle="Notice Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <NoticeInputForm
                        submitForm={submitForm}
                        noticeToEdit={noticeToEdit}
                        activeLeases={activeMappedLeases}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        notices: state.notices,
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

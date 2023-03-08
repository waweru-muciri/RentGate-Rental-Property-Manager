import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ManagementFeesInputForm from "../components/users/ManagementFeesInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let ManagementFeePage = ({ properties, transactions, managementFeeToEdit, handleItemSubmit, history }) => {
    const pageTitle = managementFeeToEdit.id ? "Edit Management Fee" : "Collect Management Fee";
    return (
        <Layout pageTitle="Management Fee Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading  text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <ManagementFeesInputForm
                        history={history}
                        managementFeeToEdit={managementFeeToEdit}
                        handleItemSubmit={handleItemSubmit}
                        transactions={transactions}
                        properties={properties}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        transactions: state.transactions,
        properties: state.properties,
        managementFeeToEdit: state.managementFees.find(({ id }) => id === ownProps.match.params.managementFeeId) || {},
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

ManagementFeePage = connect(mapStateToProps, mapDispatchToProps)(ManagementFeePage);

export default withRouter(ManagementFeePage);

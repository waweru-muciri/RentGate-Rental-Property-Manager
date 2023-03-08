import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ManagementFeesInputForm from "../components/users/ManagementFeesInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'
import Typography from "@material-ui/core/Typography";

let ManagementFeePage = ({ properties, currentUser, managementFeeToEdit, handleItemSubmit, history }) => {
    const pageTitle = managementFeeToEdit.id ? "Edit Management Fee" : "Collect Management Fee";

    return (
        <Layout pageTitle="Management Fee Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading text={pageTitle} />
                    <Typography variant='body1' color="textSecondary">
						Management fees are automatically recorded as expenses
					</Typography>
                </Grid>
                <Grid item key={2}>
                    <ManagementFeesInputForm
                        history={history}
                        managementFeeToEdit={managementFeeToEdit}
                        handleItemSubmit={handleItemSubmit}
                        properties={properties}
                        currentUser={currentUser}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        properties: state.properties,
        currentUser: state.currentUser,
        managementFeeToEdit: state.managementFees.find(({ id }) => id === ownProps.match.params.managementFeeId) || {},
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

ManagementFeePage = connect(mapStateToProps, mapDispatchToProps)(ManagementFeePage);

export default withRouter(ManagementFeePage);

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ExpenseInputForm from "../components/expenses/ExpenseInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let ExpensePage = (props) => {
    const { expenses, properties, propertyUnits, handleItemSubmit, currentUser, history } = props;
    let expenseToEditId = props.match.params.expenseId;
    let expenseToEdit = expenses.find(({ id }) => id === expenseToEditId);
    let pageTitle = expenseToEditId ? "Edit Expense" : "New Expense";
    return (
        <Layout pageTitle="Expense Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <ExpenseInputForm
                        history={history}
                        expenseToEdit={expenseToEdit}
                        handleItemSubmit={handleItemSubmit}
                        currentUser={currentUser}
                        properties={properties}
                        propertyUnits={propertyUnits}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        currentUser: state.currentUser,
        propertyUnits: state.propertyUnits,
        expenses: state.expenses,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (user, item, url) => dispatch(handleItemFormSubmit(user, item, url)),
    }
};

ExpensePage = connect(mapStateToProps, mapDispatchToProps)(ExpensePage);

export default withRouter(ExpensePage);

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ExpenseInputForm from "../components/expenses/ExpenseInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let ExpensePage = (props) => {
    const { expenses, properties, propertyUnits, handleItemSubmit, history } = props;
    let expenseToEditId = props.match.params.expenseId;
    let expenseToEdit = expenses.find(({ id }) => id === expenseToEditId) || {};
    let pageTitle = expenseToEdit.id ? "Edit Expense" : "New Expense";
    return (
        <Layout pageTitle="Expense Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading  text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <ExpenseInputForm
                        history={history}
                        expenseToEdit={expenseToEdit}
                        handleItemSubmit={handleItemSubmit}
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
        propertyUnits: state.propertyUnits,
        expenses: state.expenses,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

ExpensePage = connect(mapStateToProps, mapDispatchToProps)(ExpensePage);

export default withRouter(ExpensePage);

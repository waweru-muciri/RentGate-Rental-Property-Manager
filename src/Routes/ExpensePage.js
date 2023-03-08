import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import ExpenseInputForm from "../components/expenses/ExpenseInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let ExpensePage = (props) => {
    const { expenses, users, contacts, properties, handleItemSubmit } = props;
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
                        expenseToEdit={expenseToEdit}
                        handleItemSubmit={handleItemSubmit}
                        users={users}
                        contacts={contacts}
                        properties={properties}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        expenses: state.expenses,
        users: state.users,
        contacts: state.contacts,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

ExpensePage = connect(mapStateToProps, mapDispatchToProps)(ExpensePage);

export default withRouter(ExpensePage);

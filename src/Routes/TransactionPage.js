import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import TransactionInputForm from "../components/transactions/TransactionInputForm";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';

let TransactionPage = (props) => {
	let params = queryString.parse(props.location.search)
	// Get the action to complete.
	var leaseToRenew = params.leaseToRenew;
	let transactionToEditId = props.match.params.transactionId;
	let transactionToEdit = props.transactions.find(
		({ id }) => id === transactionToEditId
	);
	transactionToEdit = typeof transactionToEdit !== 'undefined' ? transactionToEdit : {}
	if (leaseToRenew) {
		transactionToEdit = Object.assign({}, transactionToEdit, { id: undefined });	
	}
	let pageTitle = leaseToRenew ? "Renew Lease" : transactionToEditId ? "Edit Lease" : "New Lease";

	return (
		<Layout pageTitle="Lease Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading paddingLeft={2} text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<TransactionInputForm
						transactionToEdit={transactionToEdit} leaseToRenew={leaseToRenew}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		transactions: state.transactions,
		error: state.error,
	};
};

TransactionPage = connect(mapStateToProps)(TransactionPage);

export default withRouter(TransactionPage);

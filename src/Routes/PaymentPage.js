import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PaymentInputForm from "../components/transactions/PaymentInputForm";
import { withRouter } from "react-router-dom";

let TransactionPage = (props) => {
	// Get the action to complete.
	let transactionToEditId = props.match.params.transactionId;
	let paymentToEdit = props.transactions.find(
		({ id }) => id === transactionToEditId
	);
	paymentToEdit = typeof paymentToEdit !== 'undefined' ? paymentToEdit : {}
	let pageTitle = transactionToEditId ? "Edit Payment" : "New Payment";

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
					<PaymentInputForm
						paymentToEdit={paymentToEdit} 
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

import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../actions/actions'
import PaymentInputForm from "../components/transactions/PaymentInputForm";
import { withRouter } from "react-router-dom";

let PaymentPage = ({ history, match, transactions, transactionsCharges, contacts, handleItemSubmit }) => {
	// Get the action to complete.
	const chargeToAddPaymentId = match.params.chargeId;
	const chargeToAddPayment = transactionsCharges.find(({ id }) => id === chargeToAddPaymentId) || {};
	const chargePayments = transactions.filter((payment) => payment.charge_id === chargeToAddPaymentId)
	const totalPaymentsToCharge = chargePayments.reduce((total, currentValue) =>
		total + parseFloat(currentValue.payment_amount) || 0, 0);
	chargeToAddPayment.payed_amount = totalPaymentsToCharge
	chargeToAddPayment.balance = parseFloat(chargeToAddPayment.charge_amount) - totalPaymentsToCharge
	const contactWithCharge = contacts.find((contact) => contact.id === chargeToAddPayment.tenant_id) || {}
	const pageTitle = `Receive Payment for - ${chargeToAddPayment.unit_ref} • ${contactWithCharge.first_name} ${contactWithCharge.last_name}`;
	return (
		<Layout pageTitle="Payment Details">
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
						chargeToAddPayment={chargeToAddPayment}
						handleItemSubmit={handleItemSubmit}
						history={history}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		transactions: state.transactions,
		transactionsCharges: state.transactionsCharges,
		contacts: state.contacts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

PaymentPage = connect(mapStateToProps, mapDispatchToProps)(PaymentPage);

export default withRouter(PaymentPage);

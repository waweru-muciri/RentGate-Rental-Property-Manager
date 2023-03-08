import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../actions/actions'
import PaymentInputForm from "../components/payments/PaymentInputForm";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';

let PaymentPage = ({ history, location, chargeToAddPayment, leases, contactWithCharge, unitWithCharge, handleItemSubmit }) => {
	// Get the action to complete.
	let pageTitle;
	let tenantLease;
	//get params
	const params = queryString.parse(location.search)
	if (params.charge_deposit) {
		tenantLease = leases.filter(({ terminated }) => terminated !== true)
			.find(({ unit_id }) => unit_id === chargeToAddPayment.unit_id) || {}
		pageTitle = `Charge on Deposit for - ${unitWithCharge.ref} • ${contactWithCharge.first_name} ${contactWithCharge.last_name}`;
	} else {
		pageTitle = `Receive Payment for - ${unitWithCharge.ref} • ${contactWithCharge.first_name} ${contactWithCharge.last_name}`;

	}
	return (
		<Layout pageTitle="Payment Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading text={pageTitle} />
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
						tenantLease={tenantLease}
						handleItemSubmit={handleItemSubmit}
						history={history}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	const chargeToAddPayment = state.transactionsCharges.find(({ id }) => id === ownProps.match.params.chargeId) || {};
	const unitWithCharge = state.propertyUnits.find(({ id }) => id === chargeToAddPayment.unit_id) || {};
	const chargePayments = state.transactions.filter((payment) => payment.charge_id === chargeToAddPayment.id)
	const totalPaymentsToCharge = chargePayments.reduce((total, currentValue) =>
		total + parseFloat(currentValue.payment_amount) || 0, 0);
	chargeToAddPayment.payed_amount = totalPaymentsToCharge
	chargeToAddPayment.balance = parseFloat(chargeToAddPayment.charge_amount) - totalPaymentsToCharge
	const contactWithCharge = state.contacts.find((contact) => contact.id === chargeToAddPayment.tenant_id) || {}

	return {
		unitWithCharge: unitWithCharge,
		contactWithCharge: contactWithCharge,
		chargeToAddPayment: chargeToAddPayment,
		leases: state.leases,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

PaymentPage = connect(mapStateToProps, mapDispatchToProps)(PaymentPage);

export default withRouter(PaymentPage);

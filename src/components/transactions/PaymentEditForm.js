import React from "react";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../PageHeading";
import Layout from "../PrivateLayout";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../../actions/actions'
import { withRouter } from "react-router-dom";
import { format, startOfToday } from "date-fns";


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const PaymentSchema = Yup.object().shape({
	tenant_id: Yup.string().trim().required('Tenant is required'),
	memo: Yup.string().trim().max(50, "Memo details should be less than 50").default(''),
	payment_amount: Yup.number().typeError('Amount must be a number').required("Payment amount is required"),
	payment_date: Yup.date().required('Payment Date is Required'),
});


let PaymentInputForm = ({ history, match, transactions, contacts, handleItemSubmit }) => {
	const classes = commonStyles();
	// Get the action to complete.
	const paymentToEditId = match.params.paymentId;
	const paymentToEdit = transactions.find(({ id }) => id === paymentToEditId) || {};
	const contactWithPayment = contacts.find((contact) => contact.id === paymentToEdit.tenant_id) || {}
	const pageTitle = `Edit Payment for - ${paymentToEdit.unit_ref} • ${contactWithPayment.first_name} ${contactWithPayment.last_name}`;

	const paymentValues = {
		id: paymentToEdit.id,
		charge_id: paymentToEdit.charge_id,
		unit_id: paymentToEdit.unit_id,
		unit_ref: paymentToEdit.unit_ref,
		payment_amount: paymentToEdit.payment_amount || 0,
		memo: paymentToEdit.memo || '',
		payment_label: paymentToEdit.payment_label || 0,
		payment_type: paymentToEdit.payment_type || 0,
		payment_date: defaultDate,
		tenant_id: paymentToEdit.tenant_id,
	};

	return (
		<Layout pageTitle="Payment Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading  text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<Formik
						initialValues={paymentValues}
						enableReinitialize validationSchema={PaymentSchema}
						onSubmit={async (values, { resetForm }) => {
							const chargePayment = {
								id: paymentToEdit.id,
								charge_id: values.charge_id,
								payment_amount: values.payment_amount,
								memo: values.memo,
								payment_date: values.payment_date,
								tenant_id: values.tenant_id,
								unit_ref: values.unit_ref,
								unit_id: values.unit_id,
								payment_label: values.payment_label,
								payment_type: values.payment_type,
							};
							await handleItemSubmit(chargePayment, 'charge-payments')
							resetForm({});
							history.goBack()
						}}
					>
						{({
							values,
							handleSubmit,
							touched,
							errors,
							handleChange,
							handleBlur,
							isSubmitting,
						}) => (
								<form
									className={classes.form}
									method="post"
									id="paymentInputForm"
									onSubmit={handleSubmit}
								>
									<Grid container>
										<Grid item container spacing={2} direction="column">
											<Grid item>
												<TextField
													fullWidth
													variant="outlined"
													id="payment_date"
													type="date"
													name="payment_date"
													label="Payment Date"
													value={values.payment_date}
													onChange={handleChange}
													onBlur={handleBlur}
													InputLabelProps={{ shrink: true }}
													error={errors.payment_date && touched.payment_date}
													helperText={touched.payment_date && errors.payment_date}
												/>
											</Grid>
											<Grid item>
												<TextField
													fullWidth
													type="text"
													variant="outlined"
													name="payment_amount"
													id="payment_amount"
													label="Payment Amount"
													value={values.payment_amount}
													onChange={handleChange}
													onBlur={handleBlur}
													error={errors.payment_amount && touched.payment_amount}
													helperText={touched.payment_amount && errors.payment_amount}
												/>
											</Grid>
											<Grid item>
												<TextField
													fullWidth
													type="text"
													multiline
													rows={4}
													variant="outlined"
													name="memo"
													id="memo"
													label="Payment Details/Memo"
													value={values.memo}
													onChange={handleChange}
													onBlur={handleBlur}
													error={errors.memo && touched.memo}
													helperText={touched.memo && errors.memo || "Include details for the payments here (max 50)"}
												/>
											</Grid>
										</Grid>
										<Grid
											item
											container
											justify="flex-start"
											direction="row"
											className={classes.buttonBox}
										>
											<Grid item>
												<Button
													color="secondary"
													variant="contained"
													size="medium"
													startIcon={<CancelIcon />}
													onClick={() => history.goBack()}
													disableElevation
												>
													Cancel
												</Button>
											</Grid>
											<Grid item>
												<Button
													type="submit"
													color="primary"
													variant="contained"
													size="medium"
													startIcon={<SaveIcon />}
													form="paymentInputForm"
													disabled={isSubmitting}
												>
													Save Payment
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</form>
							)
						}
					</Formik >
				</Grid>
			</Grid>
		</Layout >
	);
};

const mapStateToProps = (state) => {
	return {
		transactions: state.transactions,
		contacts: state.contacts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

PaymentInputForm = connect(mapStateToProps, mapDispatchToProps)(PaymentInputForm);

export default withRouter(PaymentInputForm);
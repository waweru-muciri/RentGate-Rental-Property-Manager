import React from "react";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../actions/actions'
import { withRouter } from "react-router-dom";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../components/CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../components/CustomCircularProgress";
import PageHeading from "../components/PageHeading";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const ChargeOnDepositSchema = Yup.object().shape({
	tenant_id: Yup.string().trim().required('Tenant is required'),
	deposit_to_charge: Yup.string().trim().required('Deposit to charge is required'),
	memo: Yup.string().trim().max(50, "Memo details should be less than 50 characters").default(''),
	charge_balance: Yup.number().typeError('Charge Balance must be a number').required("Charge balance is required"),
	payment_date: Yup.date().required('Payment Date is Required'),
	payment_amount: Yup.number().typeError('Amount must be a number')
		.positive("Amount must be a positive number")
		.test("payment_amount", "Payment amount cannot be greater than remaining balance", function (value) {
			return !(value > this.parent.charge_balance);
		})
		.when('deposit_to_charge',
			{
				is: 'rent_deposit', then: Yup.number()
					.max(Yup.ref('rent_deposit_amount'), 'Payment amount cannot be greater than rent deposit')
			})
		.when('deposit_to_charge',
			{
				is: 'water_deposit', then: Yup.number()
					.max(Yup.ref('water_deposit_amount'),
						'Payment amount cannot be greater than water deposit')
			})
		.when('deposit_to_charge',
			{
				is: 'electricity_deposit', then: Yup.number()
					.max(Yup.ref('electricity_deposit_amount'), 'Payment amount cannot be greater than electricity deposit')
			})
		.required("Payment amount is required"),
});
let ChargeOnDeposits = ({ history, chargeDetails, tenantLease, handleItemSubmit }) => {
	const classes = commonStyles();

	const paymentValues = {
		charge_id: chargeDetails.id,
		tenant_name: chargeDetails.tenant_name,
		unit_id: chargeDetails.unit_id,
		charge_amount: chargeDetails.charge_amount || 0,
		charge_balance: chargeDetails.balance || 0,
		charge_label: chargeDetails.charge_label || 0,
		charge_type: chargeDetails.charge_type || 0,
		payment_amount: "",
		memo: "",
		payment_date: defaultDate,
		tenant_id: chargeDetails.tenant_id,
		property_id: chargeDetails.property_id,
		deposit_to_charge: '',
		rent_deposit_amount: tenantLease.security_deposit,
		water_deposit_amount: tenantLease.water_deposit,
		electricity_deposit_amount: tenantLease.electricity_deposit,
	};

	const pageTitle = `Charge on Deposit for - ${paymentValues.tenant_name}`

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
					<Formik
						initialValues={paymentValues}
						enableReinitialize validationSchema={ChargeOnDepositSchema}
						onSubmit={async (values, { resetForm, setStatus }) => {
							try {
								//reduce the selected deposit by the payment amount 
								const leaseToEdit = {
									id: tenantLease.id,
								}
								let depositAfterPayment;
								switch (values.deposit_to_charge) {
									case 'rent_deposit':
										depositAfterPayment = parseFloat(tenantLease.security_deposit) - parseFloat(values.payment_amount)
										leaseToEdit.security_deposit = depositAfterPayment;
										break;
									case 'water_deposit':
										depositAfterPayment = parseFloat(tenantLease.water_deposit) - parseFloat(values.payment_amount)
										leaseToEdit.water_deposit = depositAfterPayment;
										break;
									case 'electricity_deposit':
										depositAfterPayment = parseFloat(tenantLease.electricity_deposit) - parseFloat(values.payment_amount)
										leaseToEdit.electricity_deposit = depositAfterPayment;
										break;
									default:
										break;
								}
								await handleItemSubmit(leaseToEdit, 'leases')
								//save the payment after reducing the deposit amount in the lease
								const chargePayment = {
									charge_id: values.charge_id,
									payment_amount: values.payment_amount,
									memo: values.memo,
									payment_date: values.payment_date,
									tenant_id: values.tenant_id,
									unit_id: values.unit_id,
									property_id: values.property_id,
									payment_label: values.charge_label,
									payment_type: values.charge_type,
								};
								await handleItemSubmit(chargePayment, 'charge-payments')
								//show that payment has been made
								await handleItemSubmit({ id: values.charge_id, payed: true }, 'transactions-charges')
								setStatus({ sent: true, msg: "Details saved successfully." })
								history.goBack();
							} catch (error) {
								setStatus({ sent: false, msg: `Error! ${error}.` })
							}
						}}
					>
						{({
							values,
							status,
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
								id="chargeOnDepositForm"
								onSubmit={handleSubmit}
							>
								<Grid container spacing={2} direction="column">
									{
										status && status.msg && (
											<CustomSnackbar
												variant={status.sent ? "success" : "error"}
												message={status.msg}
											/>
										)
									}
									{
										isSubmitting && (<CustomCircularProgress open={true} />)
									}
									<Grid item>
										<Typography variant="subtitle1"> Charge Details : {values.charge_label}</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">Total Charge Amount : {values.charge_amount}</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">Charge Balance: {values.charge_balance}</Typography>
									</Grid>
									<Grid item>
										<FormControl component="fieldset" color="primary" error={errors.deposit_to_charge && touched.deposit_to_charge}>
											<FormLabel component="legend">Deposit To Charge</FormLabel>
											<RadioGroup aria-label="deposit to charge" name="deposit_to_charge" value={values.deposit_to_charge} onChange={handleChange}>
												{values.rent_deposit_amount ? <FormControlLabel value="rent_deposit" control={<Radio />} label={`Rent Deposit - ${values.rent_deposit_amount}`} /> : null}
												{values.water_deposit_amount ? <FormControlLabel value="water_deposit" control={<Radio />} label={`Water Deposit - ${values.water_deposit_amount}`} /> : null}
												{values.electricity_deposit_amount ? <FormControlLabel value="electricity_deposit" control={<Radio />} label={`Electricity Deposit - ${values.electricity_deposit_amount}`} /> : null}
											</RadioGroup>
											<FormHelperText>Select a deposit to charge</FormHelperText>
										</FormControl>
									</Grid>
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
											rows={2}
											variant="outlined"
											name="memo"
											id="memo"
											label="Payment Details/Memo"
											value={values.memo}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.memo && touched.memo}
											helperText={"Include details for the payments here (max 50)"}
										/>
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
												form="chargeOnDepositForm"
												disabled={isSubmitting}
											>
												Charge On Deposit
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
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	const chargeDetails = state.rentalCharges.find(({ id }) => id === ownProps.match.params.chargeId) || {};
	const chargePayments = state.rentalPayments.filter((payment) => payment.charge_id === chargeDetails.id)
	chargeDetails.payed_status = chargePayments.length ? true : false;
	const payed_amount = chargePayments.reduce((total, currentValue) => {
		return total + parseFloat(currentValue.payment_amount) || 0
	}, 0)
	chargeDetails.payed_amount = payed_amount
	chargeDetails.balance = parseFloat(chargeDetails.charge_amount) - payed_amount
	const tenant = state.contacts.find((contact) => contact.id === chargeDetails.tenant_id) || {};
	chargeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
	const tenantLease = state.leases.filter(({ terminated }) => terminated !== true)
		.find(({ unit_id }) => unit_id === chargeDetails.unit_id) || {}
	return {
		chargeDetails: chargeDetails,
		tenantLease: tenantLease,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

ChargeOnDeposits = connect(mapStateToProps, mapDispatchToProps)(ChargeOnDeposits);

export default withRouter(ChargeOnDeposits);

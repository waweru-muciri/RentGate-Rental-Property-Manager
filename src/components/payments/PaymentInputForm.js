import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const PaymentSchema = Yup.object().shape({
	tenant_id: Yup.string().trim().required('Tenant is required'),
	memo: Yup.string().trim().max(50, "Memo details should be less than 50 characters").default(''),
	reference_id: Yup.string().trim().max(20, "Reference Id should be <= 20 characters").default(''),
	charge_balance: Yup.number().typeError('Charge Balance must be a number').required("Charge balance is required"),
	payment_amount: Yup.number().typeError('Amount must be a number')
		.positive("Amount must be a positive number")
		.max(Yup.ref('charge_balance'), 'Payment amount cannot be greater than remaining balance')
		.required("Payment amount is required"),
	payment_date: Yup.date().required('Payment Date is Required'),
});


export default function PaymentInputForm({ open, handleClose, chargeToAddPaymentTo, handleItemSubmit }) {
	const classes = commonStyles();
	const paymentValues = {
		charge_id: chargeToAddPaymentTo.id,
		unit_ref: chargeToAddPaymentTo.unit_ref,
		tenant_name: chargeToAddPaymentTo.tenant_name,
		unit_id: chargeToAddPaymentTo.unit_id,
		charge_amount: chargeToAddPaymentTo.charge_amount || 0,
		charge_balance: chargeToAddPaymentTo.balance || 0,
		charge_label: chargeToAddPaymentTo.charge_label || 0,
		charge_type: chargeToAddPaymentTo.charge_type || 0,
		payment_amount: "",
		memo: "",
		payment_date: defaultDate,
		tenant_id: chargeToAddPaymentTo.tenant_id,
		reference_id: chargeToAddPaymentTo.reference_id || '',
		property_id: chargeToAddPaymentTo.property_id,
	};

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">Receive Payment for - {paymentValues.unit_ref} • {paymentValues.tenant_name}</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={paymentValues}
					enableReinitialize validationSchema={PaymentSchema}
					onSubmit={async (values, { resetForm, setStatus }) => {
						try {
							const chargePayment = {
								charge_id: values.charge_id,
								payment_amount: values.payment_amount,
								memo: values.memo,
								payment_date: values.payment_date,
								tenant_id: values.tenant_id,
								reference_id: values.reference_id,
								unit_id: values.unit_id,
								property_id: values.property_id,
								payment_label: values.charge_label,
								payment_type: values.charge_type,
							};
							await handleItemSubmit(chargePayment, 'charge-payments')
							await handleItemSubmit({ id: values.charge_id, payed: true }, 'transactions-charges')
							setStatus({ sent: true, msg: "Payment saved successfully." })
							handleClose();
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
							id="paymentInputForm"
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
										variant="outlined"
										name="reference_id"
										id="reference_id"
										label="Reference Id"
										value={values.reference_id}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.reference_id && touched.reference_id}
										helperText={touched.reference_id && errors.reference_id}
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
											onClick={() => { handleClose() }}
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
			</DialogContent>
		</Dialog >
	);
};

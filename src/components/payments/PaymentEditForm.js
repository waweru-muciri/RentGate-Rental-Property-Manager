import React from "react";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
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


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const PaymentSchema = Yup.object().shape({
	memo: Yup.string().trim().max(50, "Memo details should be less than 50").default(''),
	reference_id: Yup.string().trim().max(20, "Reference Id should be <= 20 characters").default(''),
	payment_amount: Yup.number().typeError('Amount must be a number').positive("Amount must be a positive number")
		.required("Payment amount is required"),
	payment_date: Yup.date().required('Payment Date is Required'),
});


export default function PaymentEditForm ({ paymentToEdit, handleItemSubmit, open, handleClose }) {
	const classes = commonStyles();
	// Get the action to complete.
	const paymentValues = {
		id: paymentToEdit.id,
		payment_amount: paymentToEdit.payment_amount || 0,
		memo: paymentToEdit.memo || '',
		payment_date: paymentToEdit.payment_date || defaultDate,
		reference_id: paymentToEdit.reference_id || '',
	};

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">Edit Payment Details</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={paymentValues}
					enableReinitialize validationSchema={PaymentSchema}
					onSubmit={async (values, { resetForm, setStatus }) => {
						try {
							const chargePayment = {
								id: paymentToEdit.id,
								payment_amount: values.payment_amount,
								memo: values.memo,
								payment_date: values.payment_date,
								reference_id: values.reference_id,
							};
							await handleItemSubmit(chargePayment, 'charge-payments')
							resetForm({});
							setStatus({ sent: true, msg: "Payment saved." })
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
							noValidate
							id="paymentEditForm"
							onSubmit={handleSubmit}
						>
							<Grid container>
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
											helperText={errors.memo || "Include details for the payments here (max 50)"}
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
											onClick={() => handleClose()}
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
											form="paymentEditForm"
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
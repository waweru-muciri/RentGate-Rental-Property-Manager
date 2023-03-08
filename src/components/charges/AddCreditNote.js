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
	charge_balance: Yup.number().typeError('Charge Balance must be a number').required("Charge balance is required"),
	credit_amount: Yup.number().typeError('Amount must be a number')
		.positive("Amount must be a positive number")
		.max(Yup.ref('charge_balance'), 'Credit amount cannot be greater than remaining balance')
		.required("Credit amount is required"),
	credit_issue_date: Yup.date().required('Credit Date is Required'),
});


export default function CreditNoteInputForm({ open, handleClose, chargeToAddCreditNote, handleItemSubmit }) {
	const classes = commonStyles();
	const paymentValues = {
		charge_id: chargeToAddCreditNote.id,
		unit_ref: chargeToAddCreditNote.unit_ref,
		tenant_name: chargeToAddCreditNote.tenant_name,
		unit_id: chargeToAddCreditNote.unit_id,
		charge_amount: chargeToAddCreditNote.charge_amount || 0,
		charge_balance: chargeToAddCreditNote.balance || 0,
		charge_label: chargeToAddCreditNote.charge_label || 0,
		charge_type: chargeToAddCreditNote.charge_type || 0,
		credit_amount: "",
		memo: "",
		credit_issue_date: defaultDate,
		tenant_id: chargeToAddCreditNote.tenant_id,
		property_id: chargeToAddCreditNote.property_id,
	};

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">Credit Note for - {paymentValues.unit_ref} • {paymentValues.tenant_name}</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={paymentValues}
					enableReinitialize validationSchema={PaymentSchema}
					onSubmit={async (values, { resetForm, setStatus }) => {
						try {
							const creditNote = {
								charge_id: values.charge_id,
								credit_amount: values.credit_amount,
								memo: values.memo,
								credit_issue_date: values.credit_issue_date,
								tenant_id: values.tenant_id,
								unit_id: values.unit_id,
								property_id: values.property_id,
							};
							await handleItemSubmit(creditNote, 'credit-notes')
							await handleItemSubmit({ id: values.charge_id, payed: true }, 'transactions-charges')
							setStatus({ sent: true, msg: "Credit Note saved successfully." })
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
							id="creditNoteForm"
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
										id="credit_issue_date"
										type="date"
										name="credit_issue_date"
										label="Credit Issue Date"
										value={values.credit_issue_date}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
										error={errors.credit_issue_date && touched.credit_issue_date}
										helperText={touched.credit_issue_date && errors.credit_issue_date}
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										type="text"
										variant="outlined"
										name="credit_amount"
										id="credit_amount"
										label="Credit Amount"
										value={values.credit_amount}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.credit_amount && touched.credit_amount}
										helperText={touched.credit_amount && errors.credit_amount}
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
										label="Credit Details/Memo"
										value={values.memo}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.memo && touched.memo}
										helperText={"Include details for the credit here (max 50)"}
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
											form="creditNoteForm"
											disabled={isSubmitting}
										>
											Save Note
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

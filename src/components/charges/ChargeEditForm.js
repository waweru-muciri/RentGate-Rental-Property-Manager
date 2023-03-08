import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../CustomSnackbar';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";
import { getChargeOptions } from "../../assets/commonAssets";

const CHARGE_OPTIONS = getChargeOptions();


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const ChargeSchema = Yup.object().shape({
	charge_type: Yup.string().trim().required('Charge type is required'),
	charge_amount: Yup.number().typeError('Amount must be a number').positive("Amount must be a positive number")
		.required("Charge amount is required"),
	charge_date: Yup.date().required('Charge Date is Required'),
	due_date: Yup.date(),
});


export default function ChargeEditForm({ chargeToEdit, handleItemSubmit, open, handleClose }) {
	const classes = commonStyles();

	const chargeValues = {
		id: chargeToEdit.id,
		charge_amount: chargeToEdit.charge_amount || 0,
		charge_type: chargeToEdit.charge_type || '',
		charge_date: chargeToEdit.charge_date || defaultDate,
		due_date: chargeToEdit.due_date || defaultDate,
	};

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="alert-dialog-title">Edit Charge Details</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={chargeValues}
					enableReinitialize validationSchema={ChargeSchema}
					onSubmit={async (values, { resetForm, setStatus }) => {
						try {
							const charge = {
								id: chargeToEdit.id,
								charge_amount: values.charge_amount,
								charge_date: values.charge_date,
								due_date: values.due_date,
								charge_type: values.charge_type,
								charge_label: CHARGE_OPTIONS.find(({ id }) => id === values.charge_type).displayValue,
							};
							await handleItemSubmit(charge, 'transactions-charges')
							resetForm({});
							setStatus({ sent: true, msg: "Charge saved successfully." })
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
							id="chargeEditForm"
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
											id="charge_date"
											type="date"
											name="charge_date"
											label="Charge Date"
											value={values.charge_date}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
											error={errors.charge_date && touched.charge_date}
											helperText={touched.charge_date && errors.charge_date}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id="due_date"
											type="date"
											name="due_date"
											label="Due Date"
											value={values.due_date}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
											error={errors.due_date && touched.due_date}
											helperText={touched.due_date && errors.due_date}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											type="text"
											variant="outlined"
											name="charge_amount"
											id="charge_amount"
											label="Charge Amount"
											value={values.charge_amount}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.charge_amount && touched.charge_amount}
											helperText={touched.charge_amount && errors.charge_amount}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											select
											variant="outlined"
											id="charge_type"
											name="charge_type"
											label="Charge Type"
											value={values.charge_type}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.charge_type && touched.charge_type}
											helperText={touched.charge_type && errors.charge_type}
										>
											{CHARGE_OPTIONS.map((chargeOption, index) => (
												<MenuItem key={index} value={chargeOption.id}>
													{chargeOption.displayValue}
												</MenuItem>
											))}
										</TextField>
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
											form="chargeEditForm"
											disabled={isSubmitting}
										>
											Save Charge
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
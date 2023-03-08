import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import SaveIcon from "@material-ui/icons/Save";
import CustomSnackbar from '../CustomSnackbar'
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
} from "../../actions/actions";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";


const PropertySettingsSchema = Yup.object().shape({
	property_id: Yup.string().trim().required("Property is Required"),
	grace_period: Yup.number().typeError('Grace Period days must be a number').min(0, "Grace Period days must be >= 0").default(0),
	late_fee_amount: Yup.number().typeError('Amount must be a number').min(0, "Amount must be >= 0").required("Late Fee amount is required"),
	late_fee_frequency: Yup.string().trim().required("Frequency to charge fees is required"),
	late_fee_max_amount: Yup.number().typeError('Maximmum amount must be a number').min(0, "Amount must be >= 0").default(0),
	management_fee_type: Yup.string().trim().required('Management Fee Type is required'),
	management_fee_income_percentage: Yup.number().when('management_fee_type',
		{ is: 'income_percentage', then: Yup.number().typeError('Percentage must be a number').min(0, "Amount must be >= 0").required('Percentage is required') }),
	unit_or_property_to_charge: Yup.string().trim().when('management_fee_type',
		{ is: 'income_percentage', then: Yup.string().trim().required('Item to attach fees is required') }),
	management_fee_flat_fee: Yup.number().when('management_fee_type',
		{ is: 'flat_fee', then: Yup.number().typeError('Flat fee must be a number').min(0, "Amount must be >= 0").required('Flat fee is required') }),
});


let PropertySettingsInputForm = (props) => {
	const { classes, propertyToShowDetails, handleItemSubmit } = props
	const propertySettings = props.propertySettings || {};
	const propertyValues = {
		id: propertySettings.id,
		property_id: propertySettings.property_id || propertyToShowDetails.id,
		late_fee_max_amount: propertySettings.late_fee_max_amount || "",
		grace_period: propertySettings.grace_period || 0,
		late_fee_frequency: propertySettings.late_fee_frequency || "one_time_fee",
		late_fee_amount: propertySettings.late_fee_amount || "",
		email_residents_on_charges_posted: propertySettings.email_residents_on_charges_posted || true,
		late_fee_policy_status: propertySettings.late_fee_policy_status || false,
		automatically_end_agreement_on_move_out_date: propertySettings.automatically_end_agreement_on_move_out_date || true,
		email_residents_on_late_fees: propertySettings.email_residents_on_late_fees || true,
		management_fee_type: propertySettings.management_fee_type || 'flat_fee',
		management_fee_income_percentage: propertySettings.management_fee_income_percentage || '',
		management_fee_flat_fee: propertySettings.management_fee_flat_fee || '',
		unit_or_property_to_charge: propertySettings.unit_or_property_to_charge || 'per_property',
	};

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySettingsSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					let propertySettingsValues = {
						id: values.id,
						property_id: values.property_id,
						late_fee_max_amount: values.late_fee_max_amount,
						grace_period: values.grace_period,
						late_fee_frequency: values.late_fee_frequency,
						late_fee_policy_status: values.late_fee_policy_status,
						email_residents_on_late_fees: values.email_residents_on_late_fees,
						late_fee_amount: values.late_fee_amount,
						management_fee_type: values.management_fee_type,
						management_fee_income_percentage: values.management_fee_income_percentage,
						email_residents_on_charges_posted: values.email_residents_on_charges_posted,
						management_fee_flat_fee: values.management_fee_flat_fee,
						unit_or_property_to_charge: values.unit_or_property_to_charge,
						automatically_end_agreement_on_move_out_date: values.automatically_end_agreement_on_move_out_date,
					};
					await handleItemSubmit(propertySettingsValues, 'property-settings')
					resetForm({});
					setStatus({ sent: true, msg: "Property Settings Saved!" })
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
					id="propertyUnitInputForm"
					onSubmit={handleSubmit}
				>
					<Grid container spacing={2}>
						{
							status && status.msg && (
								<CustomSnackbar
									variant={status.sent ? "success" : "error"}
									message={status.msg}
								/>
							)
						}
						<Grid item container spacing={4} direction="row">
							<Grid container item xs spacing={2} direction="column">
								<Grid item>
									<Typography variant="subtitle1">Late Rent Payments Fee Policy</Typography>
								</Grid>
								<Grid item>
									<FormControl error={errors.late_fee_policy_status && touched.late_fee_policy_status}>
										<FormControlLabel
											control={<Switch
												checked={values.late_fee_policy_status}
												onChange={handleChange}
												color="primary"
												name="late_fee_policy_status"
												inputProps={{ 'aria-label': 'Late fees checkbox' }}
											/>}
											label="Automatic Late Fees"
											labelPlacement="start"
										/>
									</FormControl>
									<Typography variant="body2" color="textSecondary">
										If automatic late fees are on, we will post late fees charges
										residents ledgers based on the settings below.
										</Typography>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										type="text"
										name="grace_period"
										label="Grace Period"
										id="grace_period"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.grace_period}
										error={errors.grace_period && touched.grace_period}
										helperText={touched.grace_period && errors.grace_period}
									/>
									<Typography variant="body2" color="textSecondary">
										Number of days after which late fees will be charged on resident accounts.
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1">Frequency &amp; Amount</Typography>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="late_fee_frequency"
										label="Charging Frequency"
										id="late_fee_frequency"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.late_fee_frequency}
										error={errors.late_fee_frequency && touched.late_fee_frequency}
										helperText={touched.late_fee_frequency && errors.late_fee_frequency}
									>
										<MenuItem key={"one_time_fee"} value={"one_time_fee"}>One-time fee</MenuItem>
										<MenuItem key={"daily"} value={"daily"}>Daily</MenuItem>
									</TextField>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										type="text"
										name="late_fee_amount"
										label="Fee Amount"
										id="late_fee_amount"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.late_fee_amount}
										error={errors.late_fee_amount && touched.late_fee_amount}
										helperText={touched.late_fee_amount && errors.late_fee_amount}
									/>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1">Late Fee Amount Limits</Typography>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										label="Fee Maximmum Amount"
										id="late_fee_max_amount"
										type="text"
										name="late_fee_max_amount"
										value={values.late_fee_max_amount}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.late_fee_max_amount && touched.late_fee_max_amount}
										helperText={touched.late_fee_max_amount && errors.late_fee_max_amount}
									/>
									<Typography variant="body2" color="textSecondary">
										Set maximmum monthly charge (per month)
										</Typography>
								</Grid>
							</Grid>
							<Grid container item xs spacing={2} direction="column">
								<Grid item>
									<Typography variant="subtitle1">
										Management Fee Policy
										</Typography>
								</Grid>
								<Grid item>
									<FormControl component="fieldset" color="primary" error={errors.management_fee_type && touched.management_fee_type}>
										<FormLabel component="legend">Fee Type</FormLabel>
										<RadioGroup aria-label="management fee type" name="management_fee_type" value={values.management_fee_type} onChange={handleChange}>
											<FormControlLabel value="flat_fee" control={<Radio />} label="Use Flat Fee" />
											<FormControlLabel value="income_percentage" control={<Radio />} label="Use Percentage of Income" />
										</RadioGroup>
									</FormControl>
								</Grid>
								{values.management_fee_type === 'flat_fee' ?
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											label="Management Fee"
											id="management_fee_flat_fee"
											name="management_fee_flat_fee"
											value={values.management_fee_flat_fee}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
											error={errors.management_fee_flat_fee && touched.management_fee_flat_fee}
											helperText={touched.management_fee_flat_fee && errors.management_fee_flat_fee}
										/>
									</Grid> : values.management_fee_type === 'income_percentage' ?
										<Grid item container direction="row" spacing={2}>
											<Grid item xs={12} md={6}>
												<TextField
													fullWidth
													variant="outlined"
													label="Income Percentage"
													id="management_fee_income_percentage"
													name="management_fee_income_percentage"
													value={values.management_fee_income_percentage}
													onChange={handleChange}
													onBlur={handleBlur}
													error={errors.management_fee_income_percentage && touched.management_fee_income_percentage}
													helperText={touched.management_fee_income_percentage && errors.management_fee_income_percentage}
												/>
											</Grid>
											<Grid item xs={12} md={6}>
												<TextField
													fullWidth
													select
													variant="outlined"
													label="Per Property or Per Unit"
													id="unit_or_property_to_charge"
													name="unit_or_property_to_charge"
													value={values.unit_or_property_to_charge}
													onChange={handleChange}
													onBlur={handleBlur}
													error={errors.unit_or_property_to_charge && touched.unit_or_property_to_charge}
													helperText={touched.unit_or_property_to_charge && errors.unit_or_property_to_charge}
												>
													<MenuItem key={1} value={"per_unit"}>Per Unit</MenuItem>
													<MenuItem key={2} value={"per_property"}>Per Property</MenuItem>
												</TextField>
											</Grid>
										</Grid>
										: null
								}
								<Grid item>
									<Typography variant="subtitle1">Email Notifications/Resident Communication</Typography>
								</Grid>
								<Grid item>
									<FormControl color="secondary" error={errors.email_residents_on_late_fees && touched.email_residents_on_late_fees}>
										<FormControlLabel
											control={
												<Checkbox
													checked={values.email_residents_on_late_fees}
													onChange={handleChange}
													name="email_residents_on_late_fees"
													color="primary"
												/>
											}
											label="Email residents once late fees are applied"
										/>
									</FormControl>
								</Grid>
								<Grid item>
									<FormControl color="secondary">
										<FormControlLabel
											control={
												<Checkbox
													checked={values.email_residents_on_charges_posted}
													onChange={handleChange}
													name="email_residents_on_charges_posted"
													color="primary"
												/>
											}
											label="Email tenants when charges are posted"
										/>
									</FormControl>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1">Automatic Move Outs</Typography>
								</Grid>
								<Grid item>
									<FormControl color="secondary">
										<FormControlLabel
											control={
												<Checkbox
													checked={values.automatically_end_agreement_on_move_out_date}
													onChange={handleChange}
													name="automatically_end_agreement_on_move_out_date"
													color="primary"
												/>
											}
											label="Automatically end agreements on move out dates"
										/>
									</FormControl>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							container
							direction="row"
							className={classes.buttonBox}
						>
							<Grid item>
								<Button
									type="submit"
									color="primary"
									variant="contained"
									size="medium"
									startIcon={<SaveIcon />}
									form="propertyUnitInputForm"
									disabled={isSubmitting}
								>
									Apply Changes
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
};

const mapStateToProps = (state) => {
	return {
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

PropertySettingsInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertySettingsInputForm);

export default withRouter(PropertySettingsInputForm);

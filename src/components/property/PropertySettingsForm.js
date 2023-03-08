import React, { useState } from "react";
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
import Switch from '@material-ui/core/Switch';
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
} from "../../actions/actions";
import { withRouter } from "react-router-dom";
import {
	getLateFeeFrequencyOptions,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";

const LATE_FEE_FREQUENCY_OPTIONS = getLateFeeFrequencyOptions();
const MANAGEMENT_FEES_ATTACH_OPTIONS = ['Per Property', 'Per Unit']

const PropertySettingsSchema = Yup.object().shape({
	property: Yup.string().trim().required("Property is Required"),
	grace_period: Yup.number().typeError('Grace Period days must be a number').default(0),
	late_fee_amount: Yup.number().typeError('Amount must be a number').required("Late Fee amount is required"),
	late_fee_frequency: Yup.string().trim().required("Frequency to charge fees is required"),
	late_fee_max_amount: Yup.number().typeError('Maximmum amount must be a number').default(0),
	management_fee_type: Yup.string().trim().required('Management Fee Type is required'),
	management_fee_income_percentage: Yup.number().when('management_fee_type',
		{ is: 'income_percentage', then: Yup.number().typeError('Percentage must be a number').required('Percentage is required') }),
	unit_or_property_to_charge: Yup.string().trim().when('management_fee_type',
		{ is: 'income_percentage', then: Yup.string().trim().required('Item to attach fees is required') }),
	management_fee_flat_fee: Yup.number().when('management_fee_type',
		{ is: 'flat_fee', then: Yup.number().typeError('Flat fee must be a number').required('Flat fee is required') }),
});


let PropertySettingsInputForm = (props) => {
	const { classes, currentUser, history, handleItemSubmit } = props
	const propertySettingsToEdit = props.propertySettingsToEdit || {};
	const propertyValues = {
		id: propertySettingsToEdit.id,
		property: propertySettingsToEdit.property || "",
		late_fee_max_amount: propertySettingsToEdit.late_fee_max_amount || "",
		grace_period: propertySettingsToEdit.grace_period || 0,
		late_fee_frequency: propertySettingsToEdit.late_fee_frequency || "",
		late_fee_amount: propertySettingsToEdit.late_fee_amount || "",
		late_fee_policy_status: propertySettingsToEdit.late_fee_policy_status || false,
		email_residents_on_late_fees: propertySettingsToEdit.email_residents_on_late_fees || true,
		management_fee_type: propertySettingsToEdit.management_fee_type || 'flat_fee',
		management_fee_income_percentage: propertySettingsToEdit.management_fee_income_percentage || '',
		management_fee_flat_fee: propertySettingsToEdit.management_fee_flat_fee || '',
		unit_or_property_to_charge: propertySettingsToEdit.unit_or_property_to_charge || '',
	};

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySettingsSchema}
			onSubmit={async (values, { resetForm }) => {
				let property_unit = {
					id: values.id,
					late_fee_max_amount: values.late_fee_max_amount,
					grace_period: values.grace_period,
					late_fee_frequency: values.late_fee_frequency,
					late_fee_policy_status: values.late_fee_policy_status,
					email_residents_on_late_fees: values.email_residents_on_late_fees,
					late_fee_amount: values.late_fee_amount,
					management_fee_type: values.management_fee_type,
				};
				await handleItemSubmit( property_unit, 'properties')
				resetForm({});
				if (values.id) {
					history.goBack();
				}
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
						id="propertyUnitInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container spacing={2}>
							<Grid item container spacing={4} direction="row">
								<Grid container item xs spacing={2} direction="column">
									<Grid item>
										<Typography variant="subtitle1">Late Fee Policy</Typography>
									</Grid>
									<Grid item>
										<FormControl>
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
										<Typography variant="body2" >
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
										<Typography variant="body2">
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
											label="Frequency"
											id="late_fee_frequency"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.late_fee_frequency}
											error={errors.late_fee_frequency && touched.late_fee_frequency}
											helperText={touched.late_fee_frequency && errors.late_fee_frequency}
										>
											{LATE_FEE_FREQUENCY_OPTIONS.map((late_fee_frequency, index) => (
												<MenuItem key={index} value={late_fee_frequency}>
													{late_fee_frequency}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											type="text"
											name="late_fee_amount"
											label="Amount"
											id="late_fee_amount"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.late_fee_amount}
											error={errors.late_fee_amount && touched.late_fee_amount}
											helperText={touched.late_fee_amount && errors.late_fee_amount}
										/>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">Limits</Typography>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											label="Late Fee Maximmum Amount"
											id="late_fee_max_amount"
											type="text"
											name="late_fee_max_amount"
											value={values.late_fee_max_amount}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.late_fee_max_amount && touched.late_fee_max_amount}
											helperText={touched.late_fee_max_amount && errors.late_fee_max_amount}
										/>
										<Typography variant="body2">
											Set maximmum monthly charge (per month)
										</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">Email Notifications/Resident Communication</Typography>
									</Grid>
									<Grid item>
										<FormControl>
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
								</Grid>
								<Grid container item xs spacing={2} direction="column">
									<Grid item>
										<Typography variant="subtitle1">
											Management Fee Policy
										</Typography>
									</Grid>
									<Grid item>
										<FormControl component="fieldset">
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
														{MANAGEMENT_FEES_ATTACH_OPTIONS.map((value, index) => (
															<MenuItem key={index} value={value}>
																{value}
															</MenuItem>
														))}
													</TextField>
												</Grid>
											</Grid>
											: null}
								</Grid>
							</Grid>
							<Grid
								item
								container
								direction="row"
								justify="center"
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
										form="propertyUnitInputForm"
										disabled={isSubmitting}
									>
										Save Settings
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
		properties: state.properties,
		error: state.error,
		contacts: state.contacts.filter(({ id }) => !state.propertyUnits.find((property_unit) => property_unit.tenants.includes(id))),
		currentUser: state.currentUser,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

PropertySettingsInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertySettingsInputForm);

export default withRouter(PropertySettingsInputForm);

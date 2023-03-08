import React from "react";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import { connect } from "react-redux";
import { Formik, FieldArray } from "formik";
import {
	handleItemFormSubmit,
	handleDelete,
} from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import {
	getLeaseOptions, getPaymentOptions
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import moment from "moment";

const LEASE_TYPES = getLeaseOptions();
const RENT_CYCLES = getPaymentOptions();
const defaultDate = moment().format("YYYY-MM-DD");

const UnitLeaseSchema = Yup.object().shape({
	lease_type: Yup.string().trim().required("Lease Type is Required"),
	rent_cycle: Yup.string().trim().required("Rent Cycle is Required"),
	tenant: Yup.string().trim().required("Unit Tenant is Required"),
	start_date: Yup.date().required('Start Date is Required'),
	rent_amount: Yup.number().typeError('Rent Amount must be number').min(0).required('Rent Amount is Required'),
	security_deposit: Yup.number().typeError('Security Deposit must be number').min(0),
	property: Yup.string().trim().required('Property is Required'),
	property_unit: Yup.string().trim().required('Unit is Required'),
	end_date: Yup.date().when('lease_type', { is: 'Fixed', then: Yup.date().required('End Date is Required') }),
	next_due_date: Yup.date().required('Next Due Date is Required'),
	security_deposit_due_date: Yup.date(),
	recurring_charges: Yup.array().of(Yup.object().shape({
		type: Yup.string().default('recurring_charge'),
		frequency: Yup.string().trim().required('Frequency to make charge is required'),
		due_date: Yup.date().required("Due Date is required"),
		account: Yup.string().trim().required("Account is required"),
		amount: Yup.number().typeError('Amount must be a number').integer().min(0).required('Charge Amount is required'),
	})),
	one_time_charges: Yup.array().of(Yup.object().shape({
		type: Yup.string().default('one_time_charge'),
		due_date: Yup.date().required("Due Date is required"),
		account: Yup.string().trim().required("Account is required"),
		amount: Yup.number().typeError('Amount must be a number').integer().min(0).required('Charge Amount is required'),
	})),
});


let UnitLeaseInputForm = (props) => {
	const classes = commonStyles();
	const { currentUser, contacts, history, properties, propertyUnits, handleItemSubmit } = props
	let propertyToEdit = typeof props.propertyToEdit !== 'undefined' ? props.propertyToEdit : {};
	const unitLeaseValues = {
		id: propertyToEdit.id,
		property_unit: propertyToEdit.property_unit || "",
		tenants: propertyToEdit.tenants || [],
		cosigner: propertyToEdit.cosigner || "",
		start_date: propertyToEdit.start_date || defaultDate,
		end_date: propertyToEdit.end_date || moment().add(1, 'M').format('YYYY-MM-DD'),
		next_due_date: propertyToEdit.next_due_date || moment().add(1, 'M').format('YYYY-MM-DD'),
		security_deposit_due_date: propertyToEdit.security_deposit_due_date || defaultDate,
		property: propertyToEdit.property || "",
		rent_amount: propertyToEdit.rent_amount || 0,
		security_deposit: propertyToEdit.security_deposit || 0,
		lease_type: propertyToEdit.lease_type || LEASE_TYPES[1],
		rent_cycle: propertyToEdit.rent_cycle || "Monthly",
		one_time_charges: propertyToEdit.one_time_charges || [],
		recurring_charges: propertyToEdit.recurring_charges || [],
	};

	const RecurringChargesInputComponent = ({ remove, push, form }) => {
		const { errors, touched, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['recurring_charges']
		const propertyUnitTouched = touched['recurring_charges']
		const layout = values.recurring_charges.map((unit_charge, unitChargeIndex) => {
			const indexInErrors = propertyUnitErrors && propertyUnitErrors[unitChargeIndex];
			const indexInTouched = propertyUnitTouched && propertyUnitTouched[unitChargeIndex];
			return (
				<Grid key={`unit_charge-${unitChargeIndex}`} container item direction="row" alignItems="center" spacing={2}>
					<Grid item xs={12} md key={`recurring_charges[${unitChargeIndex}].account`}>
						<TextField
							fullWidth
							label="Charge Name/Details"
							variant="outlined"
							type="text"
							value={unit_charge.account}
							name={`recurring_charges.${unitChargeIndex}.account`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'account' in indexInErrors) && (indexInTouched && indexInTouched.account)}
							helperText={(indexInTouched && indexInTouched.account) && (indexInErrors && indexInErrors.account)}
						/>
					</Grid>
					<Grid item xs={12} md key={`recurring_charges[${unitChargeIndex}].due_date`}>
						<TextField
							fullWidth
							variant="outlined"
							id="due_date"
							type="date"
							name={`recurring_charges.${unitChargeIndex}.due_date`}
							label="Next Due Date"
							value={unit_charge.due_date}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
							error={(indexInErrors && 'due_date' in indexInErrors) && (indexInTouched && indexInTouched.due_date)}
							helperText={(indexInTouched && indexInTouched.due_date) && (indexInErrors && indexInErrors.due_date)} />
					</Grid>
					<Grid item xs={12} md key={`recurring_charges[${unitChargeIndex}].amount`}>
						<TextField
							fullWidth
							label="Amount"
							variant="outlined"
							type="text"
							value={unit_charge.amount}
							name={`recurring_charges.${unitChargeIndex}.amount`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'amount' in indexInErrors) && (indexInTouched && indexInTouched.amount)}
							helperText={(indexInTouched && indexInTouched.amount) && (indexInErrors && indexInErrors.amount)}
						/>
					</Grid>
					<Grid item xs={12} md key={`recurring_charges[${unitChargeIndex}].frequency`}>
						<TextField
							fullWidth
							variant="outlined"
							select
							name={`recurring_charges.${unitChargeIndex}.frequency`}
							label="Frequency"
							onBlur={handleBlur}
							onChange={handleChange}
							value={unit_charge.frequency}
							error={(indexInErrors && 'frequency' in indexInErrors) && (indexInTouched && indexInTouched.frequency)}
							helperText={(indexInTouched && indexInTouched.frequency) && (indexInErrors && indexInErrors.frequency)}
						>
							{RENT_CYCLES.map((frequency, index) => (
								<MenuItem key={index} value={frequency}>
									{frequency}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item key={`recurring_charges[${unitChargeIndex}].delete`}>
						<IconButton aria-label="delete"
							onClick={() => { remove(unitChargeIndex) }}
							size="medium">
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>

			)
		})
		return <Grid item container direction="column" spacing={2}>
			{layout}
			<Grid item>
				<Button
					className={classes.oneMarginTopBottom}
					variant="outlined"
					size="medium"
					onClick={() => push({ type: 'recurring_charge', due_date: moment().add(1, 'M').format('YYYY-MM-DD'), account: '', amount: '', frequency: "Monthly" })}
					disableElevation>
					Add Recurring Charge
				</Button>
			</Grid>
		</Grid>
	}

	const OneTimeChargesComponent = ({ remove, push, form }) => {
		const { errors, touched, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['one_time_charges']
		const propertyUnitTouched = touched['one_time_charges']
		const layout = values.one_time_charges.map((unit_charge, unitChargeIndex) => {
			const indexInErrors = propertyUnitErrors && propertyUnitErrors[unitChargeIndex];
			const indexInTouched = propertyUnitTouched && propertyUnitTouched[unitChargeIndex];
			return (
				<Grid key={`one_time_charges-${unitChargeIndex}`} container item direction="row" alignItems="center" spacing={2}>
					<Grid item xs={12} md key={`one_time_charges[${unitChargeIndex}].account`}>
						<TextField
							fullWidth
							label="Charge Name/Details"
							variant="outlined"
							type="text"
							value={unit_charge.account}
							name={`one_time_charges.${unitChargeIndex}.account`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'account' in indexInErrors) && (indexInTouched && indexInTouched.account)}
							helperText={(indexInTouched && indexInTouched.account) && (indexInErrors && indexInErrors.account)}
						/>
					</Grid>
					<Grid item xs={12} md key={`one_time_charges[${unitChargeIndex}].due_date`}>
						<TextField
							fullWidth
							variant="outlined"
							id="due_date"
							type="date"
							name={`one_time_charges.${unitChargeIndex}.due_date`}
							label="Due Date"
							value={unit_charge.due_date}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
							error={(indexInErrors && 'due_date' in indexInErrors) && (indexInTouched && indexInTouched.due_date)}
							helperText={(indexInTouched && indexInTouched.due_date) && (indexInErrors && indexInErrors.due_date)}
						/>
					</Grid>
					<Grid item xs={12} md key={`one_time_charges[${unitChargeIndex}].amount`}>
						<TextField
							fullWidth
							label="Amount"
							variant="outlined"
							type="text"
							value={unit_charge.amount}
							name={`one_time_charges.${unitChargeIndex}.amount`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'amount' in indexInErrors) && (indexInTouched && indexInTouched.amount)}
							helperText={(indexInTouched && indexInTouched.amount) && (indexInErrors && indexInErrors.amount)}
						/>
					</Grid>
					<Grid item key={`one_time_charges[${unitChargeIndex}].delete`}>
						<IconButton aria-label="delete"
							onClick={() => { remove(unitChargeIndex) }}
							size="medium">
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>

			)
		})
		return <Grid item container direction="column" spacing={2}>
			{layout}
			<Grid item>
				<Button
					className={classes.oneMarginTopBottom}
					variant="outlined"
					size="medium"
					onClick={() => push({ type: 'one_time_charge', due_date: moment().add(1, 'M').format('YYYY-MM-DD'), account: '', amount: '' })}
					disableElevation>
					Add One Time Charge
				</Button>
			</Grid>
		</Grid>
	}


	return (
		<Formik
			initialValues={unitLeaseValues}
			enableReinitialize validationSchema={UnitLeaseSchema}
			onSubmit={async (values, { resetForm }) => {
				const unit_charges = []
				unit_charges.push([...values.one_time_charges, ...values.recurring_charges])
				let propertyUnitLease = {
					id: values.id,
					tenant: values.tenant,
					cosigner: values.cosigner,
					end_date: values.end_date,
					next_due_date: values.next_due_date,
					security_deposit: values.security_deposit,
					security_deposit_due_date: values.security_deposit_due_date,
					property: values.property,
					start_date: values.start_date,
					rent_amount: values.rent_amount,
					lease_type: values.lease_type,
					rent_cycle: values.rent_cycle,
					property_unit: values.property_unit,
				};
				await handleItemSubmit(currentUser, propertyUnitLease, "leases")
				unit_charges.forEach(async (unitCharge) => {
					const unitChargeToSave = Object.assign({}, unitCharge, { unit_id: values.property_unit })
					await handleItemSubmit(currentUser, unitChargeToSave, 'unit_charges')
				})
				resetForm({});
			}}
		>
			{({
				values,
				handleSubmit,
				errors,
				touched,
				handleChange,
				setFieldValue,
				handleBlur,
				isSubmitting,
			}) => (
					<form
						className={classes.form}
						method="post"
						id="propertyInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container spacing={1} direction="column">
							<Grid item>
								<Typography variant="subtitle1" component="h2">
									Lease Details
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="Property"
										variant="outlined"
										id="property"
										select
										name="property"
										value={values.property}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.property && touched.property}
										helperText={touched.property && errors.property}
									>
										{properties.map((property, index) => (
											<MenuItem key={index} value={property.id}>
												{property.ref}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										select
										variant="outlined"
										id="property_unit"
										name="property_unit"
										label="Unit"
										value={values.property_unit}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.property_unit && touched.property_unit}
										helperText={touched.property_unit && errors.property_unit}
									>
										{/* This requires some additional changes */}
										{propertyUnits.filter((property_unit) => property_unit.property_id === values.property).map((unit, index) => (
											<MenuItem key={index} value={unit.id}>
												{unit.ref}
											</MenuItem>
										))}
									</TextField>
								</Grid>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item xs={12} md={4}>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="lease_type"
										label="Lease Type"
										id="lease_type"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.lease_type}
										error={errors.lease_type && touched.lease_type}
										helperText={touched.lease_type && errors.lease_type}
									>
										{LEASE_TYPES.map((lease_type, index) => (
											<MenuItem key={index} value={lease_type}>
												{lease_type}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item container xs={12} md={8} direction="row" alignItems="center" justify="center" spacing={2}>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											variant="outlined"
											label="Start Date"
											error={'start_date' in errors}
											helperText={errors.start_date}
											id="start_date"
											type="date"
											name="start_date"
											value={values.start_date}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											variant="outlined"
											id="end_date"
											type="date"
											name="end_date"
											label="End Date"
											value={values.end_date}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
											error={errors.end_date && touched.end_date}
											helperText={touched.end_date && errors.end_date}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="h2">
									Tenants and Cosigner
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={4}>
								<Grid item xs={12} md={6}>
									<FormControl
										variant="outlined"
										fullWidth
										className={classes.formControl}
									>
										<InputLabel id="demo-simple-select-outlined-label">
											Tenants
										</InputLabel>
										<Select
											fullWidth
											multiple
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											name="tenant"
											label="Tenants"
											value={values.tenants}
											onChange={(event) =>
												setFieldValue("tenants", event.target.value)
											}
											onBlur={handleBlur}
											renderValue={(selectedContacts) => {
												const contactsWithDetails = contacts.filter(
													({ id }) =>
														selectedContacts.includes(id)
												);
												return contactsWithDetails.map(
													(selectedContact, index) => (
														<Chip
															color="primary"
															key={index}
															label={
																selectedContact.first_name +
																" " +
																selectedContact.last_name
															}
															className={classes.chip}
														/>
													)
												);
											}}
										>
											{contacts.map((contact, contactIndex) => (
												<MenuItem key={contactIndex} value={contact.id}>
													{contact.first_name +
														" " +
														contact.last_name}
												</MenuItem>
											))}
										</Select>
										<FormHelperText>Select Tenants</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										select
										error={errors.cosigner && touched.cosigner}
										helperText={"Unit Tenancy Cosigner"}
										variant="outlined"
										name="cosigner"
										id="cosigner"
										label="Cosigner"
										value={values.cosigner}
										onChange={handleChange}
										onBlur={handleBlur}
									>
										{contacts.map((contact, index) => (
											<MenuItem key={index} value={contact.id}>
												{contact.first_name + ' ' + contact.last_name}
											</MenuItem>
										))}
									</TextField>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="h2">
									Rent
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="rent_cycle"
										label="Rent Cycle"
										id="rent_cycle"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.rent_cycle}
										error={errors.rent_cycle && touched.rent_cycle}
										helperText={touched.rent_cycle && errors.rent_cycle || 'Frequency at which rent is charged on unit'
										}
									>
										{RENT_CYCLES.map((rent_cycle, index) => (
											<MenuItem key={index} value={rent_cycle}>
												{rent_cycle}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										label="Rent Amount"
										id="rent_amount"
										type="text"
										name="rent_amount"
										value={values.rent_amount}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
										error={errors.rent_amount && touched.rent_amount}
										helperText={touched.rent_amount && errors.rent_amount}
									/>
								</Grid>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										id="next_due_date"
										type="date"
										name="next_due_date"
										label="Next Due Date"
										value={values.next_due_date}
										error={errors.next_due_date && touched.next_due_date}
										helperText={touched.next_due_date && errors.next_due_date || 'Next date when the rent is due'}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="h2" paragraph>
									Security Deposit
								</Typography>
							</Grid>
							<Grid item container direction="row" alignItems="center" spacing={2}>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										id="security_deposit_due_date"
										type="date"
										name="security_deposit_due_date"
										label="Due Date"
										value={values.security_deposit_due_date}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										id="security_deposit"
										label="Security Deposit"
										name="security_deposit"
										value={values.security_deposit}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.security_deposit && touched.security_deposit}
										helperText={touched.security_deposit && errors.security_deposit}
									/>
								</Grid>
								<Grid item xs>
									<Typography variant='body1' color="textSecondary">Don't forget to record the payment once you have collected the deposit.</Typography>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="h2">
									Charges
								</Typography>
							</Grid>
							<Grid item container direction="column" spacing={1}>
								<Grid item>
									<Typography variant="subtitle2">
										Recurring Charges
								</Typography>
								</Grid>
								<Grid item container>
									<FieldArray
										name="recurring_charges"
										component={RecurringChargesInputComponent}
									/>
								</Grid>
								<Grid item >
									<Typography variant="subtitle2">
										One Time Charges
								</Typography>
								</Grid>
								<Grid item container>
									<FieldArray
										name="one_time_charges"
										component={OneTimeChargesComponent}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								container
								justify="center"
								direction="row"
								className={classes.buttonBox}
							>
								<Grid item>
									<Button
										color="secondary"
										variant="contained"
										size="medium"
										startIcon={<CancelIcon />}
										onClick={() => { history.goBack() }}
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
										form="propertyInputForm"
										disabled={isSubmitting}
									>
										Add Lease
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
		contacts: state.contacts,
		properties: state.properties,
		error: state.error,
		propertyUnits: state.propertyUnits,
		// contacts: state.contacts.filter(({ id }) => !state.properties.find((property) => property.tenants.includes(id))),
		currentUser: state.currentUser,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (user, item, url) => dispatch(handleItemFormSubmit(user, item, url)),
	};
};

UnitLeaseInputForm = connect(mapStateToProps, mapDispatchToProps)(UnitLeaseInputForm);

export default withRouter(UnitLeaseInputForm);

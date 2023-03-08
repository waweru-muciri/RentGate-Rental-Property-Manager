import React from "react";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
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

const LEASE_TYPES = getLeaseOptions();
const RENT_CYCLES = getPaymentOptions();

const PropertySchema = Yup.object().shape({
	lease_type: Yup.string().trim().required("Lease Type is Required"),
	rent_cycle: Yup.string().trim().required("Rent Cycle is Required"),
	tenant: Yup.string().trim().required("Unit Tenant is Required"),
	start_date: Yup.date().required('Start Date is Required'),
	transaction_price: Yup.number().typeError('Rent Amount must be number').min(0).required('Rent Amount is Required'),
	security_deposit: Yup.number().typeError('Security Deposit must be number').min(0),
	property: Yup.string().trim().required('Property is Required'),
	property_unit: Yup.string().trim().required('Unit is Required'),
	end_date: Yup.date().required('End Date is Required'),
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
		type: Yup.string().default('one_time_charges'),
		due_date: Yup.date().required("Due Date is required"),
		account: Yup.string().trim().required("Account is required"),
		amount: Yup.number().typeError('Amount must be a number').integer().min(0).required('Charge Amount is required'),
	})),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};


let UnitLeaseInputForm = (props) => {
	const classes = commonStyles();
	const { currentUser, contacts, propertyAccounts, history, properties, propertyUnits, handleItemSubmit } = props
	let propertyToEdit = typeof props.propertyToEdit !== 'undefined' ? props.propertyToEdit : {};
	const propertyValues = {
		id: propertyToEdit.id,
		account: propertyToEdit.account || "",
		tenants: propertyToEdit.tenants || [],
		cosigner: propertyToEdit.cosigner || "",
		end_date: propertyToEdit.end_date || "",
		next_due_date: propertyToEdit.next_due_date || "",
		security_deposit_due_date: propertyToEdit.security_deposit_due_date || "",
		property: propertyToEdit.property || "",
		start_date: propertyToEdit.start_date || "",
		transaction_price: propertyToEdit.transaction_price || 0,
		lease_type: propertyToEdit.lease_type || "",
		rent_cycle: propertyToEdit.rent_cycle || "",
		one_time_charges: propertyToEdit.one_time_charges || [],
		recurring_charges: propertyToEdit.recurring_charges || [],
		property_unit: propertyToEdit.property_unit || "",
	};

	const RecurringChargesInputComponent = ({ remove, push, form }) => {
		const { errors, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['recurring_charges']
		const layout = values.recurring_charges.map((unit_charge, unitChargeIndex) =>
			<Grid key={`unit_charge-${unitChargeIndex}`} container item direction="row" alignItems="center" spacing={2}>
				<Grid xs item key={`recurring_charges[${unitChargeIndex}].account`}>
					<TextField
						fullWidth
						label="Account"
						variant="outlined"
						select
						value={unit_charge.account}
						name={`recurring_charges.${unitChargeIndex}.account`}
						error={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['account'] !== 'undefined'}
						helperText={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].account || "Account to record the charge"}
						onChange={handleChange}
						onBlur={handleBlur}>
							{propertyAccounts.map((account, index) => (
							<MenuItem key={index} value={account.id}>
								{account.name}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid xs item key={`recurring_charges[${unitChargeIndex}].due_date`}>
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
						error={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['due_date'] !== 'undefined'}
						helperText={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].due_date || 'Next date when the charge is due'}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid xs item key={`recurring_charges[${unitChargeIndex}].amount`}>
					<TextField
						label="Amount"
						variant="outlined"
						type="text"
						value={unit_charge.amount}
						name={`recurring_charges.${unitChargeIndex}.amount`}
						error={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['amount'] !== 'undefined'}
						helperText={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].amount || 'Amount to charge'}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Grid>
				<Grid xs item key={`recurring_charges[${unitChargeIndex}].frequency`}>
					<TextField
						fullWidth
						variant="outlined"
						select
						name={`recurring_charges.${unitChargeIndex}.frequency`}
						defaultValue='Monthly'
						label="Frequency"
						onBlur={handleBlur}
						onChange={handleChange}
						value={unit_charge.frequency}
						error={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['frequency'] !== 'undefined'}
						helperText={'recurring_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].frequency || 'How often to make the charge'}
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
		return <Grid item container direction="column" spacing={2}>
			{layout}
			<Grid item>
				<Button
					className={classes.oneMarginTopBottom}
					variant="outlined"
					size="medium"
					onClick={() => push({ type: 'recurring_charge', due_date: '', account: '', amount: '' })}
					disableElevation>
					Add Recurring Charge
				</Button>
			</Grid>
		</Grid>
	}

	const OneTimeChargesComponent = ({ remove, push, form }) => {
		const { errors, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['one_time_charges']
		const layout = values.one_time_charges.map((unit_charge, unitChargeIndex) =>
			<Grid key={`one_time_charges-${unitChargeIndex}`} container item direction="row" alignItems="center" spacing={2}>
				<Grid xs item key={`one_time_charges[${unitChargeIndex}].account`}>
					<TextField
						fullWidth
						label="Account"
						variant="outlined"
						select
						value={unit_charge.account}
						name={`one_time_charges.${unitChargeIndex}.account`}
						error={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['account'] !== 'undefined'}
						helperText={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].account || 'Account to record charge'}
						onChange={handleChange}
						onBlur={handleBlur}>
							{propertyAccounts.map((account, index) => (
							<MenuItem key={index} value={account.id}>
								{account.name}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid xs item key={`one_time_charges[${unitChargeIndex}].due_date`}>
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
						error={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['due_date'] !== 'undefined'}
						helperText={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].due_date || 'Next date when the charge is due'}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid xs item key={`one_time_charges[${unitChargeIndex}].amount`}>
					<TextField
						fullWidth
						label="Amount"
						variant="outlined"
						type="text"
						value={unit_charge.amount}
						name={`one_time_charges.${unitChargeIndex}.amount`}
						error={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && typeof propertyUnitErrors[unitChargeIndex]['amount'] !== 'undefined'}
						helperText={'one_time_charges' in errors && typeof propertyUnitErrors[unitChargeIndex] !== 'undefined' && propertyUnitErrors[unitChargeIndex].amount || 'Amount to charge'}
						onChange={handleChange}
						onBlur={handleBlur}
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
		return <Grid item container direction="column" spacing={2}>
			{layout}
			<Grid item>
				<Button
					className={classes.oneMarginTopBottom}
					variant="outlined"
					size="medium"
					onClick={() => push({ type: 'one_time_charge', due_date: '', account: '', amount: '' })}
					disableElevation>
					Add One Time Charge
				</Button>
			</Grid>
		</Grid>
	}


	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={(values, { resetForm }) => {
				let property = {
					id: values.id,
					tenant: values.tenant,
					cosigner: values.cosigner,
					account: values.account,
					end_date: values.end_date,
					next_due_date: values.next_due_date,
					security_deposit_due_date: values.security_deposit_due_date,
					property: values.property,
					start_date: values.start_date,
					transaction_price: values.transaction_price,
					lease_type: values.lease_type,
					rent_cycle: values.rent_cycle,
					property_unit: values.property_unit,
				};
				handleItemSubmit(currentUser, property, "properties").then((propertyId) => {
					values.unit_charges.forEach((property_unit) => {
						const propertyUnitToSave = Object.assign({}, property_unit, { property_id: propertyId })
						handleItemSubmit(currentUser, propertyUnitToSave, 'unit_charges')
					})
					resetForm({});
				});
			}}
		>
			{({
				values,
				handleSubmit,
				errors,
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
								<Typography variant="subtitle1">
									Lease Details
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item sm>
									<TextField
										fullWidth
										label="Property"
										variant="outlined"
										id="property"
										select
										name="property"
										error={'property' in errors}
										helperText={errors.property}
										value={values.property}
										onChange={handleChange}
										onBlur={handleBlur}>
										{properties.map((property, index) => (
											<MenuItem key={index} value={property.id}>
												{property.ref}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item sm>
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
										helperText={errors.property_unit}
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
								<Grid item sm>
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
										error={'lease_type' in errors}
										helperText={
											errors.lease_type
										}
									>
										{LEASE_TYPES.map((lease_type, index) => (
											<MenuItem key={index} value={lease_type}>
												{lease_type}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item container md direction="row" alignItems="center" spacing={2}>
									<Grid item sm>
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
									<Grid item>~</Grid>
									<Grid item sm>
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
											error={'end_date' in errors}
											helperText={errors.end_date}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">
									Tenants and Cosigner
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item sm>
									<FormControl fullWidth className={classes.selectFormControl}>
										<InputLabel id="demo-mutiple-chip-label">Tenants</InputLabel>
										<Select
											labelId="demo-mutiple-chip-label"
											id="demo-mutiple-chip"
											multiple
											value={values.tenants}
											onChange={(event) => { setFieldValue("tenants", event.target.value) }}
											input={<Input id="select-multiple-chip" />}
											renderValue={(selected) => {
												const contactsWithDetails = contacts.filter(
													({ id }) =>
														selected.includes(id)
												);
												return (
													<div className={classes.selectChips}>
														{contactsWithDetails.map((value) => (
															<Chip key={value.id} label={value.first_name + ' ' + value.last_name}
																className={classes.selectChip} />
														))}
													</div>
												)
											}}
											MenuProps={MenuProps}
										>
											{contacts.map((contact, index) => (
												<MenuItem key={index} value={contact.id}>
													{contact.first_name + ' ' + contact.last_name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item sm>
									<TextField
										fullWidth
										select
										error={'cosigner' in errors}
										helperText={"Unit Tenancy Cosinger"}
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
								<Typography variant="subtitle1">
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
										error={'rent_cycle' in errors}
										helperText={
											errors.rent_cycle || 'Frequency at which rent is charged on unit'
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
										error={'transaction_price' in errors}
										helperText={errors.transaction_price}
										id="transaction_price"
										type="text"
										name="transaction_price"
										value={values.transaction_price}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
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
										error={'next_due_date' in errors}
										helperText={errors.next_due_date || 'Next date when the rent is due'}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" paragraph>
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
										error={'security_deposit' in errors}
										helperText={
											errors.security_deposit
										}
									/>
								</Grid>
								<Grid item xs>
								 <Typography variant='body' color="textSecondary">Don't forget to record the payment once you have collected the deposit.</Typography>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" paragraph>
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
								<Button
									type="submit"
									color="primary"
									variant="contained"
									size="medium"
									startIcon={<SaveIcon />}
									form="propertyInputForm"
									disabled={isSubmitting}
								>
									Save
								</Button>
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
		propertyAccounts: state.propertyAccounts,
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

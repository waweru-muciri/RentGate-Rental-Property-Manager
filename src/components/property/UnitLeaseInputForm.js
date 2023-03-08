import React, { useEffect, useState } from "react";
import ChargesTable from './ChargesTable'
import ChargeInputModal from './ChargeInputModal'
import Typography from "@material-ui/core/Typography";
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
import AddIcon from "@material-ui/icons/Add";
import { connect } from "react-redux";
import { Formik } from "formik";
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
import { addMonths, format, startOfToday } from "date-fns";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const LEASE_TYPES = getLeaseOptions();
const RENT_CYCLES = getPaymentOptions();

const recurringChargesTableHeadCells = [
	{ id: "type", numeric: false, disablePadding: true, label: "Charge Type" },
	{ id: "account", numeric: false, disablePadding: true, label: "Charge Name" },
	{ id: "due_date", numeric: false, disablePadding: true, label: "Next Due Date" },
	{ id: "amount", numeric: false, disablePadding: true, label: "Amount" },
	{ id: "frequency", numeric: false, disablePadding: true, label: "Frequency" },
	{ id: "edit", numeric: false, disablePadding: true, label: "Edit" },
	{ id: "delete", numeric: false, disablePadding: true, label: "Delete" },
]

const UnitLeaseSchema = Yup.object().shape({
	lease_type: Yup.string().trim().required("Lease Type is Required"),
	rent_cycle: Yup.string().trim().required("Rent Cycle is Required"),
	tenants: Yup.array().required("Unit Tenant is Required"),
	start_date: Yup.date().required('Start Date is Required'),
	rent_amount: Yup.number().typeError('Rent Amount must be number').min(0).required('Rent Amount is Required'),
	security_deposit: Yup.number().typeError('Security Deposit must be number').min(0),
	property_id: Yup.string().trim().required('Property is Required'),
	unit_id: Yup.string().trim().required('Unit is Required'),
	end_date: Yup.date().when('lease_type', { is: 'Fixed', then: Yup.date().required('End Date is Required') }),
	rent_due_date: Yup.date().required('Next Due Date is Required'),
	security_deposit_due_date: Yup.date(),
});


let UnitLeaseInputForm = (props) => {
	const classes = commonStyles();
	const { contacts, history, properties, propertyUnits, propertyUnitCharges, handleItemSubmit, handleItemDelete } = props
	const [propertyUnitChargesItems, setpropertyUnitChargesItems] = useState([])
	let leaseToEdit = props.leaseToEdit || {};
	const unitLeaseValues = {
		id: leaseToEdit.id,
		property_id: leaseToEdit.property_id || "",
		unit_id: leaseToEdit.unit_id || "",
		tenants: leaseToEdit.tenants || [],
		cosigner: leaseToEdit.cosigner || "",
		start_date: leaseToEdit.start_date || defaultDate,
		end_date: leaseToEdit.end_date || '',
		rent_due_date: leaseToEdit.rent_due_date || format(addMonths(startOfToday(), 1), 'yyyy-MM-dd'),
		security_deposit_due_date: leaseToEdit.security_deposit_due_date || defaultDate,
		rent_amount: leaseToEdit.rent_amount || '',
		security_deposit: leaseToEdit.security_deposit || 0,
		lease_type: leaseToEdit.lease_type || LEASE_TYPES[1],
		rent_cycle: leaseToEdit.rent_cycle || "Monthly",
		unit_charges :	propertyUnitChargesItems.filter((unit_charge) => unit_charge.unit_id === leaseToEdit.unit_id)
	};

	useEffect(() => {
		setpropertyUnitChargesItems(propertyUnitCharges)
	}, [propertyUnitCharges])


	const defaultChargeValues = {
		unit_id: leaseToEdit.unit_id,
		frequency: '',
		amount: '',
		due_date: defaultDate,
		account: '',
		type: 'recurring_charge',
	}

	const [modalOpenState, toggleModalState] = useState(false)
	const [chargeToEdit, setChargeToEdit] = useState(defaultChargeValues)


	const handleModalStateToggle = () => {
		toggleModalState(!modalOpenState)
	}

	const handleEditClick = (rowId) => {
		setChargeToEdit(unitLeaseValues.unit_charges.find(({ id }) => id === rowId) || defaultChargeValues)
		handleModalStateToggle()
	}
	return (
		<Formik
			initialValues={unitLeaseValues}
			enableReinitialize validationSchema={UnitLeaseSchema}
			onSubmit={async (values, { resetForm }) => {
				let propertyUnitLease = {
					id: values.id,
					property_id: values.property_id,
					unit_id: values.unit_id,
					lease_type: values.lease_type,
					rent_cycle: values.rent_cycle,
					tenants: values.tenants,
					cosigner: values.cosigner,
					start_date: values.start_date,
					end_date: values.end_date,
					rent_due_date: values.rent_due_date,
					security_deposit: values.security_deposit,
					security_deposit_due_date: values.security_deposit_due_date,
					rent_amount: values.rent_amount,
				};
				await handleItemSubmit(propertyUnitLease, "leases")
				if (!values.id) {
					//post charges for rent and  security deposit 
					const tenant = contacts.find(({ id }) => id === values.tenants[0]) || {}
					const newRentCharge = {
						charge_amount: values.rent_amount,
						charge_date: defaultDate,
						charge_label: "Rent",
						charge_type: "rent",
						due_date: defaultDate,
						tenant_id: tenant.id,
						tenant_name: `${tenant.first_name} ${tenant.last_name}`,
						unit_id: values.unit_id,
					}
					const newSecurityDepositCharge = {
						charge_amount: values.rent_amount,
						charge_date: defaultDate,
						charge_label: "Security Deposit",
						charge_type: "security_deposit",
						due_date: defaultDate,
						tenant_id: tenant.id,
						tenant_name: `${tenant.first_name} ${tenant.last_name}`,
						unit_id: values.unit_id,
					}
					await handleItemSubmit(newRentCharge, 'transactions-charges')
					await handleItemSubmit(newSecurityDepositCharge, 'transactions-charges')
				}
				if(values.id){
					history.goBack()
				}
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
						id="unitLeaseInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container spacing={1} direction="column">
							<Grid item>
								<Typography variant="subtitle1" component="h2">
									Agreement Details
								</Typography>
							</Grid>
							<Grid item container direction="row" spacing={2}>
								<Grid item xs={12} md={6}>
									<TextField
										fullWidth
										label="Property"
										variant="outlined"
										id="property_id"
										select
										name="property_id"
										value={values.property_id}
										onChange={(event) => {
											setFieldValue('property_id', event.target.value)
											setFieldValue('unit_id', '')
										}}
										onBlur={handleBlur}
										error={errors.property_id && touched.property_id}
										helperText={touched.property_id && errors.property_id}
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
										id="unit_id"
										name="unit_id"
										label="Unit"
										value={values.unit_id}
										onChange={(event) => {
											setFieldValue('unit_id', event.target.value)
											setFieldValue('unit_charges', propertyUnitChargesItems.filter(({ unit_id }) => unit_id === event.target.value)
											)
										}}
										onBlur={handleBlur}
										error={errors.unit_id && touched.unit_id}
										helperText={touched.unit_id && errors.unit_id}
									>
										{/* This requires some additional changes */}
										{propertyUnits.filter(({ property_id }) => property_id === values.property_id).map((unit, index) => (
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
										id="rent_due_date"
										type="date"
										name="rent_due_date"
										label="Next Due Date"
										value={values.rent_due_date}
										error={errors.rent_due_date && touched.rent_due_date}
										helperText={touched.rent_due_date && errors.rent_due_date || 'Next date when the rent is due'}
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
											id="tenants"
											name="tenants"
											label="Tenants"
											error={errors.tenants && touched.tenants}
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
															label={`
																${selectedContact.first_name} ${selectedContact.last_name}`
															}
															className={classes.chip}
														/>
													)
												);
											}}
										>
											{contacts.map((contact, contactIndex) => (
												<MenuItem key={contactIndex} value={contact.id}>
													{contact.first_name} {contact.last_name}
												</MenuItem>
											))}
										</Select>
										<FormHelperText error={errors.tenants && touched.tenants}>Select Tenants</FormHelperText>
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
												{contact.first_name} {contact.last_name}
											</MenuItem>
										))}
									</TextField>
								</Grid>
							</Grid>
							<Grid item container direction="column" spacing={2}>
								<Grid item>
									<Typography variant="subtitle1">Unit Charges</Typography>
								</Grid>
								<Grid item>
									<ChargesTable
										rows={values.unit_charges}
										headCells={recurringChargesTableHeadCells}
										handleEditClick={handleEditClick}
										handleItemSubmit={handleItemSubmit}
										handleDelete={handleItemDelete}
										deleteUrl={"unit-charges"} />
									{
										modalOpenState ? <ChargeInputModal open={modalOpenState}
											handleClose={handleModalStateToggle} history={history}
											handleItemSubmit={handleItemSubmit}
											chargeValues={chargeToEdit} /> : null
									}
								</Grid>
								<Grid item>
									<Button
										className={classes.oneMarginTopBottom}
										variant="outlined"
										size="medium"
										startIcon={<AddIcon />}
										onClick={() => {
											setChargeToEdit({ ...defaultChargeValues, unit_id: values.unit_id })
											if (values.unit_id) {
												handleModalStateToggle()
											}
										}}
										disableElevation>
										Add Charge
									</Button>
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
										form="unitLeaseInputForm"
										disabled={isSubmitting}
									>
										{values.id ? "Edit Lease" : "Add Lease"}
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
		propertyUnitCharges: state.propertyUnitCharges,
		// contacts: state.contacts.filter(({ id }) => !state.properties.find((property) => property.tenants.includes(id))),
		currentUser: state.currentUser,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

UnitLeaseInputForm = connect(mapStateToProps, mapDispatchToProps)(UnitLeaseInputForm);

export default withRouter(UnitLeaseInputForm);

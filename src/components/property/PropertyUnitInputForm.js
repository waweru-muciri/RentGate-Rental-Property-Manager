import React, { useState } from "react";
import ChargesTable from './ChargesTable'
import ChargeInputModal from './ChargeInputModal'
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
	handleDelete,
	uploadFilesToFirebase,
} from "../../actions/actions";
import { commonStyles } from "../commonStyles";
import { withRouter } from "react-router-dom";
import {
	getUnitTypes,
	getPropertyBeds,
	getPropertyBaths,
	getLeaseOptions, getPaymentOptions
} from "../../assets/commonAssets.js";
import * as Yup from "yup";

const UNIT_TYPES = getUnitTypes();
const PROPERTY_BEDS = getPropertyBeds();
const PROPERTY_BATHS = getPropertyBaths();
const LEASE_TYPES = getLeaseOptions();
const RENT_CYCLES = getPaymentOptions();

const recurringChargesTableHeadCells = [
	{ id: "type", numeric: false, disablePadding: true, label: "Charge Type" },
	{ id: "account", numeric: false, disablePadding: true, label: "Charge Details" },
	{ id: "due_date", numeric: false, disablePadding: true, label: "Next Due Date" },
	{ id: "amount", numeric: false, disablePadding: true, label: "Amount" },
	{ id: "frequency", numeric: false, disablePadding: true, label: "Frequency" },
	{ id: "edit", numeric: false, disablePadding: true, label: "Edit" },
	{ id: "delete", numeric: false, disablePadding: true, label: "Delete" },
]

const PropertySchema = Yup.object().shape({
	property_id: Yup.string().trim().required("Property is Required"),
	unit_type: Yup.string().trim().required("Unit Type is Required"),
	baths: Yup.string().trim().required("Baths is Required"),
	beds: Yup.string().trim().required("Beds is required"),
	ref: Yup.string().trim().required("Unit Ref Required"),
	sqft: Yup.number().typeError('Sqft must be a number').min(0).default(0),
	address: Yup.string().trim().required('Address is Required'),
	rent_cycle: Yup.string().trim().required('Frequency to charge rent on unit is required'),
});


let PropertyUnitInputForm = (props) => {
	const classes = commonStyles();
	const { properties, propertyUnitCharges, currentUser, contacts, history, handleItemDelete, handleItemSubmit } = props
	let propertyUnitToEdit = typeof props.propertyUnitToEdit !== 'undefined' ? props.propertyUnitToEdit : {};
	const propertyValues = {
		id: propertyUnitToEdit.id,
		ref: propertyUnitToEdit.ref || "",
		property_id: propertyUnitToEdit.property_id || "",
		address: propertyUnitToEdit.address || "",
		unit_type: propertyUnitToEdit.unit_type || "",
		beds: propertyUnitToEdit.beds || "",
		baths: propertyUnitToEdit.baths || "",
		sqft: propertyUnitToEdit.sqft || '',
		lease_type: propertyUnitToEdit.lease_type || "",
		rent_cycle: propertyUnitToEdit.rent_cycle || "",
		tenants: propertyUnitToEdit.tenants || [],
		cosigner: propertyUnitToEdit.cosigner || "",
	};

	const defaultChargeValues = {
		unit_id: propertyUnitToEdit.id,
		frequency: '',
		amount: '',
		due_date: '',
		account: '',
		type: 'recurring_charge',
	}

	const [modalOpenState, toggleModalState] = useState(false)
	const [chargeToEdit, setChargeToEdit] = useState(defaultChargeValues)
	propertyValues.unit_charges = propertyUnitCharges.filter((unit_charge) => unit_charge.unit_id === propertyUnitToEdit.id)


	const handleModalClose = () => {
		toggleModalState(!modalOpenState)
	}

	const handleAddChargeClick = () => {
		setChargeToEdit(defaultChargeValues)
		toggleModalState(!modalOpenState)
	}

	const handleEditClick = (rowId) => {
		setChargeToEdit(propertyValues.unit_charges.find(({ id }) => id === rowId) || defaultChargeValues)
		handleModalClose()
	}

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={async (values, { resetForm }) => {
				let property_unit = {
					property_id: values.property_id,
					id: values.id,
					ref: values.ref,
					address: values.address,
					unit_type: values.unit_type,
					beds: values.beds,
					baths: values.baths,
					sqft: values.sqft,
					lease_type: values.lease_type,
					tenants: values.tenants,
					cosigner: values.cosigner,
				};
				//check if the unit has an image to upload
				if (property_unit.image && property_unit.image.data) {
					//upload the file to the database and assign the resulting file 
					// upload path to property_unit
					const fileUploadPath = await uploadFilesToFirebase([property_unit.image])
					property_unit.image = fileUploadPath
				}
				await handleItemSubmit(currentUser, property_unit, 'property_units')
				resetForm({});
				if (values.id) {
					history.goBack();
				}
			}}
		>
			{({
				values,
				handleSubmit,
				setFieldValue,
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
							<Grid container spacing={4} direction="row">
								<Grid md={6} container item spacing={1} direction="column">
									<Grid item>
										<Typography variant="subtitle2">
											Unit Details
									</Typography>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="property_id"
											label="Property With Unit"
											id="property_id"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.property_id}
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
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											type="text"
											name="ref"
											id="ref"
											label="Unit Ref"
											value={values.ref}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.ref && touched.ref}
											helperText={touched.ref && errors.ref}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="unit_type"
											label="Unit Type"
											id="unit_type"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.unit_type}
											error={errors.unit_type && touched.unit_type}
											helperText={touched.unit_type && errors.unit_type}
										>
											{UNIT_TYPES.map((unit_type, index) => (
												<MenuItem key={index} value={unit_type}>
													{unit_type}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="beds"
											label="Beds"
											id="beds"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.beds}
											error={errors.beds && touched.beds}
											helperText={touched.beds && errors.beds}
										>
											{PROPERTY_BEDS.map((property_bed, index) => (
												<MenuItem key={index} value={property_bed}>
													{property_bed}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="baths"
											label="Baths"
											id="baths"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.baths}
											error={errors.baths && touched.baths}
											helperText={touched.baths && errors.baths}
										>
											{PROPERTY_BATHS.map((property_bath, index) => (
												<MenuItem key={index} value={property_bath}>
													{property_bath}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											label="Address"
											id="address"
											type="text"
											name="address"
											value={values.address}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.address && touched.address}
											helperText={touched.address && errors.address}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											name="sqft"
											id="sqft"
											label="Square Footage"
											value={values.sqft}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.sqft && touched.sqft}
											helperText={touched.sqft && errors.sqft}
										/>
									</Grid>
								</Grid>
								{/** start of the adjacent column here */}
								<Grid md={6} container item spacing={1} direction="column">
									<Grid item>
										<Typography variant="subtitle2">Unit Lease Info</Typography>
									</Grid>
									<Grid item container direction="row" spacing={2}>
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
									<Grid item container direction="row" spacing={2}>
										<Grid item xs={12} md={6}>
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
										<Grid item xs={12} md={6}>
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
												helperText={touched.rent_cycle && errors.rent_cycle}
											>
												{RENT_CYCLES.map((rent_cycle, index) => (
													<MenuItem key={index} value={rent_cycle}>
														{rent_cycle}
													</MenuItem>
												))}
											</TextField>
										</Grid>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												variant="outlined"
												id="price"
												label="Rent Amount"
												name="price"
												value={values.price}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.price && touched.price}
												helperText={touched.price && errors.price}
											/>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												variant="outlined"
												id="next_due_date"
												type="date"
												name="next_due_date"
												label="Rent Next Due Date"
												value={values.next_due_date}
												error={errors.next_due_date && touched.next_due_date}
												helperText={touched.next_due_date && errors.next_due_date || 'Next date when the rent is due'}
												onChange={handleChange}
												onBlur={handleBlur}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item xs={12} md={6}>
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
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												variant="outlined"
												id="security_deposit_due_date"
												type="date"
												name="security_deposit_due_date"
												label="Security Deposit Due Date"
												value={values.security_deposit_due_date}
												onChange={handleChange}
												onBlur={handleBlur}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
									</Grid>
									<Grid item>
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
									<Grid item>
										<TextField
											fullWidth
											select
											variant="outlined"
											id="cosigner"
											name="cosigner"
											label="Unit Cosigner"
											value={values.cosigner}
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Unit Cosigner"
										>
											{contacts.map((contact, index) => (
												<MenuItem key={index} value={contact.id}>
													{contact.first_name +
														" " +
														contact.last_name}
												</MenuItem>
											))}
										</TextField>
									</Grid>
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
										tenantId={currentUser.tenant}
										handleEditClick={handleEditClick}
										handleItemSubmit={handleItemSubmit}
										handleDelete={handleItemDelete}
										deleteUrl={"recurring-charges"} />
									{
										modalOpenState ? <ChargeInputModal open={modalOpenState}
											handleClose={handleModalClose} history={history}
											handleItemSubmit={handleItemSubmit}
											chargeValues={chargeToEdit} /> : null
									}
								</Grid>
								<Grid item>
									<Button
										className={classes.oneMarginTopBottom}
										variant="outlined"
										size="medium"
										startIcon={<AddIcon/>}
										onClick={() => handleAddChargeClick()}
										disableElevation>
										Add Charge
									</Button>
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
										Save
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
		propertyUnitCharges: state.propertyUnitCharges,
		properties: state.properties,
		error: state.error,
		contacts: state.contacts.filter(({ id }) => !state.propertyUnits.find((property_unit) => property_unit.tenants.includes(id))),
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

PropertyUnitInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertyUnitInputForm);

export default withRouter(PropertyUnitInputForm);

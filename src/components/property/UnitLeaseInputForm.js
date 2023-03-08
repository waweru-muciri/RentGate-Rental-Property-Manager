import React, { useState } from "react";
import ChargesTable from './ChargesTable'
import ChargeInputModal from './ChargeInputModal'
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../../components/commonStyles";
import {
	getLeaseOptions, getPaymentOptions
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import { addMonths, format, startOfMonth, startOfToday } from "date-fns";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const LEASE_TYPES = getLeaseOptions();
const RENT_CYCLES = getPaymentOptions();

const recurringChargesTableHeadCells = [
	{ id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name" },
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
	rent_amount: Yup.number().typeError('Rent Amount must be number')
		.min(0, "Amount must be a greater than 0").required('Rent Amount is Required').default(0),
	security_deposit: Yup.number().typeError('Security Deposit must be number')
		.min(0, "Amount must be a greater than 0").default(0),
	water_deposit: Yup.number().typeError('Water Deposit must be number')
		.min(0, "Amount must be a greater than 0").default(0),
	electricity_deposit: Yup.number().typeError('Water Deposit must be number')
		.min(0, "Amount must be a greater than 0").default(0),
	property_id: Yup.string().trim().required('Property is Required'),
	unit_id: Yup.string().trim().required('Unit is Required'),
	end_date: Yup.date().when('lease_type', { is: 'Fixed', then: Yup.date().required('End Date is Required') }),
	rent_due_date: Yup.date().required('Next Due Date is Required'),
	security_deposit_due_date: Yup.date(),
});


let UnitLeaseInputForm = (props) => {
	const classes = commonStyles();
	const { contacts, history, properties, propertyUnits, leaseUnitCharges, handleItemSubmit, handleItemDelete } = props
	const leaseToEdit = props.leaseToEdit || {};
	const unitLeaseValues = {
		id: leaseToEdit.id,
		property_id: leaseToEdit.property_id || "",
		unit_id: leaseToEdit.unit_id || "",
		tenants: contacts.filter(({ id }) => Array.isArray(leaseToEdit.tenants) ? leaseToEdit.tenants.includes(id) : false),
		cosigner: contacts.find(({ id }) => leaseToEdit.cosigner === id) || null,
		start_date: leaseToEdit.start_date || defaultDate,
		end_date: leaseToEdit.end_date || '',
		rent_due_date: leaseToEdit.rent_due_date || format(addMonths(startOfMonth(new Date()), 1), 'yyyy-MM-dd'),
		security_deposit_due_date: leaseToEdit.security_deposit_due_date || defaultDate,
		rent_amount: leaseToEdit.rent_amount || '',
		terminated: leaseToEdit.terminated || false,
		security_deposit: leaseToEdit.security_deposit || '',
		water_deposit: leaseToEdit.water_deposit || '',
		electricity_deposit: leaseToEdit.electricity_deposit || '',
		lease_type: leaseToEdit.lease_type || LEASE_TYPES[1],
		rent_cycle: leaseToEdit.rent_cycle || "Monthly",
		unit_charges: leaseUnitCharges
	};

	const defaultChargeValues = {
		unit_id: leaseToEdit.unit_id,
		property_id: leaseToEdit.property_id,
		frequency: '',
		amount: '',
		due_date: defaultDate,
		charge_label: '',
		type: 'one_time_charge',
	}

	const [modalOpenState, toggleModalState] = useState(false)
	const [chargeToEdit, setChargeToEdit] = useState(defaultChargeValues)


	const handleModalStateToggle = () => {
		toggleModalState(!modalOpenState)
	}

	return (
		<Formik
			initialValues={unitLeaseValues}
			enableReinitialize validationSchema={UnitLeaseSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					let propertyUnitLease = {
						id: values.id,
						property_id: values.property_id,
						unit_id: values.unit_id,
						lease_type: values.lease_type,
						rent_cycle: values.rent_cycle,
						tenants: values.tenants.map(tenant => tenant.id),
						cosigner: values.cosigner ? values.cosigner.id : "",
						start_date: values.start_date,
						end_date: values.end_date,
						rent_due_date: values.rent_due_date,
						security_deposit: values.security_deposit,
						water_deposit: values.water_deposit,
						electricity_deposit: values.electricity_deposit,
						security_deposit_due_date: values.security_deposit_due_date,
						rent_amount: values.rent_amount,
						terminated: values.terminated
					};
					const leaseId = await handleItemSubmit(propertyUnitLease, "leases")
					if (!values.id) {
						//post charges for rent and  security deposit 
						const tenant = values.tenants[0]
						const newRentCharge = {
							payed: false,
							charge_amount: values.rent_amount,
							charge_date: values.start_date,
							charge_label: "Rent",
							charge_type: "rent",
							due_date: values.start_date,
							tenant_id: tenant.id,
							unit_id: values.unit_id,
							property_id: values.property_id,
							lease_id: leaseId,
						}
						//charge rent on tenant first moving into the unit
						await handleItemSubmit(newRentCharge, 'transactions-charges')
						//if the security deposit is not zero then post it as a charge
						if (parseFloat(values.security_deposit)) {
							const newSecurityDepositCharge = {
								payed: false,
								charge_amount: values.security_deposit,
								charge_date: values.start_date,
								charge_label: "Security Deposit",
								charge_type: "security_deposit",
								due_date: values.security_deposit_due_date,
								tenant_id: tenant.id,
								unit_id: values.unit_id,
								property_id: values.property_id,
								lease_id: leaseId,
							}
							await handleItemSubmit(newSecurityDepositCharge, 'transactions-charges')
						}
						//if the water deposit is not zero then post it as a charge
						if (parseFloat(values.water_deposit)) {
							const newWaterDepositCharge = {
								payed: false,
								charge_amount: values.water_deposit,
								charge_date: values.start_date,
								charge_label: "Water Deposit",
								charge_type: "water_deposit",
								due_date: values.security_deposit_due_date,
								tenant_id: tenant.id,
								unit_id: values.unit_id,
								property_id: values.property_id,
								lease_id: leaseId,
							}
							await handleItemSubmit(newWaterDepositCharge, 'transactions-charges')

						}
						//if the electric deposit is not zero then post it as a charge
						if (parseFloat(values.electricity_deposit)) {
							const newElectricDepositCharge = {
								payed: false,
								charge_amount: values.electricity_deposit,
								charge_date: values.start_date,
								charge_label: "Electricity Deposit",
								charge_type: "electricity_deposit",
								due_date: values.security_deposit_due_date,
								tenant_id: tenant.id,
								unit_id: values.unit_id,
								property_id: values.property_id,
								lease_id: leaseId,
							}
							await handleItemSubmit(newElectricDepositCharge, 'transactions-charges')
						}
					}
					resetForm({});
					if (values.id) {
						history.goBack()
					}
					setStatus({ sent: true, msg: "Agreement saved successfully." })
				} catch (error) {
					setStatus({ sent: false, msg: `Error! ${error}.` })
				}
			}}
		>
			{({
				values,
				status,
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
						<Grid container spacing={4} direction="row" alignItems="flex-start">
							<Grid item container md={6} direction="column" spacing={2}>
								<Grid item>
									<Typography variant="subtitle1">
										Property &amp; Unit With Agreement
									</Typography>
								</Grid>
								<Grid item xs={12}>
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
								<Grid item xs={12}>
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
											setFieldValue('unit_charges', leaseUnitCharges.filter(({ unit_id }) => unit_id === event.target.value)
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
								<Grid item>
									<Typography variant="subtitle1" >
										Rental Agreement Type
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="lease_type"
										label="Rental Agreement Type"
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
								<Grid item>
									<Typography variant="subtitle1" >
										Agreement Start &amp; End Dates
									</Typography>
								</Grid>
								<Grid item container direction="row" justify="center" spacing={2}>
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
								<Grid item>
									<Typography variant="subtitle1" >
										Rent
								</Typography>
								</Grid>
								<Grid item container direction="row" justify="center" spacing={2}>
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
											helperText={"Frequency at which rent is charged on unit"}
										>
											{RENT_CYCLES.map((rent_cycle, index) => (
												<MenuItem key={index} value={rent_cycle}>
													{rent_cycle}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											fullWidth
											variant="outlined"
											id="rent_due_date"
											type="date"
											name="rent_due_date"
											label="Rent Next Due Date"
											value={values.rent_due_date}
											error={errors.rent_due_date && touched.rent_due_date}
											helperText={"Next date when the rent is due"}
											onChange={handleChange}
											onBlur={handleBlur}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
								</Grid>
								<Grid item xs={12}>
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
										error={errors.rent_amount && touched.rent_amount}
										helperText={touched.rent_amount && errors.rent_amount}
									/>
								</Grid>
							</Grid>
							<Grid item container md={6} direction="column" justify="center" spacing={2}>
								<Grid item>
									<Typography variant="subtitle1" paragraph>
										Rent Security Deposit
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										id="security_deposit_due_date"
										type="date"
										name="security_deposit_due_date"
										label="Due Date"
										helperText="Date when the security deposit is due."
										value={values.security_deposit_due_date}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										id="security_deposit"
										label="Rent Security Deposit"
										name="security_deposit"
										value={values.security_deposit}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.security_deposit && touched.security_deposit}
										helperText={touched.security_deposit && errors.security_deposit}
									/>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1" paragraph>
										Water &amp; Electricity Deposits
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										id="water_deposit"
										label="Water Deposit"
										name="water_deposit"
										value={values.water_deposit}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.water_deposit && touched.water_deposit}
										helperText={touched.water_deposit && errors.water_deposit}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										id="electricity_deposit"
										label="Electricity Deposit"
										name="electricity_deposit"
										value={values.electricity_deposit}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.electricity_deposit && touched.electricity_deposit}
										helperText={touched.electricity_deposit && errors.electricity_deposit}
									/>
								</Grid>
								<Grid item>
									<Typography variant='body1' color="textSecondary">
										Don't forget to record the payments once you have collected the deposits.
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1" >
										Tenants &amp; Cosigner
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Autocomplete
										id="tenants-select"
										multiple
										value={values.tenants}
										onChange={(event, newValue) => {
											setFieldValue("tenants", newValue);
										}}
										style={{ width: "100%" }}
										options={contacts}
										autoHighlight
										getOptionLabel={(option) => option ? `${option.first_name} ${option.last_name}` : ''}
										renderOption={(option) => (
											<React.Fragment>
												{option.first_name} {option.last_name}
											</React.Fragment>
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Tenants"
												variant="outlined"
												error={errors.tenants && touched.tenants}
												helperText={touched.tenants && errors.tenants}
												inputProps={{
													...params.inputProps,
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12}>
									<Autocomplete
										id="cosigner-select"
										value={values.cosigner}
										onChange={(event, newValue) => {
											setFieldValue("cosigner", newValue);
										}}
										style={{ width: "100%" }}
										options={contacts}
										autoHighlight
										getOptionLabel={(option) => option ? `${option.first_name} ${option.last_name}` : ''}
										renderOption={(option) => (
											<React.Fragment>
												{option.first_name} {option.last_name}
											</React.Fragment>
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Cosigner"
												variant="outlined"
												error={errors.cosigner && touched.cosigner}
												helperText={touched.cosigner && errors.cosigner}
												inputProps={{
													...params.inputProps,
												}}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item container direction="column" spacing={1} xs={12}>
							<Grid item xs={12}>
								<Typography variant="subtitle1">Unit Charges</Typography>
							</Grid>
							<Grid item xs={12}>
								<ChargesTable
									rows={values.unit_charges}
									headCells={recurringChargesTableHeadCells}
									handleEditClick={(rowIndex) => {
										setChargeToEdit(values.unit_charges[rowIndex])
										handleModalStateToggle()
									}}
									handleDelete={(rowIndex) => {
										var unitCharges = values.unit_charges.slice()
										const chargeToDelete = unitCharges.splice(rowIndex, 1)[0] || {}
										if (chargeToDelete.id) {
											handleItemDelete(chargeToDelete.id, 'unit-charges')
										}
										setFieldValue("unit_charges", unitCharges)
									}}
								/>
								{
									modalOpenState ? <ChargeInputModal open={modalOpenState}
										handleClose={handleModalStateToggle} history={history}
										handleItemSubmit={handleItemSubmit}
										chargeValues={chargeToEdit} /> : null
								}
							</Grid>
							<Grid item xs={12}>
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
									{values.id ? "Edit Agreement" : "Add Agreement"}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</form>
			)
			}
		</Formik >
	);
};

export default UnitLeaseInputForm;

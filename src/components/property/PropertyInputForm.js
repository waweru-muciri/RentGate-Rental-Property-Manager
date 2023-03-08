import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
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
	uploadFilesToFirebase,
} from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import {
	getPropertyTypes, getPropertyBeds,
	getPropertyBaths,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import { IconButton } from "@material-ui/core";

const PROPERTY_TYPES = getPropertyTypes();

const PropertySchema = Yup.object().shape({
	property_type: Yup.string().trim().required("Type is Required"),
	assigned_to: Yup.string().trim().required("Who will be the primary manager for this property"),
	address: Yup.string().trim().required('Property Address is Required'),
	postal_code: Yup.string().trim().default(''),
	city: Yup.string().default(''),
	property_units: Yup.array().of(Yup.object().shape({
		address: Yup.string().trim().required("Address is required"),
		beds: Yup.string().trim().required("Beds is required").default(''),
		ref: Yup.string().trim().required("Unit Ref/Number is required"),
		baths: Yup.string().trim().required("Beds is required").default(''),
		sqft: Yup.number().typeError('Square Footage must be a number').integer().min(0),
	})).required()
});

const PROPERTY_BEDS = getPropertyBeds();

const PROPERTY_BATHS = getPropertyBaths();

let PropertyInputForm = (props) => {
	const classes = commonStyles();
	const { currentUser, history, users, handleItemSubmit } = props
	let propertyToEdit = typeof props.propertyToEdit !== 'undefined' ? props.propertyToEdit : {};
	const propertyValues = {
		id: propertyToEdit.id,
		ref: propertyToEdit.ref || "",
		assigned_to: propertyToEdit.assigned_to || "",
		city: propertyToEdit.city || "",
		postal_code: propertyToEdit.postal_code || "",
		address: propertyToEdit.address || "",
		property_type: propertyToEdit.property_type || "",
		property_units: [],
		owner: propertyToEdit.owner || "",
	};
	const CustomInputComponent = ({ remove, push, form }) => {
		const { errors, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['property_units']
		const layout = values.property_units.map((property_unit, propertyUnitIndex) =>
			<Grid key={`property_unit-${propertyUnitIndex}`} container item direction="row" alignItems="center" spacing={2}>
				<Grid xs item key={`property_units[${propertyUnitIndex}].ref`}>
					<TextField
						label="Unit Number/Ref"
						variant="outlined"
						type="text"
						value={property_unit.ref}
						name={`property_units.${propertyUnitIndex}.ref`}
						error={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && typeof propertyUnitErrors[propertyUnitIndex]['ref'] !== 'undefined'}
						helperText={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && propertyUnitErrors[propertyUnitIndex].ref}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Grid>
				<Grid xs item key={`property_units[${propertyUnitIndex}].address`}>
					<TextField
						label="Unit Address"
						variant="outlined"
						type="text"
						value={property_unit.address}
						name={`property_units.${propertyUnitIndex}.address`}
						error={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && typeof propertyUnitErrors[propertyUnitIndex]['address'] !== 'undefined'}
						helperText={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && propertyUnitErrors[propertyUnitIndex].address}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Grid>
				<Grid xs item key={`property_units[${propertyUnitIndex}].beds`}>
					<TextField
						fullWidth
						label="Beds/Rooms"
						variant="outlined"
						defaultValue=""
						select
						value={property_unit.beds}
						name={`property_units.${propertyUnitIndex}.beds`}
						error={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && typeof propertyUnitErrors[propertyUnitIndex]['beds'] !== 'undefined'}
						helperText={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && propertyUnitErrors[propertyUnitIndex].beds}
						onChange={handleChange}
						onBlur={handleBlur}>
						{PROPERTY_BEDS.map((property_bed, bedNumberIndex) => (
							<MenuItem key={bedNumberIndex} value={property_bed}>
								{property_bed}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid xs item key={`property_units[${propertyUnitIndex}].baths`}>
					<TextField
						fullWidth
						label="Baths"
						variant="outlined"
						defaultValue=""
						select
						value={property_unit.baths}
						name={`property_units.${propertyUnitIndex}.baths`}
						error={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && typeof propertyUnitErrors[propertyUnitIndex]['baths'] !== 'undefined'}
						helperText={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && propertyUnitErrors[propertyUnitIndex].baths}
						onChange={handleChange}
						onBlur={handleBlur}>
						{PROPERTY_BATHS.map((property_bath, bathNumberIndex) => (
							<MenuItem key={bathNumberIndex} value={property_bath}>
								{property_bath}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid xs item key={`property_units[${propertyUnitIndex}].sqft`}>
					<TextField
						label="Sqft"
						variant="outlined"
						type="text"
						value={property_unit.sqft}
						name={`property_units.${propertyUnitIndex}.sqft`}
						error={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && typeof propertyUnitErrors[propertyUnitIndex]['sqft'] !== 'undefined'}
						helperText={'property_units' in errors && typeof propertyUnitErrors[propertyUnitIndex] !== 'undefined' && propertyUnitErrors[propertyUnitIndex].sqft}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Grid>
				<Grid item key={`property_units[${propertyUnitIndex}].delete`}>
					<IconButton aria-label="delete"
						onClick={ () => { remove(propertyUnitIndex)}}
						size="medium">
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>

		)
		return <Grid>
			{layout}
			<Button
				variant="outlined"
				size="medium"
				onClick={() => push({ref: '', address: '', beds: '', baths: ''})}
				disableElevation>
				Add Unit
			</Button>
		</Grid>
	}


	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={(values, { resetForm }) => {
				let property = {
					id: values.id,
					assigned_to: values.assigned_to,
					ref: values.address,
					city: values.city,
					postal_code: values.postal_code,
					address: values.address,
					property_type: values.property_type,
					owner: values.owner,
				};
				handleItemSubmit(currentUser, property, "properties").then((propertyId) => {
					values.property_units.forEach((property_unit) => {
						const propertyUnitToSave = Object.assign({}, property_unit, { property_id: propertyId })
						handleItemSubmit(currentUser, propertyUnitToSave, 'property_units')
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
				handleBlur,
				isSubmitting,
			}) => (
					<form
						className={classes.form}
						method="post"
						id="propertyInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container spacing={4} direction="row">
							<Grid sm={12} item>
								<Typography variant="h5">
									{values.address}
								</Typography>
								<TextField
									fullWidth
									variant="outlined"
									select
									name="property_type"
									label="Type"
									id="property_type"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.property_type}
									error={'property_type' in errors}
									helperText={
										errors.property_type
									}
								>
									{PROPERTY_TYPES.map((property_type, index) => (
										<MenuItem key={index} value={property_type}>
											{property_type}
										</MenuItem>
									))}
								</TextField>
								<Typography variant="subtitle1">Street Address</Typography>
								<TextField
									fullWidth
									variant="outlined"
									label="Address"
									error={'address' in errors}
									helperText={errors.address}
									id="address"
									type="text"
									name="address"
									value={values.address}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<TextField
									fullWidth
									variant="outlined"
									id="city"
									type="text"
									name="city"
									label="City"
									value={values.city}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<TextField
									fullWidth
									label="Postal Code"
									variant="outlined"
									id="postal_code"
									type="text"
									name="postal_code"
									error={'postal_code' in errors}
									helperText={errors.postal_code}
									value={values.postal_code}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<TextField
									fullWidth
									select
									variant="outlined"
									id="owner"
									name="owner"
									label="Property Owner"
									value={values.owner}
									onChange={handleChange}
									onBlur={handleBlur}
									helperText="Who is the Property Owner"
								>
									{users.map((user, index) => (
										<MenuItem key={index} value={user.id}>
											{user.first_name +
												" " +
												user.last_name}
										</MenuItem>
									))}
								</TextField>
								<TextField
									fullWidth
									select
									error={'assigned_to' in errors}
									helperText={errors.assigned_to}
									variant="outlined"
									name="assigned_to"
									id="assigned_to"
									label="Landlord"
									value={values.assigned_to}
									onChange={handleChange}
									onBlur={handleBlur}
								>
									{users.map((user, index) => (
										<MenuItem key={index} value={user.id}>
											{user.first_name + ' ' + user.last_name}
										</MenuItem>
									))}
								</TextField>
								<Typography variant="subtitle1" paragraph>Add Rental Units</Typography>
								<Grid item container direction="column">
									<FieldArray
										name="property_units"
										component={CustomInputComponent}
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
		properties: state.properties,
		propertiesMediaFiles: state.mediaFiles,
		error: state.error,
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

PropertyInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertyInputForm);

export default withRouter(PropertyInputForm);

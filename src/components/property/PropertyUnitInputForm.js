import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
	handleDelete,
} from "../../actions/actions";
import { commonStyles } from "../commonStyles";
import { withRouter } from "react-router-dom";
import {
	getUnitTypes,
	getPropertyBeds,
	getPropertyBaths,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";

const UNIT_TYPES = getUnitTypes();
const PROPERTY_BEDS = getPropertyBeds();
const PROPERTY_BATHS = getPropertyBaths();

const PropertyUnitSchema = Yup.object().shape({
	property_id: Yup.string().trim().required("Property is Required"),
	unit_type: Yup.string().trim().required("Unit Type is Required"),
	baths: Yup.string().trim(),
	beds: Yup.string().trim().required("Beds is required"),
	ref: Yup.string().trim().required("Unit Ref Required"),
	sqft: Yup.number().typeError('Sqft must be a number').min(0).default(0),
});


let PropertyUnitInputForm = (props) => {
	const classes = commonStyles();
	const { properties, history, handleItemSubmit } = props
	let propertyUnitToEdit = props.propertyUnitToEdit || {};
	//get both unit values and latest lease information
	const propertyValues = {
		id: propertyUnitToEdit.id,
		ref: propertyUnitToEdit.ref || "",
		property_id: propertyUnitToEdit.property_id || "",
		address: propertyUnitToEdit.address || "",
		unit_type: propertyUnitToEdit.unit_type || "",
		beds: propertyUnitToEdit.beds || "",
		baths: propertyUnitToEdit.baths || "",
		sqft: propertyUnitToEdit.sqft || '',
		tenants: propertyUnitToEdit.tenants || [],
	};

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertyUnitSchema}
			onSubmit={async (values, { resetForm }) => {
				let unit = {
					property_id: values.property_id,
					id: values.id,
					ref: values.ref,
					address: values.ref,
					unit_type: values.unit_type,
					beds: values.beds,
					baths: values.baths,
					sqft: values.sqft,
					tenants: values.tenants,
				};
				//save the unit details
				await handleItemSubmit(unit, 'property_units')
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
							<Grid container item spacing={2} direction="column">
								<Grid item>
									<Typography variant="subtitle2">
										Unit Details
									</Typography>
								</Grid>
								<Grid container item spacing={2} direction="row">
									<Grid item xs={12} md={6}>
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
									<Grid item xs={12} md={6}>
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
								</Grid>
								<Grid container item spacing={2} direction="row">
									<Grid item xs={12} md={6}>
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
									<Grid item xs={12} md={6}>
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
								</Grid>
								<Grid container item spacing={2} direction="row">
									<Grid item xs={12} md={6}>
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
											helperText={"Baths in Unit"}
										>
											{PROPERTY_BATHS.map((property_bath, index) => (
												<MenuItem key={index} value={property_bath}>
													{property_bath}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={6}>
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
		leases: state.leases,
		properties: state.properties,
		error: state.error,
		contacts: state.contacts,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

PropertyUnitInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertyUnitInputForm);

export default withRouter(PropertyUnitInputForm);

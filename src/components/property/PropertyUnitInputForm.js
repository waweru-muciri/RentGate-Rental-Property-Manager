import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
	handleDelete, uploadFilesToFirebase, deleteUploadedFileByUrl
} from "../../actions/actions";
import { commonStyles } from "../commonStyles";
import { withRouter } from "react-router-dom";
import {
	getUnitTypes,
	getPropertyBeds,
	getPropertyBaths,
} from "../../assets/commonAssets.js";
import ImageCropper from '../ImageCropper';
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
		unit_image_url: propertyUnitToEdit.unit_image_url || '',
		file_to_load_url: '',
	};

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertyUnitSchema}
			onSubmit={async (values, { resetForm }) => {
				let property_unit = {
					id: values.id,
					property_id: values.property_id,
					ref: values.ref,
					address: values.ref,
					unit_type: values.unit_type,
					beds: values.beds,
					baths: values.baths,
					sqft: values.sqft,
				};
				//check if the unit has an image to upload
				if (values.unit_image && values.unit_image.data) {
					//if the user had previously uploaded an image for unit
					// then delete it here and replace the url with new uploaded image
					if (values.unit_image_url) {
						//delete file from storage
						await deleteUploadedFileByUrl(values.unit_image_url);
					}
					//upload the file to the database and assign the resulting file 
					// upload path to property_unit
					const fileUploadPath = await uploadFilesToFirebase(values.unit_image)
					property_unit.unit_image_url = fileUploadPath
				}
				//save the unit details
				await handleItemSubmit(property_unit, 'property_units')
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
				setFieldValue,
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
								<Grid
									item
									container
									direction="row"
									justify="flex-start"
									spacing={4}
									alignItems="center"
								>
									<Grid key={1} item xs={12} md={6}>
										{
											values.file_to_load_url &&
											<ImageCropper open={true} selectedFile={values.file_to_load_url}
												setCroppedImageData={(croppedImage) => {
													setFieldValue('file_to_load_url', '');
													setFieldValue('unit_image', croppedImage);
												}} cropHeight={200} cropWidth={300}/>
										}
										<Avatar
											style={{ width: "100%", height: '300px' }}
											alt="Unit Image"
											src={
												values.unit_image ?
													values.unit_image.data
													: values.unit_image_url
											}
											className={classes.largeAvatar} variant="rounded"
										>Image</Avatar>
									</Grid>
									<Grid key={2} xs={12} item md>
										<Box>
											<input onChange={(event) => {
												const selectedFile = event.currentTarget.files[0]
												//remove the object then push a copy of it with added image object
												setFieldValue("file_to_load_url", selectedFile);
											}} accept="image/*" className={classes.fileInputDisplayNone} id={"unit-image-input"} type="file" />
											<label htmlFor={"unit-image-input"}>
												<IconButton color="primary" aria-label="upload picture" component="span">
													<PhotoCamera />
												</IconButton>
											</label>
											<Box marginBottom="1">{values.unit_image_url || values.unit_image ? "Change Image" : "Add Image"}</Box>
											{
												values.unit_image_url ? <Button variant="contained" onClick={ async () => {
													await deleteUploadedFileByUrl(values.unit_image_url)
													setFieldValue('unit_image_url', '')
												}}>Delete Image</Button> : null
											}
										</Box>
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

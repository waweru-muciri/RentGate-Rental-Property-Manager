import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CustomCircularProgress from "../CustomCircularProgress";
import CustomSnackbar from '../CustomSnackbar'
import { connect } from "react-redux";
import { Formik, FieldArray } from "formik";
import {
	handleItemFormSubmit,
	handleDelete, uploadFilesToFirebase, deleteUploadedFileByUrl
} from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import ImageCropper from '../ImageCropper';
import { withRouter } from "react-router-dom";
import {
	getPropertyBeds,
	getPropertyBaths, getUnitTypes
} from "../../assets/commonAssets.js";
import * as Yup from "yup";

const PropertySchema = Yup.object().shape({
	ref: Yup.string().trim().required("Property Name/Ref/Number is Required"),
	assigned_to: Yup.string().trim().required("Who will be the primary manager for this property"),
	address: Yup.string().trim().required('Property Address is Required'),
	postal_code: Yup.string().trim().default(''),
	city: Yup.string().default(''),
	property_units: Yup.array().of(Yup.object().shape({
		unit_type: Yup.string().trim().required("Unit Type is required"),
		beds: Yup.string().trim().required("Beds is required").default(''),
		ref: Yup.string().trim().required("Unit Ref/Number is required"),
		baths: Yup.string().trim().default(''),
		sqm: Yup.number().typeError('Square Footage must be a number').integer().min(0),
	}))
});

const UNIT_TYPES = getUnitTypes();
const PROPERTY_BEDS = getPropertyBeds();
const PROPERTY_BATHS = getPropertyBaths();

let PropertyInputForm = (props) => {
	const classes = commonStyles();
	const { history, users, handleItemSubmit } = props
	let propertyToEdit = props.propertyToEdit || {};
	const propertyValues = {
		id: propertyToEdit.id,
		assigned_to: propertyToEdit.assigned_to || "",
		city: propertyToEdit.city || "",
		postal_code: propertyToEdit.postal_code || "",
		address: propertyToEdit.address || "",
		ref: propertyToEdit.ref || "",
		property_units: [],
		owner: propertyToEdit.owner || "",
		property_image_url: propertyToEdit.property_image_url || "",
	};
	const UnitInputComponent = ({ remove, push, replace, form }) => {
		const { errors, touched, values, handleChange, handleBlur } = form
		const propertyUnitErrors = errors['property_units']
		const propertyUnitTouched = touched['property_units']
		const layout = values.property_units.map((property_unit, propertyUnitIndex) => {
			const indexInErrors = propertyUnitErrors && propertyUnitErrors[propertyUnitIndex];
			const indexInTouched = propertyUnitTouched && propertyUnitTouched[propertyUnitIndex];
			return (
				<Grid key={`property_unit-${propertyUnitIndex}`} container item direction="row" alignItems="center" spacing={2}>
					<Grid xs item key={`property_units[${propertyUnitIndex}].ref`}>
						<TextField
							label="Unit Number/Ref"
							variant="outlined"
							type="text"
							value={property_unit.ref}
							name={`property_units.${propertyUnitIndex}.ref`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'ref' in indexInErrors) && (indexInTouched && indexInTouched.ref)}
							helperText={(indexInTouched && indexInTouched.ref) && (indexInErrors && indexInErrors.ref)}
						/>
					</Grid>
					<Grid xs item key={`property_units[${propertyUnitIndex}].unit_type`}>
						<TextField
							fullWidth
							label="Unit Type"
							defaultValue=""
							variant="outlined"
							select
							value={property_unit.unit_type}
							name={`property_units.${propertyUnitIndex}.unit_type`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'unit_type' in indexInErrors) && (indexInTouched && indexInTouched.unit_type)}
							helperText={(indexInTouched && indexInTouched.unit_type) && (indexInErrors && indexInErrors.unit_type)}
						>
							{UNIT_TYPES.map((unit_type, unitTypeIndex) => (
								<MenuItem key={unitTypeIndex} value={unit_type.id}>
									{unit_type.displayValue}
								</MenuItem>
							))}
						</TextField>
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
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'beds' in indexInErrors) && (indexInTouched && indexInTouched.beds)}
							helperText={(indexInTouched && indexInTouched.beds) && (indexInErrors && indexInErrors.beds)}
						>
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
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'baths' in indexInErrors) && (indexInTouched && indexInTouched.baths)}
							helperText={(indexInTouched && indexInTouched.baths) && (indexInErrors && indexInErrors.baths)}
						>
							{PROPERTY_BATHS.map((property_bath, bathNumberIndex) => (
								<MenuItem key={bathNumberIndex} value={property_bath}>
									{property_bath}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item key={`property_units[${propertyUnitIndex}].image`}>
						{
							property_unit.file_to_load_url &&
							<ImageCropper open={true} selectedFile={property_unit.file_to_load_url}
								setCroppedImageData={(croppedImage) => {
									replace(propertyUnitIndex, Object.assign({}, property_unit, { file_to_load_url: '', image: croppedImage }));
								}} cropHeight={200} cropWidth={300} />
						}
						<Box>
							<input onChange={(event) => {
								const selectedFile = event.currentTarget.files[0]
								//remove the object then push a copy of it with added image object
								replace(propertyUnitIndex, Object.assign({}, property_unit, { file_to_load_url: selectedFile }));
							}} accept="image/*" className={classes.fileInputDisplayNone} id={`icon-button-file-${propertyUnitIndex}`} type="file" />
							<label htmlFor={`icon-button-file-${propertyUnitIndex}`}>
								<IconButton color="primary" aria-label="upload picture" component="span">
									<PhotoCamera />
								</IconButton>
							</label>
							<Box>{property_unit.image ? property_unit.image.name : "No Image"}</Box>
						</Box>
					</Grid>
					<Grid xs item key={`property_units[${propertyUnitIndex}].sqm`}>
						<TextField
							label="Sqm"
							variant="outlined"
							type="text"
							value={property_unit.sqm}
							name={`property_units.${propertyUnitIndex}.sqm`}
							onChange={handleChange}
							onBlur={handleBlur}
							error={(indexInErrors && 'sqm' in indexInErrors) && (indexInTouched && indexInTouched.sqm)}
							helperText={(indexInTouched && indexInTouched.sqm) && (indexInErrors && indexInErrors.sqm)}
						/>
					</Grid>
					<Grid item key={`property_units[${propertyUnitIndex}].delete`}>
						<IconButton aria-label="delete"
							onClick={() => { remove(propertyUnitIndex) }}
							size="medium">
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>)

		})
		return <Grid item container spacing={4} direction="column">
			{layout}
			<Grid item>
				<Button
					variant="outlined"
					size="medium"
					onClick={() => push({ ref: '', unit_type: '', beds: '', baths: '', sqm: '', image: '' })}
					disableElevation>
					Add Unit
			</Button>
			</Grid>
		</Grid>
	}


	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					let property = {
						id: values.id,
						assigned_to: values.assigned_to,
						city: values.city,
						postal_code: values.postal_code,
						address: values.address,
						ref: values.ref,
						owner: values.owner,
					};
					//first upload the image to firebase
					if (values.property_image && values.property_image.data) {
						//if the user had previously uploaded an image
						// then delete it here and replace the url with new uploaded image
						if (values.property_image_url) {
							//delete file from storage
							await deleteUploadedFileByUrl(values.property_image_url);
						}
						//upload the first and only image in the contact images array
						var fileDownloadUrl = await uploadFilesToFirebase(values.property_image)
						property.property_image_url = fileDownloadUrl;
					}
					const propertyId = await handleItemSubmit(property, "properties")
					//create some property settings if first time property being created
					if (!values.id) {
						await handleItemSubmit(
							{
								property_id: propertyId, grace_period: 0, late_fees_charges_activated: false,
								automatically_end_agreement_on_move_out_date: true, management_fee_type: "flat_fee",
								management_fee_flat_fee: 0
							},
							"property-settings")
					}
					values.property_units.forEach(async (property_unit) => {
						//check if the unit has an image to upload
						if (property_unit.image && property_unit.image.data) {
							//upload the file to the database and assign the resulting file 
							// upload path to property_unit
							const fileUploadPath = await uploadFilesToFirebase(property_unit.image)
							property_unit.unit_image_url = fileUploadPath
							delete property_unit.image
						}
						const propertyUnitToSave = Object.assign({}, property_unit, {
							property_id: propertyId,
							property_ref: values.ref,
							assigned_to: values.assigned_to
						})
						await handleItemSubmit(propertyUnitToSave, 'property_units')
					})
					resetForm({});
					if (values.id) {
						history.goBack()
					}
					setStatus({ sent: true, msg: "Details saved successfully." })

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
				setFieldValue
			}) => (
				<form
					className={classes.form}
					method="post"
					id="propertyInputForm"
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
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								type="text"
								name="ref"
								label="Property Name/Ref"
								id="ref"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.ref}
								error={errors.ref && touched.ref}
								helperText={touched.ref && errors.ref}
							/>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">Street Address</Typography>
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
								id="city"
								type="text"
								name="city"
								label="City"
								value={values.city}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								label="Postal Code"
								variant="outlined"
								id="postal_code"
								type="text"
								name="postal_code"
								value={values.postal_code}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.postal_code && touched.postal_code}
								helperText={touched.postal_code && errors.postal_code}
							/>
						</Grid>
						<Grid item>
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
										{user.first_name} {user.last_name}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								select
								variant="outlined"
								name="assigned_to"
								id="assigned_to"
								label="Landlord"
								value={values.assigned_to}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.assigned_to && touched.assigned_to}
								helperText={touched.assigned_to && errors.assigned_to}
							>
								{users.map((user, index) => (
									<MenuItem key={index} value={user.id}>
										{user.first_name} {user.last_name}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid
							item
							container
							direction="row"
							justify="flex-start"
							spacing={4}
							alignItems="center"
						>
							<Grid key={1} item>
								{
									values.file_to_load_url &&
									<ImageCropper open={true} selectedFile={values.file_to_load_url}
										setCroppedImageData={(croppedImage) => {
											setFieldValue('file_to_load_url', '');
											setFieldValue('property_image', croppedImage);
										}} cropHeight={200} cropWidth={300} />
								}
								<Box>{values.property_image ? values.property_image.name : "No Image"}</Box>
							</Grid>
							<Grid key={2} item>
								<Box>
									<input onChange={(event) => {
										const selectedFile = event.currentTarget.files[0]
										//remove the object then push a copy of it with added image object
										setFieldValue("file_to_load_url", selectedFile);
									}} accept="image/*" className={classes.fileInputDisplayNone} id={"property-image-input"} type="file" />
									<label htmlFor={"property-image-input"}>
										<IconButton size="medium" color="primary" aria-label="upload picture" component="span">
											<PhotoCamera />
										</IconButton>
									</label>
									{
										values.property_image_url ? <Button variant="contained" onClick={async () => {
											await deleteUploadedFileByUrl(values.property_image_url)
											setFieldValue('property_image_url', '')
										}}>Delete Image</Button> : null
									}
								</Box>
							</Grid>
						</Grid>
						{
							values.id ? null : (
								<Grid item>
									<Typography variant="subtitle1" paragraph>Add Rental Units</Typography>
									<FieldArray
										name="property_units"
										component={UnitInputComponent}
									/>
								</Grid>
							)
						}
						<Grid
							item
							container
							justify="flex-start"
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
									form="propertyInputForm"
									disabled={isSubmitting}
								>
									{values.id ? "Save Details" : "Create Property"}
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
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

PropertyInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertyInputForm);

export default withRouter(PropertyInputForm);

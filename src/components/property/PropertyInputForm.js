import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
	handleDelete,
	uploadFilesToFirebase,
} from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import {
	getPropertyTypes,
	getPropertyBeds,
	getPropertyBaths,
	getCheckOptions,
	getFrequencyOptions,
	getLeaseOptions,
	getFurnishedOptions,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";

const PROPERTY_TYPES = getPropertyTypes();

const PROPERTY_BEDS = getPropertyBeds();

const PROPERTY_BATHS = getPropertyBaths();

const CHECKS_OPTIONS = getCheckOptions();

const FREQUENCY_OPTIONS = getFrequencyOptions();

const LEASE_OPTIONS = getLeaseOptions();

const FURNISHED_OPTIONS = getFurnishedOptions();

const PropertySchema = Yup.object().shape({
	property_type: Yup.string().trim().required("Type is Required"),
	furnished: Yup.string().trim().required("Furnished is Required"),
	baths: Yup.string().trim().required("Baths is Required"),
	beds: Yup.string().trim().required("Beds is required"),
	ref: Yup.string().trim().required("Property/Unit Ref Required"),
	assigned_to: Yup.string().trim().required("Landlord is required"),
	deposit: Yup.number().min(0).default(0),
	square_footage: Yup.number().min(0).default(0),
	price: Yup.number().min(0).default(0).required("Rent is required"),
	address: Yup.string().trim().required('Property Address is Required'),
	postal_code: Yup.string().trim().default(''),
	city: Yup.string().default(''),
});

let PropertyInputForm = (props) => {
	const classes = commonStyles();
	const { contacts, history, users, handleItemSubmit, propertiesMediaFiles, handleItemDelete } = props
	let propertyToEdit = typeof props.propertyToEdit !== 'undefined' ? props.propertyToEdit : {};
	let property_media = propertiesMediaFiles.filter(
		(mediaFile) => mediaFile.property === propertyToEdit.id
	);
	const propertyValues = {
		id: propertyToEdit.id,
		ref: propertyToEdit.ref || "",
		assigned_to: propertyToEdit.assigned_to || "",
		city: propertyToEdit.city || "",
		postal_code: propertyToEdit.postal_code || "",
		address: propertyToEdit.address || "",
		floor: propertyToEdit.floor || 0,
		property_type: propertyToEdit.property_type || "",
		beds: propertyToEdit.beds || "",
		baths: propertyToEdit.baths || "",
		square_footage: propertyToEdit.square_footage || 0,
		price: propertyToEdit.price || 0,
		furnished: propertyToEdit.furnished || "",
		frequency: propertyToEdit.frequency || "",
		checks: propertyToEdit.checks || "",
		deposit: propertyToEdit.deposit || 0,
		lease_type: propertyToEdit.lease_type || "",
		has_solid_wood_floor: propertyToEdit.has_solid_wood_floor || false,
		has_balcony: propertyToEdit.has_balcony || false,
		is_fully_furnished: propertyToEdit.is_fully_furnished || false,
		has_air_conditioning: propertyToEdit.has_air_conditioning || false,
		has_sea_water_view: propertyToEdit.has_sea_water_view || false,
		on_high_floor: propertyToEdit.on_high_floor || false,
		tenants: propertyToEdit.tenants || [],
		property_media: property_media,
		owner: propertyToEdit.owner || "",
	};

	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={(values, { resetForm }) => {
				let propertyFilesToSave = values.property_media.filter(
					(file) => !file.id
				);
				let property = {
					id: values.id,
					ref: values.ref,
					city: values.city,
					postal_code: values.postal_code,
					address: values.address,
					floor: values.floor,
					property_type: values.property_type,
					beds: values.beds,
					baths: values.baths,
					square_footage: values.square_footage,
					price: values.price,
					furnished: values.furnished,
					frequency: values.frequency,
					checks: values.checks,
					deposit: values.deposit,
					lease_type: values.lease_type,
					has_solid_wood_floor: values.has_solid_wood_floor,
					has_balcony: values.has_balcony,
					is_fully_furnished: values.is_fully_furnished,
					has_air_conditioning: values.has_air_conditioning,
					has_sea_water_view: values.has_sea_water_view,
					on_high_floor: values.on_high_floor,
					tenants: values.tenants,
					owner: values.owner,
				};
				handleItemSubmit(property, "properties").then((propertyId) => {
					if (propertyFilesToSave.length) {
						let fileDownloadUrls = uploadFilesToFirebase(
							propertyFilesToSave
						);
						//here is the fileDownloadUrls array. Filter the array to remove 
						//undefined values
						fileDownloadUrls.filter((fileDownloadUrl) => typeof fileDownloadUrl !== 'undefined').forEach((fileDownloadUrl) => {
							let fileDownloadUrlObject = {
								url: fileDownloadUrl,
								property: propertyId,
							};
							handleItemSubmit(
								fileDownloadUrlObject,
								"property_media"
							);
						});
					}
					resetForm({});
					if (values.id) {
						history.goBack();
					}
				});
			}}
		>
			{({
				values,
				handleSubmit,
				setFieldValue,
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
							<Grid sm={6} item>
								<Typography variant="h6">
									Property Address & Details
					</Typography>
								<TextField
									fullWidth
									select
									error={errors.assigned_to}
									helperText={'assigned_to' in errors}
									variant="outlined"
									name="assigned_to"
									id="assigned_to"
									label="Assigned To"
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
								<TextField
									fullWidth
									error={errors.ref}
									helperText={'ref' in errors}
									variant="outlined"
									type="text"
									name="ref"
									id="ref"
									label="Unit/Property Ref"
									value={values.ref}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
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
									error={errors.property_type}
									helperText={
										'property_type' in errors
									}
								>
									{PROPERTY_TYPES.map((property_type, index) => (
										<MenuItem key={index} value={property_type}>
											{property_type}
										</MenuItem>
									))}
								</TextField>
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
									error={errors.beds}
									helperText={'baths' in errors}
								>
									{PROPERTY_BEDS.map((property_bed, index) => (
										<MenuItem key={index} value={property_bed}>
											{property_bed}
										</MenuItem>
									))}
								</TextField>
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
									error={errors.baths}
									helperText={'baths' in errors}
								>
									{PROPERTY_BATHS.map((property_bath, index) => (
										<MenuItem key={index} value={property_bath}>
											{property_bath}
										</MenuItem>
									))}
								</TextField>
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
									id="floor"
									label="Floor"
									name="floor"
									value={values.floor}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<TextField
									fullWidth
									variant="outlined"
									name="square_footage"
									id="square_footage"
									label="Square Footage"
									value={values.square_footage || 0}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.square_footage}
									helperText={
										'square_footage' in errors}
								/>
								<TextField
									fullWidth
									variant="outlined"
									select
									name="furnished"
									label="Furnished"
									id="furnished"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.furnished}
									error={'furnished' in errors}
									helperText={errors.furnished}
								>
									{FURNISHED_OPTIONS.map((furnished_option, index) => (
										<MenuItem key={index} value={furnished_option}>
											{furnished_option}
										</MenuItem>
									))}
								</TextField>
								<TextField
									fullWidth
									variant="outlined"
									id="price"
									label="Rent Amount"
									name="price"
									value={values.price}
									onChange={handleChange}
									onBlur={handleBlur}
									error={'price' in errors}
									helperText={errors.price}
								/>
								<TextField
									fullWidth
									variant="outlined"
									select
									name="frequency"
									label="Frequency"
									id="frequency"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.frequency}
									error={'frequency' in errors}
									helperText={errors.frequency}
								>
									{FREQUENCY_OPTIONS.map((frequency_option, index) => (
										<MenuItem key={index} value={frequency_option}>
											{frequency_option}
										</MenuItem>
									))}
								</TextField>
								<TextField
									fullWidth
									variant="outlined"
									select
									name="checks"
									label="Checks"
									id="checks"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.checks}
									error={'checks' in errors}
									helperText={errors.checks}
								>
									{CHECKS_OPTIONS.map((check_option, index) => (
										<MenuItem key={index} value={check_option}>
											{check_option}
										</MenuItem>
									))}
								</TextField>
								<TextField
									fullWidth
									variant="outlined"
									id="deposit"
									label="Deposit"
									name="deposit"
									value={values.deposit}
									onChange={handleChange}
									onBlur={handleBlur}
									error={'deposit' in errors}
									helperText={errors.deposit}
								/>
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
									helperText={errors.lease_type}
								>
									{LEASE_OPTIONS.map((lease_option, index) => (
										<MenuItem key={index} value={lease_option}>
											{lease_option}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							{/** start of the adjacent column here */}
							<Grid sm={6} container item spacing={9} direction="column">
								{/** property media and others */}
								<Grid container item spacing={3}>
									<Grid item>
										<Typography variant="h6">Property Media</Typography>
										<Typography variant="subtitle1" gutterBottom>
											Photos | Floor Plans | Other Media
							</Typography>
									</Grid>
									<Grid item>
										<Box>
											<DropzoneAreaBase
												acceptedFiles={[
													"image/*",
													"application/*",
													"video/*",
												]}
												filesLimit={100}
												maxFileSize={100000000}
												showFileNamesInPreviews={false}
												showFileNames={true}
												showAlerts={false}
												dropzoneText={
													"Drag and drop an image here or click to upload"
												}
												onAdd={(files) => {
													setFieldValue("property_media", [
														...values.property_media,
														...files,
													]);
												}}
												onDrop={(files) => {
													setFieldValue("property_media", [
														...values.property_media,
														...files,
													]);
												}}
											/>
										</Box>
									</Grid>
									<Grid item>
										<div className={classes.gridListContainer}>
											<GridList
												cellHeight={300}
												className={classes.gridList}
											>
												<GridListTile
													key="Subheader"
													cols={2}
													style={{ height: "auto" }}
												>
													<ListSubheader component="div">
														Uploaded Files
										</ListSubheader>
												</GridListTile>
												{values.property_media.map(
													(propertyMediaFile, imageIndex) => {
														const fileName =
															typeof propertyMediaFile.file !=
																"undefined"
																? propertyMediaFile.file
																	.name
																: "File " + imageIndex;
														return (
															<GridListTile key={imageIndex}>
																<img
																	src={
																		propertyMediaFile.url ||
																		propertyMediaFile.data
																	}
																	alt={fileName}
																/>
																<GridListTileBar
																	title={fileName}
																	actionIcon={
																		<IconButton
																			aria-label={
																				fileName
																			}
																			className={
																				classes.icon
																			}
																			onClick={() => {
																				let propertyMediaFiles = [
																					...values.property_media];
																				let removedFile = propertyMediaFiles.splice(
																					imageIndex,
																					1
																				)[0];
																				if (
																					removedFile.id
																				) {
																					handleItemDelete(
																						removedFile.id,
																						"property_media"
																					);
																				}
																				setFieldValue(
																					"property_media",
																					propertyMediaFiles
																				);
																			}}
																		>
																			<DeleteIcon />
																		</IconButton>
																	}
																/>
															</GridListTile>
														);
													}
												)}
											</GridList>
										</div>
									</Grid>
								</Grid>
								{/** Other property features  ***/}
								<Grid
									item
									container
									direction="column"
									justify="space-evenly"
									alignItems="flex-start"
								>
									<Grid item>
										<Typography variant="h6">Unit Features</Typography>
										<Typography variant="subtitle1">Home Comforts</Typography>
									</Grid>
									<Grid item container spacing={4} direction="row">
										<Grid item>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															checked={values.has_balcony}
															onChange={(event) =>
																setFieldValue(
																	"has_balcony",
																	!values.has_balcony
																)
															}
															value={values.has_balcony}
														/>
													}
													label="Balcony"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={
																values.is_fully_furnished
															}
															onChange={(event) =>
																setFieldValue(
																	"is_fully_furnished",
																	!values.is_fully_furnished
																)
															}
															value={
																values.is_fully_furnished
															}
														/>
													}
													label="Fully Furnished"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={
																values.has_solid_wood_floor
															}
															onChange={(event) =>
																setFieldValue(
																	"has_solid_wood_floor",
																	!values.has_solid_wood_floor
																)
															}
															value={
																values.has_solid_wood_floor
															}
														/>
													}
													label="Solid Wood Floors"
												/>
											</FormGroup>
										</Grid>
										<Grid item>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															checked={
																values.has_air_conditioning
															}
															onChange={(event) =>
																setFieldValue(
																	"has_air_conditioning",
																	!values.has_air_conditioning
																)
															}
															value={
																values.has_air_conditioning
															}
														/>
													}
													label="Central Air Conditioning"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={values.on_high_floor}
															onChange={(event) =>
																setFieldValue(
																	"on_high_floor",
																	!values.on_high_floor
																)
															}
															value={values.on_high_floor}
														/>
													}
													label="On high floor"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={
																values.has_sea_water_view
															}
															onChange={(event) =>
																setFieldValue(
																	"has_sea_water_view",
																	!values.has_sea_water_view
																)
															}
															value={
																values.has_sea_water_view
															}
														/>
													}
													label="View of Sea/Water"
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</Grid>
								{/* end of other property features here */}
								<Grid item>
									{/* Owner and tenant info here */}
									<Typography variant="h6">Owner/Tenant</Typography>
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
										helperText="Property Owner"
									>
										{contacts.map((contact, index) => (
											<MenuItem key={index} value={contact.id}>
												{contact.first_name +
													" " +
													contact.last_name}
											</MenuItem>
										))}
									</TextField>
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

PropertyInputForm = connect(mapStateToProps, mapDispatchToProps)(PropertyInputForm);

export default withRouter(PropertyInputForm);

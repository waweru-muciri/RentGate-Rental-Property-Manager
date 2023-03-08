import React from "react";
import {
	FormHelperText,
	FormControl,
	InputLabel,
	Select,
	Chip,
	GridList,
	GridListTile,
	ListSubheader,
	GridListTileBar,
	IconButton,
	Box,
	Button,
	TextField,
	MenuItem,
	Grid,
	Typography,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { connect } from "react-redux";
import { withFormik } from "formik";
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
	getCurrencyOptions,
} from "../../assets/commonAssets.js";

const PROPERTY_TYPES = getPropertyTypes();

const PROPERTY_BEDS = getPropertyBeds();

const PROPERTY_BATHS = getPropertyBaths();

const CHECKS_OPTIONS = getCheckOptions();

const FREQUENCY_OPTIONS = getFrequencyOptions();

const LEASE_OPTIONS = getLeaseOptions();

const FURNISHED_OPTIONS = getFurnishedOptions();

const CURRENCY_OPTIONS = getCurrencyOptions();

let InputForm = ({
	values,
	touched,
	errors,
	handleChange,
	handleBlur,
	setFieldValue,
	handleSubmit,
	isSubmitting,
}) => {
	const classes = commonStyles();

	const ASSIGNED_TO = [];

	return (
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
						error={errors.assigned_to && touched.assigned_to}
						helperText={touched.assigned_to && errors.assigned_to}
						variant="outlined"
						type="text"
						name="assigned_to"
						id="assigned_to"
						label="Assigned To"
						value={values.assigned_to}
						onChange={handleChange}
						onBlur={handleBlur}
					>
						{ASSIGNED_TO.map((assigned_to, index) => (
							<MenuItem key={index} value={assigned_to}>
								{assigned_to}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						error={errors.ref && touched.ref}
						helperText={touched.ref && errors.ref}
						variant="outlined"
						type="text"
						name="ref"
						id="ref"
						label="Ref"
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
						error={errors.property_type && touched.property_type}
						helperText={
							touched.property_type && errors.property_type
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
						error={errors.beds && touched.beds}
						helperText={touched.beds && errors.beds}
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
						error={errors.baths && touched.baths}
						helperText={touched.baths && errors.baths}
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
						id="country"
						name="country"
						label="Country"
						value={values.country}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					<TextField
						fullWidth
						variant="outlined"
						id="region"
						label="Region"
						type="text"
						name="region"
						value={values.region}
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
						type="number"
						label="Floor"
						name="floor"
						value={values.floor}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					<TextField
						fullWidth
						variant="outlined"
						type="number"
						step="100"
						name="square_footage"
						id="square_footage"
						label="Square Footage"
						value={values.square_footage || 0}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.square_footage && touched.square_footage}
						helperText={
							touched.square_footage && errors.square_footage
						}
					/>
					<TextField
						fullWidth
						variant="outlined"
						id="view"
						type="text"
						label="View"
						name="view"
						value={values.view}
						onChange={handleChange}
						onBlur={handleBlur}
						error={'view' in errors}
						helperText={errors.view}
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
						select
						name="currency"
						label="Currency"
						id="currency"
						onBlur={handleBlur}
						onChange={handleChange}
						value={values.currency}
						error={'currency' in errors}
						helperText={errors.currency}
					>
						{CURRENCY_OPTIONS.map((furnished_option, index) => (
							<MenuItem key={index} value={furnished_option}>
								{furnished_option}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						variant="outlined"
						id="price"
						type="number"
						label="Price"
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
						id="sqm_price"
						disabled
						label="Price/Sqm"
						name="sqm_price"
						value={values.sqm_price}
						onChange={handleChange}
						onBlur={handleBlur}
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
						id="company_commission"
						type="number"
						label="Commission"
						name="company_commission"
						value={values.company_commission}
						onChange={handleChange}
						onBlur={handleBlur}
						error={'company_commission' in errors
						}
						helperText={
							errors.company_commission
						}
					/>
					<TextField
						fullWidth
						variant="outlined"
						id="deposit"
						type="number"
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
																		values.handleItemDelete(
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
							<Typography variant="h6">
								Other Property Features
							</Typography>
							<Typography variant="subtitle1">
								Home Comforts
							</Typography>
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
							{values.contacts.map((contact, index) => (
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
									const contactsWithDetails = values.contacts.filter(
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
								{values.contacts.map((contact, contactIndex) => (
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
						onClick={() => values.history.goBack()}
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
	);
};

let PropertyInputForm = withFormik({
	mapPropsToValues: (props) => {
		let propertyToEdit = props.propertyToEdit;
		if (!propertyToEdit) {
			propertyToEdit = {};
		}
		let property_media = props.propertiesMediaFiles.filter(
			({ property }) => property === propertyToEdit.id
		);
		return {
			id: propertyToEdit.id,
			ref: propertyToEdit.ref || "",
			region: propertyToEdit.region || "",
			assigned_to: propertyToEdit.assigned_to || "",
			city: propertyToEdit.city || "",
			postal_code: propertyToEdit.postal_code || "",
			address: propertyToEdit.address || "",
			floor: propertyToEdit.floor || 0,
			property_type: propertyToEdit.property_type || "",
			beds: propertyToEdit.beds || "",
			baths: propertyToEdit.baths || "",
			country: propertyToEdit.country || "",
			square_footage: propertyToEdit.square_footage || 0,
			currency: propertyToEdit.currency || "",
			price: propertyToEdit.price || 0,
			furnished: propertyToEdit.furnished || "",
			frequency: propertyToEdit.frequency || "",
			checks: propertyToEdit.checks || "",
			company_commission: propertyToEdit.company_commission || 0,
			deposit: propertyToEdit.deposit || 0,
			lease_type: propertyToEdit.lease_type || "",
			view: propertyToEdit.view || "",
			address_2: propertyToEdit.address_2 || "",
			has_solid_wood_floor: propertyToEdit.has_solid_wood_floor || false,
			has_balcony: propertyToEdit.has_balcony || false,
			is_fully_furnished: propertyToEdit.is_fully_furnished || false,
			has_air_conditioning: propertyToEdit.has_air_conditioning || false,
			has_sea_water_view: propertyToEdit.has_sea_water_view || false,
			on_high_floor: propertyToEdit.on_high_floor || false,
			tenants: propertyToEdit.tenants || [],
			property_media: property_media || [],
			owner: propertyToEdit.owner || "",
			contacts: props.contacts,
			history: props.history,
			handleItemDelete: props.handleItemDelete,
			handleItemSubmit: props.handleItemSubmit,
			match: props.match,
			error: props.error,
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		let errors = {};

		if (!values.ref) {
			errors.ref = "Ref Required";
		}
		if (!values.beds) {
			errors.beds = "Beds is Required";
		}
		if (!values.baths) {
			errors.baths = "Baths is Required";
		}
		if (!values.furnished) {
			errors.furnished = "Furnished is Required";
		}
		if (!values.property_type) {
			errors.property_type = "Type is Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		let propertyFilesToSave = values.property_media.filter(
			(file) => !file.id
		);
		let property = {
			id: values.id,
			ref: values.ref,
			region: values.region,
			city: values.city,
			postal_code: values.postal_code,
			address: values.address,
			floor: values.floor,
			property_type: values.property_type,
			beds: values.beds,
			baths: values.baths,
			country: values.country,
			square_footage: values.square_footage,
			currency: values.currency,
			price: values.price,
			furnished: values.furnished,
			frequency: values.frequency,
			checks: values.checks,
			company_commission: values.company_commission,
			deposit: values.deposit,
			lease_type: values.lease_type,
			view: values.view,
			address_2: values.address_2,
			has_solid_wood_floor: values.has_solid_wood_floor,
			has_balcony: values.has_balcony,
			is_fully_furnished: values.is_fully_furnished,
			has_air_conditioning: values.has_air_conditioning,
			has_sea_water_view: values.has_sea_water_view,
			on_high_floor: values.on_high_floor,
			tenants: values.tenants,
			owner: values.owner,
		};
		values.handleItemSubmit(property, "properties").then((propertyId) => {
			if (propertyFilesToSave.length) {
				let fileDownloadUrlsPromises = uploadFilesToFirebase(
					propertyFilesToSave
				);
				Promise.all(fileDownloadUrlsPromises).then(
					(fileDownloadUrls) => {
						//here is the fileDownloadUrls array
						fileDownloadUrls.forEach((fileDownloadUrl) => {
							let fileDownloadUrlObject = {
								url: fileDownloadUrl,
								property: propertyId,
							};
							handleItemFormSubmit(
								fileDownloadUrlObject,
								"property_media"
							);
						});
					}
				);
			}
		});
		resetForm({});
		if (values.id) {
			values.history.goBack();
		}
	},
	enableReinitialize: true,
	displayName: "Property Input Form", // helps with React DevTools
})(InputForm);

const mapStateToProps = (state) => {
	return {
		properties: state.properties,
		propertiesMediaFiles: state.mediaFiles,
		error: state.error,
		contacts: state.contacts,
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

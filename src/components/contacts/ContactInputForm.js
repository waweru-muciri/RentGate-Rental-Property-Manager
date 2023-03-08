import React from "react";
import {
	Avatar,
	Typography,
	Button,
	TextField,
	MenuItem,
	Grid,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { withFormik } from "formik";
import {
	handleItemFormSubmit,
	uploadFilesToFirebase,
} from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import {
	getContactTitles,
	getGendersList,
	getMobilePhoneTypes,
	getContactTypes,
	getAddressTypes,
} from "../../assets/commonAssets.js";
import { DropzoneDialog } from "material-ui-dropzone";
import moment from "moment";

const CONTACT_TITLES = getContactTitles();
const ASSIGNED_USERS = [];
const GENDERS_LIST = getGendersList();
const MOBILE_TYPES = getMobilePhoneTypes();
const CONTACT_TYPES = getContactTypes();
const ADDRESS_TYPES = getAddressTypes();

let InputForm = ({
	values,
	touched,
	errors,
	handleChange,
	handleBlur,
	handleSubmit,
	setFieldValue,
	isSubmitting,
}) => {

	let styles = commonStyles();

	const [imageDialogState, toggleImageDialogState] = React.useState(false);

	const toggleImageDialog = () => {
		toggleImageDialogState(!imageDialogState);
	};

	return (
		<form
			className={styles.form}
			method="post"
			id="contactInputForm"
			onSubmit={handleSubmit}
		>
			<Grid container>
				<Grid
					container
					spacing={4}
					justify="center"
					alignItems="flex-start"
					direction="row"
				>
					<Grid
						md={5}
						lg={5}
						justify="center"
						container
						item
						direction="column"
						spacing={2}
					>
						<Grid
							item
							container
							justify="flex-start"
							spacing={4}
							alignItems="center"
						>
							<Grid key={1} item>
								<Avatar
									alt="Contact Image"
									src={values.contact_avatar_url}
									className={styles.largeAvatar}
								/>
							</Grid>
							<Grid key={2} item>
								<Button
									variant="contained"
									color="primary"
									onClick={() => toggleImageDialog()}
								>
									Add Image
								</Button>

								<DropzoneDialog
									filesLimit={1}
									acceptedFiles={["image/*"]}
									cancelButtonText={"cancel"}
									submitButtonText={"submit"}
									maxFileSize={5000000}
									open={imageDialogState}
									onClose={() => toggleImageDialog()}
									onSave={(files) => {
										console.log("Files:", files[0].data);
										setFieldValue('contact_image', files[0])
										toggleImageDialog();
									}}
									showPreviews={false}
									showFileNamesInPreview={true}
								/>
							</Grid>
						</Grid>
						<Typography variant="h6">Personal Info</Typography>
						<TextField
							select
							error={errors.assigned_to && touched.assigned_to}
							helperText={
								touched.assigned_to && errors.assigned_to
							}
							variant="outlined"
							type="text"
							name="assigned_to"
							id="assigned_to"
							label="Assigned To"
							value={values.assigned_to}
							onChange={handleChange}
							onBlur={handleBlur}
						>
							{ASSIGNED_USERS.map((assigned_to, index) => (
								<MenuItem key={index} value={assigned_to}>
									{assigned_to}
								</MenuItem>
							))}
						</TextField>
						<TextField
							variant="outlined"
							select
							name="contact_type"
							label="Type of Contact"
							id="contact_type"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.contact_type}
							error={errors.contact_type && touched.contact_type}
							helperText={
								touched.contact_type && errors.contact_type
							}
						>
							{CONTACT_TYPES.map((contact_type, index) => (
								<MenuItem key={index} value={contact_type}>
									{contact_type}
								</MenuItem>
							))}
						</TextField>
						<TextField
							variant="outlined"
							select
							name="title"
							label="Title"
							id="title"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.title}
							error={errors.title && touched.title}
							helperText={touched.title && errors.title}
						>
							{CONTACT_TITLES.map((contact_title, index) => (
								<MenuItem key={index} value={contact_title}>
									{contact_title}
								</MenuItem>
							))}
						</TextField>
						<TextField
							variant="outlined"
							id="first_name"
							name="first_name"
							label="First Name"
							value={values.first_name}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.first_name && touched.first_name}
							helperText={touched.first_name && errors.first_name}
						/>
						<TextField
							variant="outlined"
							id="last_name"
							name="last_name"
							label="Last Name"
							value={values.last_name}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.last_name && touched.last_name}
							helperText={touched.last_name && errors.last_name}
						/>
						<TextField
							variant="outlined"
							id="company_name"
							name="company_name"
							label="Company Name"
							value={values.company_name}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<TextField
							variant="outlined"
							select
							name="gender"
							label="Gender"
							id="gender"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.gender}
							error={errors.gender && touched.gender}
							helperText={touched.gender && errors.gender}
						>
							{GENDERS_LIST.map((gender_type, index) => (
								<MenuItem key={index} value={gender_type}>
									{gender_type}
								</MenuItem>
							))}
						</TextField>
						<TextField
							variant="outlined"
							id="date_of_birth"
							name="date_of_birth"
							label="Date of Birth"
							type="date"
							value={values.date_of_birth}
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								errors.date_of_birth && touched.date_of_birth
							}
							helperText={
								touched.date_of_birth && errors.date_of_birth
							}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							variant="outlined"
							id="id_number"
							label="ID No."
							type="text"
							name="id_number"
							value={values.id_number}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<TextField
							type="date"
							variant="outlined"
							id="id_issue_date"
							name="id_issue_date"
							label="ID Date of Issue"
							value={values.id_issue_date}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="ID Place of Issue"
							variant="outlined"
							id="id_issue_place"
							type="text"
							name="id_issue_place"
							error={
								errors.id_issue_place && touched.id_issue_place
							}
							helperText={
								touched.id_issue_place && errors.id_issue_place
							}
							value={values.id_issue_place}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Grid>
					{/* start of Contact Details column */}
					<Grid
						md={7}
						lg={7}
						container
						justify="flex-start"
						item
						direction="column"
					>
						<Typography variant="h6">Contact Details</Typography>
						<Grid item container spacing={2}>
							{/* start of mobile textfield and types row */}
							{values.contactPhoneNumbers.map(
								(phoneNumber, mobileNumberIndex) => (
									<Grid
										item
										container
										key={mobileNumberIndex}
										spacing={2}
										justify="flex-start"
										direction="row"
									>
										<Grid item md={7}>
											<TextField
												fullWidth
												variant="outlined"
												id={`mobile_number${mobileNumberIndex}`}
												name={`mobile_number${mobileNumberIndex}`}
												label="Mobile"
												value={
													phoneNumber.phone_number ||
													""
												}
												onChange={(event) => {
													let editedPhoneNumbers = values.contactPhoneNumbers.map(
														(
															contactPhoneNumber,
															index
														) =>
															index ===
															mobileNumberIndex
																? Object.assign(
																		contactPhoneNumber,
																		{
																			phone_number:
																				event
																					.target
																					.value,
																		}
																  )
																: contactPhoneNumber
													);
													setFieldValue(
														"contactPhoneNumbers",
														editedPhoneNumbers
													);
												}}
												onBlur={handleBlur}
												helperText="Mobile"
											/>
										</Grid>
										<Grid item md={5}>
											<TextField
												fullWidth
												variant="outlined"
												select
												name="phone_type"
												label="Mobile Type"
												id="phone_type"
												onBlur={handleBlur}
												onChange={(
													mobileTypeChangeEvent
												) => {
													const changedPhoneNumbers = values.contactPhoneNumbers.map(
														(
															phoneNumberObject,
															index
														) =>
															index ===
															mobileNumberIndex
																? Object.assign(
																		phoneNumberObject,
																		{
																			phone_type:
																				mobileTypeChangeEvent
																					.target
																					.value,
																		}
																  )
																: phoneNumberObject
													);
													setFieldValue(
														"contactPhoneNumbers",
														changedPhoneNumbers
													);
												}}
												value={
													phoneNumber.phone_type || ""
												}
												helperText="Mobile Type"
											>
												{MOBILE_TYPES.map(
													(phone_type, index) => (
														<MenuItem
															key={index}
															value={phone_type}
														>
															{phone_type}
														</MenuItem>
													)
												)}
											</TextField>
										</Grid>
									</Grid>
								)
							)}
							{/* start of contact emails column */}
							{values.contactEmails.map(
								(contactEmail, emailIndex) => (
									<Grid
										item
										key={emailIndex}
										container
										spacing={2}
										justify="flex-start"
										direction="row"
									>
										<Grid item md={7}>
											<TextField
												fullWidth
												type="email"
												variant="outlined"
												id={`email${emailIndex}`}
												name={`email${emailIndex}`}
												label="Email"
												value={contactEmail.email}
												onChange={(
													emailValueChangeEvent
												) => {
													const changedEmails = values.contactEmails.map(
														(emailObject, index) =>
															index === emailIndex
																? Object.assign(
																		emailObject,
																		{
																			email:
																				emailValueChangeEvent
																					.target
																					.value,
																		}
																  )
																: emailObject
													);
													setFieldValue(
														"contactEmails",
														changedEmails
													);
												}}
												onBlur={handleBlur}
												helperText="Email"
											/>
										</Grid>
										<Grid item md={5}>
											<TextField
												fullWidth
												variant="outlined"
												select
												name="email_type"
												label="Email Type"
												id="email_type"
												onBlur={handleBlur}
												onChange={(
													emailTypeChangeEvent
												) => {
													const changedEmails = values.contactEmails.map(
														(emailObject, index) =>
															index === emailIndex
																? Object.assign(
																		emailObject,
																		{
																			email_type:
																				emailTypeChangeEvent
																					.target
																					.value,
																		}
																  )
																: emailObject
													);
													setFieldValue(
														"contactEmails",
														changedEmails
													);
												}}
												value={
													contactEmail.email_type ||
													""
												}
												helperText="Email Type"
											>
												{MOBILE_TYPES.map(
													(phone_type, index) => (
														<MenuItem
															key={index}
															value={phone_type}
														>
															{phone_type}
														</MenuItem>
													)
												)}
											</TextField>
										</Grid>
									</Grid>
								)
							)}
							{/* Start of contact faxes column */}
							{values.contactFaxes.map((contactFax, faxIndex) => (
								<Grid
									item
									key={faxIndex}
									container
									spacing={2}
									justify="flex-start"
									direction="row"
								>
									<Grid item md={7}>
										<TextField
											fullWidth
											variant="outlined"
											id={`fax${faxIndex}`}
											name={`fax${faxIndex}`}
											label="Fax"
											value={contactFax.fax || ""}
											onChange={(faxValueChangeEvent) => {
												const changedFaxes = values.contactFaxes.map(
													(faxObject, index) =>
														index === faxIndex
															? Object.assign(
																	faxObject,
																	{
																		fax:
																			faxValueChangeEvent
																				.target
																				.value,
																	}
															  )
															: faxObject
												);
												setFieldValue(
													"contactFaxes",
													changedFaxes
												);
											}}
											onBlur={handleBlur}
											helperText="Fax"
										/>
									</Grid>
									<Grid item md={5}>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="fax_type"
											label="Fax Type"
											id="fax_type"
											onBlur={handleBlur}
											onChange={(faxTypeChangeEvent) => {
												const changedFaxes = values.contactFaxes.map(
													(faxObject, index) =>
														index === faxIndex
															? Object.assign(
																	faxObject,
																	{
																		fax_type:
																			faxTypeChangeEvent
																				.target
																				.value,
																	}
															  )
															: faxObject
												);
												setFieldValue(
													"contactFaxes",
													changedFaxes
												);
											}}
											value={contactFax.fax_type || ""}
											helperText="Fax Type"
										>
											{MOBILE_TYPES.map(
												(phone_type, index) => (
													<MenuItem
														key={index}
														value={phone_type}
													>
														{phone_type}
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							))}
							{/* Start of contact addresses row */}

							{values.contactAddresses.map(
								(contactAddress, addressIndex) => (
									<Grid
										item
										key={addressIndex}
										container
										spacing={2}
										justify="flex-start"
										direction="row"
									>
										<Grid item md={7}>
											<TextField
												fullWidth
												variant="outlined"
												id={`address${addressIndex}`}
												name={`address${addressIndex}`}
												label="Address"
												value={
													contactAddress.address || ""
												}
												onChange={(
													addressChangeEvent
												) => {
													const changedAddresses = values.contactAddresses.map(
														(
															addressObject,
															index
														) =>
															index ===
															addressIndex
																? Object.assign(
																		addressObject,
																		{
																			address:
																				addressChangeEvent
																					.target
																					.value,
																		}
																  )
																: addressObject
													);
													setFieldValue(
														"contactAddresses",
														changedAddresses
													);
												}}
												onBlur={handleBlur}
												helperText="Address"
											/>
										</Grid>
										<Grid item md={5}>
											<TextField
												fullWidth
												variant="outlined"
												select
												name="address_type"
												label="Address Type"
												id="address_type"
												onBlur={handleBlur}
												onChange={(
													addressChangeEvent
												) => {
													const changedAddresses = values.contactAddresses.map(
														(
															addressObject,
															index
														) =>
															index ===
															addressIndex
																? Object.assign(
																		addressObject,
																		{
																			address_type:
																				addressChangeEvent
																					.target
																					.value,
																		}
																  )
																: addressObject
													);
													setFieldValue(
														"contactAddresses",
														changedAddresses
													);
												}}
												value={
													contactAddress.address_type ||
													""
												}
												helperText="Address Type"
											>
												{ADDRESS_TYPES.map(
													(phone_type, index) => (
														<MenuItem
															key={index}
															value={phone_type}
														>
															{phone_type}
														</MenuItem>
													)
												)}
											</TextField>
										</Grid>
									</Grid>
								)
							)}
						</Grid>
						{/* end of phone textfield and types row */}
						<Typography variant="h6">
							Social Media Details
						</Typography>
						<TextField
							fullWidth
							type="url"
							variant="outlined"
							id="facebook_url"
							name="facebook_url"
							label="Facebook"
							value={values.facebook_url}
							onChange={handleChange}
							onBlur={handleBlur}
							helperText="Facebook Link"
						/>
						<TextField
							fullWidth
							type="url"
							variant="outlined"
							id="linkedin_url"
							name="linkedin_url"
							label="Facebook"
							value={values.linkedin_url}
							onChange={handleChange}
							onBlur={handleBlur}
							helperText="LinkedIn Link"
						/>
						<TextField
							fullWidth
							type="url"
							variant="outlined"
							id="skype_url"
							name="skype_url"
							label="Skype"
							value={values.skype_url}
							onChange={handleChange}
							onBlur={handleBlur}
							helperText="Skype Link"
						/>
					</Grid>
				</Grid>
				{/** end of contact details grid **/}

				<Grid
					item
					container
					justify="center"
					direction="row"
					className={styles.buttonBox}
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
						form="contactInputForm"
						onClick={() => handleSubmit()}
						disabled={isSubmitting}
					>
						Save
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

let ContactInputForm = withFormik({
	mapPropsToValues: (props) => {
		const currentDate = moment().format("YYYY-MM-DD");
		let contactToEdit = props.contactToEdit;
		if (!contactToEdit) {
			contactToEdit = {};
		}
		let contactPhoneNumbers = props.contact_phone_numbers.filter(
			({ contact }) => contact === contactToEdit.id
		);
		contactPhoneNumbers = contactPhoneNumbers.length
			? contactPhoneNumbers
			: [{}];
		let contactEmails = props.contact_emails.filter(
			({ contact }) => contact === contactToEdit.id
		);
		contactEmails = contactEmails.length ? contactEmails : [{}];
		let contactAddresses = props.contact_addresses.filter(
			({ contact }) => contact === contactToEdit.id
		);
		contactAddresses = contactAddresses.length ? contactAddresses : [{}];
		let contactFaxes = props.contact_faxes.filter(
			({ contact }) => contact === contactToEdit.id
		);
		contactFaxes = contactFaxes.length ? contactFaxes : [{}];
		return {
			id: contactToEdit.id,
			assigned_to: contactToEdit.assigned_to || "",
			contact_avatar_url: contactToEdit.contact_avatar_url || "",
			id_number: contactToEdit.id_number || "",
			id_issue_date: contactToEdit.id_issue_date || currentDate,
			id_issue_place: contactToEdit.id_issue_place || "",
			contact_type: contactToEdit.contact_type || "",
			title: contactToEdit.title || "",
			date_of_birth: contactToEdit.date_of_birth || currentDate,
			gender: contactToEdit.gender || "",
			first_name: contactToEdit.first_name || "",
			last_name: contactToEdit.last_name || "",
			company_name: contactToEdit.company_name || "",
			linkedin_url: contactToEdit.linkedin_url || "",
			skype_url: contactToEdit.skype_url || "",
			facebook_url: contactToEdit.facebook_url || "",
			contactEmails: contactEmails,
			contactPhoneNumbers: contactPhoneNumbers,
			contactFaxes: contactFaxes,
			contactAddresses: contactAddresses,
			history: props.history,
			match: props.match,
			error: props.error,
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		const errors = {};
		if (!values.title) {
			errors.title = "Title is Required";
		}
		if (!values.contact_type) {
			errors.contact_type = "Type of Contact is Required";
		}
		//				if (!values.assigned_to) {
		//					errors.assigned_to= 'Assigned To is Required';
		//				}
		if (!values.first_name) {
			errors.first_name = "First Name is Required";
		}
		if (!values.last_name) {
			errors.last_name = "Last Name is Required";
		}
		if (!values.gender) {
			errors.gender = "Gender is Required";
		}
		if (!values.id_number) {
			errors.id_number = "ID is Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		let contact = {
			id: values.id,
			assigned_to: values.assigned_to || "",
			id_number: values.id_number,
			id_issue_date: values.id_issue_date,
			id_issue_place: values.id_issue_place,
			contact_type: values.contact_type,
			title: values.title,
			date_of_birth: values.date_of_birth,
			gender: values.gender,
			first_name: values.first_name,
			last_name: values.last_name,
			company_name: values.company_name,
			linkedin_url: values.linkedin_url,
			skype_url: values.skype_url,
			facebook_url: values.facebook_url,
		};
		console.log("Contact object => ", contact);
		//first upload the image to firebase
		if (values.contact_image) {
			uploadFilesToFirebase(values.contact_image).then(
				(fileDownloadUrl) => {
					contact.contact_avatar_url = fileDownloadUrl;
				}
			);
		}

		handleItemFormSubmit(contact, "contacts").then((contactId) => {
			values.contactPhoneNumbers.forEach((contactPhoneNumber) => {
				if (contactPhoneNumber.phone_number) {
					handleItemFormSubmit(
						{ ...contactPhoneNumber, contact: contactId },
						"contact_phone_numbers"
					);
				}
			});
			values.contactEmails.forEach((contactEmail) => {
				if (contactEmail.email) {
					handleItemFormSubmit(
						{ ...contactEmail, contact: contactId },
						"contact_emails"
					);
				}
			});
			values.contactFaxes.forEach((contactFax) => {
				if (contactFax.fax) {
					handleItemFormSubmit(
						{ ...contactFax, contact: contactId },
						"contact_faxes"
					);
				}
			});
			values.contactAddresses.forEach((contactAddress) => {
				if (contactAddress.address) {
					handleItemFormSubmit(
						{ ...contactAddress, contact: contactId },
						"contact_addresses"
					);
				}
			});
		});
		resetForm({});
		if (values.id) {
			values.history.goBack();
		}
	},
	enableReinitialize: false,
	displayName: "Contact Input Form", // helps with React DevTools
})(InputForm);

const mapStateToProps = (state) => {
	return {
		contact_emails: state.contact_emails,
		contact_phone_numbers: state.contact_phone_numbers,
		contact_faxes: state.contact_faxes,
		contact_addresses: state.contact_addresses,
	};
};

ContactInputForm = connect(mapStateToProps)(ContactInputForm);

export default withRouter(ContactInputForm);

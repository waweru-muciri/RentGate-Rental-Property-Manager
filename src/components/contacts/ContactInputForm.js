import React from "react";
import {
	Box,
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
import { Formik } from "formik";
import {
	handleItemFormSubmit,
	uploadFilesToFirebase,
	deleteUploadedFileByUrl,
} from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import {
	getContactTitles,
	getGendersList,
	getContactTypes,
} from "../../assets/commonAssets.js";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import moment from "moment";

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();
const CONTACT_TYPES = getContactTypes();


const ContactSchema = Yup.object().shape({
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is required"),
	title: Yup.string().trim().required("Title is required"),
	gender: Yup.string().trim().required("Gender is required"),
	id_number: Yup.string().trim().required("ID Number is required"),
	assigned_to: Yup.string().trim().required("Assigned To is required"),
	contact_type: Yup.string().trim().required("Contact Type is required"),
	contact_email: Yup.string().trim().email().required('Contact Email is Required'),
	present_address: Yup.string().trim().required('Contact Address is Required'),
	personal_mobile_number: Yup.string().trim().required('Contact Phone Number is Required'),
	skype_url: Yup.string().trim().url(),
	facebook_url: Yup.string().trim().url(),
	linkedin_url: Yup.string().trim().url(),
	date_of_birth: Yup.date().required("Date of Birth is Required"),
});
const currentDate = moment().format("YYYY-MM-DD");

let ContactInputForm = (props) => {

	const { currentUser, users, history, handleItemSubmit } = props;
	let classes = commonStyles();
	const [imageDialogState, toggleImageDialogState] = React.useState(false);

	const toggleImageDialog = () => {
		toggleImageDialogState(!imageDialogState);
	};

	let contactToEdit = typeof props.contactToEdit !== 'undefined' ? props.contactToEdit : {};
	const contactValues = {
		id: contactToEdit.id,
		assigned_to: contactToEdit.assigned_to || currentUser.id,
		contact_avatar_url: contactToEdit.contact_avatar_url || "",
		id_number: contactToEdit.id_number || "",
		present_address: contactToEdit.present_address || "",
		permanent_address: contactToEdit.permanent_address || "",
		contact_email: contactToEdit.contact_email || "",
		personal_mobile_number: contactToEdit.personal_mobile_number || "",
		work_mobile_number: contactToEdit.work_mobile_number || "",
		custom_mobile_number: contactToEdit.custom_mobile_number || "",
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
		contact_images: [],
	};

	return (
		<Formik
			initialValues={contactValues}
			enableReinitialize validationSchema={ContactSchema}
			onSubmit={(values, { resetForm }) => {
				let contact = {
					id: values.id,
					assigned_to: values.assigned_to,
					id_number: values.id_number,
					id_issue_date: values.id_issue_date,
					id_issue_place: values.id_issue_place,
					contact_type: values.contact_type,
					title: values.title,
					date_of_birth: values.date_of_birth,
					present_address: values.present_address,
					permanent_address: values.permanent_address,
					contact_email: values.contact_email,
					personal_mobile_number: values.personal_mobile_number,
					work_mobile_number: values.work_mobile_number,
					custom_mobile_number: values.custom_mobile_number,
					gender: values.gender,
					first_name: values.first_name,
					last_name: values.last_name,
					company_name: values.company_name,
					linkedin_url: values.linkedin_url,
					skype_url: values.skype_url,
					facebook_url: values.facebook_url,
				};
				//first upload the image to firebase
				if (values.contact_images.length) {
					//if the user had previously uploaded an avatar
					// then delete it here and replace the url with new uploaded image
					if (values.contact_avatar_url) {
						//delete file from storage
						deleteUploadedFileByUrl(values.contact_avatar_url);
					}
					//upload the first and only image in the contact images array
					var fileDownloadUrl = uploadFilesToFirebase([values.contact_images[0]])
					contact.contact_avatar_url = fileDownloadUrl;
				}

				handleItemSubmit(contact, "contacts").then((contactId) => {
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
						id="contactInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container direction="column" justify="flex-start">
							<Grid container spacing={4} direction="row">
								<Grid
									md={6}
									lg={6}
									container
									item
									direction="column"
									spacing={2}
								>
									<Grid item>
										<Typography variant="h6">Personal Info</Typography>
										<Box>
											<Typography variant="subtitle2">
												Contact Image
								</Typography>
										</Box>
									</Grid>
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
												src={
													typeof values.contact_images[0] !==
														"undefined"
														? values.contact_images[0].data
														: values.contact_avatar_url
												}
												className={classes.largeAvatar}
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

											<DropzoneDialogBase
												filesLimit={1}
												fileObjects={values.contact_images}
												acceptedFiles={["image/*"]}
												cancelButtonText={"cancel"}
												submitButtonText={"submit"}
												maxFileSize={5000000}
												open={imageDialogState}
												onClose={() => toggleImageDialog()}
												onDelete={() => {
													setFieldValue("contact_images", []);
												}}
												onSave={(files) => {
													setFieldValue("contact_images", files);
													toggleImageDialog();
												}}
												onAdd={(files) => {
													setFieldValue("contact_images", files);
													toggleImageDialog();
												}}
												showPreviews={true}
												showFileNamesInPreview={true}
											/>
										</Grid>
									</Grid>
									<TextField
										select
										error={'assigned_to' in errors}
										helperText={
											errors.assigned_to
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
										{users.map((user, index) => (
											<MenuItem key={index} value={user.id}>
												{user.first_name + ' ' + user.last_name}
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
										error={'contact_type' in errors}
										helperText={
											errors.contact_type
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
										error={'title' in errors}
										helperText={errors.title}
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
										error={'first_name' in errors}
										helperText={errors.first_name}
									/>
									<TextField
										variant="outlined"
										id="last_name"
										name="last_name"
										label="Last Name"
										value={values.last_name}
										onChange={handleChange}
										onBlur={handleBlur}
										error={'last_name' in errors}
										helperText={errors.last_name}
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
										error={'gender' in errors}
										helperText={errors.gender}
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
											'date_of_birth' in errors
										}
										helperText={
											errors.date_of_birth
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
										error={
											'id_number' in errors
										}
										helperText={
											errors.id_number
										}
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
										value={values.id_issue_place}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Grid>
								{/* start of Contact Details column */}
								<Grid md={6}
									lg={6}
									container
									item
									direction="column"
									spacing={1}>
									<Grid item>
										<Typography variant="h6">
											Contact Details
							</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2"> Phone Numbers </Typography>
									</Grid>
									{/** start of mobile textfield and types columns **/}
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id={"personal_mobile_number"}
											name={"personal_mobile_number"}
											label="Personal Mobile Number"
											onChange={handleChange}
											onBlur={handleBlur}
											error={
												'personal_mobile_number' in errors
											}
											helperText={
												errors.personal_mobile_number
											}
											value={values.personal_mobile_number}
										/>
									</Grid>
									<Grid item >
										<TextField
											fullWidth
											variant="outlined"
											id={"work_mobile_number"}
											name={"work_mobile_number"}
											label="Work Mobile Number"
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Work Mobile Number"
											value={values.work_mobile_number}
										/>
									</Grid>
									<Grid item >
										<TextField
											fullWidth
											variant="outlined"
											id={"custom_mobile_number"}
											name={"custom_mobile_number"}
											label="Custom Mobile Number"
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Custom Mobile Number"
											value={values.custom_mobile_number}
										/>
									</Grid>
									{/* start of contact emails column */}
									<Grid item>
										<Typography variant="subtitle2">
											Emails
								</Typography>
									</Grid>
									<Grid item >
										<TextField
											fullWidth
											type="email"
											variant="outlined"
											id={'contact_email'}
											name={'contact_email'}
											label="Contact Email"
											value={values.contact_email}
											onChange={handleChange}
											onBlur={handleBlur}
											error={
												'contact_email' in errors
											}
											helperText={
												errors.contact_email
											}
										/>
									</Grid>
									{/* Start of contact addresses row */}
									<Grid item>
										<Typography variant="subtitle2">
											Addresses
								</Typography>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id={"present_address"}
											name={"present_address"}
											label="Present Address"
											value={
												values.present_address
											}
											error={
												"present_address" in errors
											}
											onChange={handleChange}
											onBlur={handleBlur}
											helperText={
												errors.present_address
											}
										/>
										<TextField
											fullWidth
											variant="outlined"
											id={"permanent_address"}
											name={"permanent_address"}
											label="Permanent Address"
											value={
												values.permanent_address
											}
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Permanent Address"
										/>
									</Grid>
							</Grid>
							</Grid >
							{/** end of contact details grid **/}
							< Grid
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
									form="contactInputForm"
									disabled={isSubmitting}
								>
									Save
					</Button>
							</Grid >
						</Grid >
					</form >
				)}
		</Formik>
	);
};


const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		users: state.users,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

ContactInputForm = connect(mapStateToProps, mapDispatchToProps)(ContactInputForm);

export default withRouter(ContactInputForm);

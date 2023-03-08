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
import { handleItemFormSubmit } from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
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
	isSubmitting,
}) => {
	const contactId = "f5t5sYom3sDPrTPBI568";

	let styles = commonStyles();

	const [imageDialogState, toggleImageDialogState] = React.useState(false);
	const [contactPhoneNumbers, setContactPhoneNumbers] = React.useState([{}]);
	const [contactAddresses, setContactAddresses] = React.useState([{}]);
	const [contactEmails, setContactEmails] = React.useState([{}]);
	const [contactFaxes, setContactFaxes] = React.useState([{}]);

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
						md={6}
						lg={6}
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
									src={values.contact_avatar}
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
									filesLimit={3}
									acceptedFiles={["image/*"]}
									cancelButtonText={"cancel"}
									submitButtonText={"submit"}
									maxFileSize={5000000}
									open={imageDialogState}
									onClose={() => toggleImageDialog()}
									onSave={(files) => {
										console.log("Files:", files);
										toggleImageDialog();
									}}
									showPreviews={true}
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
							required
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
							required
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
							required
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
							required
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
							required
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
							required
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
						md={6}
						lg={6}
						container
						justify="flex-start"
						item
						direction="column"
					>
						<Typography variant="h6">Contact Details</Typography>
						<Grid item container spacing={2}>
							{/* start of mobile textfield and types row */}
							{contactPhoneNumbers.map((phone_number, index) => (
								<Grid
									item
									container
									key={index}
									spacing={2}
									justify="flex-start"
									direction="row"
								>
									<Grid item md={7}>
										<TextField
											fullWidth
											required
											variant="outlined"
											id="mobile_number"
											name="mobile_number"
											label="Mobile"
											value={values.mobile_number}
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Mobile"
										/>
									</Grid>
									<Grid item md={5}>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="mobile_type"
											label="Mobile Type"
											id="mobile_type"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.mobile_type || ""}
											required
											helperText="Mobile Type"
										>
											{MOBILE_TYPES.map(
												(mobile_type, index) => (
													<MenuItem
														key={index}
														value={mobile_type}
													>
														{mobile_type}
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							))}
							{/* start of contact emails column */}
							{contactEmails.map((email, index) => (
								<Grid
									item
									key={index}
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
											id="email"
											name="email"
											label="Email"
											value={values.email}
											onChange={handleChange}
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
											onChange={handleChange}
											value={values.email_type || ""}
											helperText="Email Type"
										>
											{MOBILE_TYPES.map(
												(mobile_type, index) => (
													<MenuItem
														key={index}
														value={mobile_type}
													>
														{mobile_type}
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							))}
							{/* Start of contact faxes column */}
							{contactFaxes.map((fax, index) => (
								<Grid
									item
									key={index}
									container
									spacing={2}
									justify="flex-start"
									direction="row"
								>
									<Grid item md={7}>
										<TextField
											fullWidth
											variant="outlined"
											id="fax"
											name="fax"
											label="Fax"
											value={values.fax}
											onChange={handleChange}
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
											onChange={handleChange}
											value={values.fax_type || ""}
											helperText="Fax Type"
										>
											{MOBILE_TYPES.map(
												(mobile_type, index) => (
													<MenuItem
														key={index}
														value={mobile_type}
													>
														{mobile_type}
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							))}
							{/* Start of contact addresses row */}

							{contactAddresses.map((address, index) => (
								<Grid
									item
									key={index}
									container
									spacing={2}
									justify="flex-start"
									direction="row"
								>
									<Grid item md={7}>
										<TextField
											fullWidth
											variant="outlined"
											id="address"
											name="address"
											label="Address"
											value={values.address}
											onChange={handleChange}
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
											onChange={handleChange}
											value={values.address_type || ""}
											helperText="Address Type"
										>
											{ADDRESS_TYPES.map(
												(mobile_type, index) => (
													<MenuItem
														key={index}
														value={mobile_type}
													>
														{mobile_type}
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							))}
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
						component={Link}
						onClick = { () => values.history.goBack()}
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
		return {
			id: contactToEdit.id,
			assigned_to: contactToEdit.assigned_to || "",
			contact_avatar: contactToEdit.contact_avatar || "",
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
			contact_emails: props.contact_emails,
			contact_phone_numbers: props.contact_phone_numbers,
			contact_faxes: props.contact_faxes,
			contact_addresses: props.contact_addresses,
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
		window.alert("Submit called");
		let contact = {
			id: values.id,
			assigned_to: values.assigned_to || null,
			contact_avatar: values.contact_avatar,
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
		values.submitForm(contact);
		resetForm({});
	},
	enableReinitialize: true,
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

const mapDispatchToProps = (dispatch) => {
	return {
		submitForm: (contact) => {
			dispatch(handleItemFormSubmit(contact, "contacts"));
		},
	};
};

ContactInputForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactInputForm);

export default withRouter(ContactInputForm);

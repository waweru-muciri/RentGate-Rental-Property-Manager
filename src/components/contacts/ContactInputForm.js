import React from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
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
} from "../../assets/commonAssets.js";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();


const ContactSchema = Yup.object().shape({
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is required"),
	title: Yup.string().trim().required("Title is required"),
	gender: Yup.string().trim().required("Gender is required"),
	id_number: Yup.string().trim().required("ID Number is required"),
	contact_email: Yup.string().trim().email(),
	alternate_email: Yup.string().trim().email(),
	present_address: Yup.string().trim().default(''),
	personal_mobile_number: Yup.string().trim().required('Personal Mobile Number is Required'),
	date_of_birth: Yup.date().required("Date of Birth is Required"),
});

const currentDate = format(startOfToday(), 'yyyy-MM-dd')
let ContactInputForm = (props) => {

	const {history, handleItemSubmit } = props;
	let classes = commonStyles();
	const [imageDialogState, toggleImageDialogState] = React.useState(false);

	const toggleImageDialog = () => {
		toggleImageDialogState(!imageDialogState);
	};

	let contactToEdit = props.contactToEdit || {};
	
	const contactValues = {
		id: contactToEdit.id,
		gender: contactToEdit.gender || "",
		assigned_to: contactToEdit.assigned_to || '',
		contact_avatar_url: contactToEdit.contact_avatar_url || "",
		id_number: contactToEdit.id_number || "",
		title: contactToEdit.title || "",
		present_address: contactToEdit.present_address || "",
		alternate_address: contactToEdit.alternate_address || "",
		contact_email: contactToEdit.contact_email || "",
		alternate_email: contactToEdit.alternate_email || "",
		personal_mobile_number: contactToEdit.personal_mobile_number || "",
		work_mobile_number: contactToEdit.work_mobile_number || "",
		home_phone_number: contactToEdit.home_phone_number || "",
		custom_mobile_number: contactToEdit.custom_mobile_number || "",
		id_issue_date: contactToEdit.id_issue_date || currentDate,
		id_issue_place: contactToEdit.id_issue_place || "",
		date_of_birth: contactToEdit.date_of_birth || currentDate,
		emergency_contact_email: contactToEdit.emergency_contact_email || "",
		emergency_contact_name: contactToEdit.emergency_contact_name || "",
		emergency_contact_phone_number: contactToEdit.emergency_contact_phone_number || "",
		emergency_contact_relationship: contactToEdit.emergency_contact_relationship || "",
		first_name: contactToEdit.first_name || "",
		last_name: contactToEdit.last_name || "",
		contact_images: [],
	};

	return (
		<Formik
			initialValues={contactValues}
			enableReinitialize validationSchema={ContactSchema}
			onSubmit={(values, { resetForm }) => {
				let contact = {
					id: values.id,
					title: values.title,
					gender: values.gender,
					first_name: values.first_name,
					last_name: values.last_name,
					date_of_birth: values.date_of_birth,
					id_number: values.id_number,
					assigned_to: values.assigned_to,
					id_issue_date: values.id_issue_date,
					id_issue_place: values.id_issue_place,
					present_address: values.present_address,
					alternate_address: values.alternate_address,
					contact_email: values.contact_email,
					alternate_email: values.alternate_email,
					personal_mobile_number: values.personal_mobile_number,
					work_mobile_number: values.work_mobile_number,
					home_phone_number: values.home_phone_number,
					custom_mobile_number: values.custom_mobile_number,
					emergency_contact_name: values.emergency_contact_name,
					emergency_contact_relationship: values.emergency_contact_relationship,
					emergency_contact_phone_number: values.emergency_contact_phone_number,
					emergency_contact_email: values.emergency_contact_email,
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

				handleItemSubmit( contact, "contacts").then((contactId) => {
					resetForm({});
					if (values.id) {
						history.goBack();
					}
				});
			}}
		>
			{({
				values,
				touched,
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
												{values.contact_avatar_url || values.contact_images[0] ? "Change Photo": "Add Photo"}
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
										error={errors.date_of_birth && touched.date_of_birth}
										helperText={touched.date_of_birth && errors.date_of_birth}
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
										error={errors.id_number && touched.id_number}
										helperText={touched.id_number && errors.id_number}
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
									<Grid item container direction="row" spacing={2}>
										<Grid item sm>
											<TextField
												fullWidth
												variant="outlined"
												id={"personal_mobile_number"}
												name={"personal_mobile_number"}
												label="Personal Mobile Number"
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.personal_mobile_number && touched.personal_mobile_number}
												helperText={touched.personal_mobile_number && errors.personal_mobile_number}
												value={values.personal_mobile_number}
											/>
										</Grid>
										<Grid item sm>
											<TextField
												fullWidth
												variant="outlined"
												id={"home_phone_number"}
												name={"home_phone_number"}
												label="Home Phone Number"
												onChange={handleChange}
												onBlur={handleBlur}
												helperText="Home Phone Number"
												value={values.home_phone_number}
											/>
										</Grid>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item sm>
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
										<Grid item sm>
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
									</Grid>
									{/* start of contact emails column */}
									<Grid item>
										<Typography variant="subtitle2">
											Emails
								</Typography>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item sm>
											<TextField
												fullWidth
												type="email"
												variant="outlined"
												id={'contact_email'}
												name={'contact_email'}
												label="Email"
												value={values.contact_email}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.contact_email && touched.contact_email}
										helperText={touched.contact_email && errors.contact_email}
											/>
										</Grid>
										<Grid item sm>
											<TextField
												fullWidth
												type="email"
												variant="outlined"
												id={'alternate_email'}
												name={'alternate_email'}
												label="Alternate Email"
												value={values.alternate_email}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.alternate_email && touched.alternate_email}
										helperText={touched.alternate_email && errors.alternate_email}
											/>
										</Grid>
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
											
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.present_address && touched.present_address}
										helperText={touched.present_address && errors.present_address}
										/>
										<TextField
											fullWidth
											variant="outlined"
											id={"alternate_address"}
											name={"alternate_address"}
											label="Alternate Address"
											value={
												values.alternate_address
											}
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Alternate Address"
										/>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">
											Emergency Contact
										</Typography>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item sm>
											<TextField
												fullWidth
												type="text"
												variant="outlined"
												id={'emergency_contact_name'}
												name={'emergency_contact_name'}
												label="Contact Name"
												value={values.emergency_contact_name}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.emergency_contact_name && touched.emergency_contact_name}
										helperText={touched.emergency_contact_name && errors.emergency_contact_name}
											/>
										</Grid>
										<Grid item sm>
											<TextField
												fullWidth
												type="text"
												variant="outlined"
												id={'emergency_contact_relationship'}
												name={'emergency_contact_relationship'}
												label="Relationship to Tenant"
												value={values.emergency_contact_relationship}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.emergency_contact_relationship && touched.emergency_contact_relationship}
										helperText={touched.emergency_contact_relationship && errors.emergency_contact_relationship}
											/>
										</Grid>
									</Grid>
									<Grid item container direction="row" spacing={2}>
										<Grid item sm>
											<TextField
												fullWidth
												type="text"
												variant="outlined"
												id={'emergency_contact_phone_number'}
												name={'emergency_contact_phone_number'}
												label="Phone Number"
												value={values.emergency_contact_phone_number}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.emergency_contact_phone_number && touched.emergency_contact_phone_number}
										helperText={touched.emergency_contact_phone_number && errors.emergency_contact_phone_number}
											/>
										</Grid>
										<Grid item sm>
											<TextField
												fullWidth
												type="email"
												variant="outlined"
												id={'emergency_contact_email'}
												name={'emergency_contact_email'}
												label="Contact Email"
												value={values.emergency_contact_email}
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.emergency_contact_email && touched.emergency_contact_email}
												helperText={touched.emergency_contact_email && errors.emergency_contact_email}
		
											/>
										</Grid>
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



const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

ContactInputForm = connect(mapDispatchToProps)(ContactInputForm);

export default withRouter(ContactInputForm);

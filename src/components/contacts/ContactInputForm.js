import React from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CustomSnackbar from '../CustomSnackbar'
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
import ImageCropper from '../ImageCropper';
import * as Yup from "yup";
import CustomCircularProgress from "../CustomCircularProgress";

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();


const ContactSchema = Yup.object().shape({
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is required"),
	title: Yup.string().trim().required("Title is required"),
	gender: Yup.string().trim().required("Gender is required"),
	id_number: Yup.string().trim().required("ID Number is required"),
	personal_phone_number: Yup.string().trim().min(10, "Phone Number must be >= 10")
	.required('Phone Number is Required'),
	contact_email: Yup.string().trim().email(),
	alternate_email: Yup.string().trim().email(),
	present_address: Yup.string().trim().default(''),
	emergency_contact_email: Yup.string().trim().email(),
	emergency_contact_name: Yup.string().trim().default(''),
	emergency_contact_phone_number: Yup.string().trim().default(''),
	emergency_contact_relationship: Yup.string().trim().default(''),
});


let ContactInputForm = (props) => {

	const { history, handleItemSubmit } = props;
	let classes = commonStyles();

	let contactToEdit = props.contactToEdit || {};

	const contactValues = {
		id: contactToEdit.id,
		gender: contactToEdit.gender || "",
		assigned_to: contactToEdit.assigned_to || '',
		contact_avatar_url: contactToEdit.contact_avatar_url || "",
		id_number: contactToEdit.id_number || "",
		title: contactToEdit.title || "",
		present_address: contactToEdit.present_address || "",
		contact_email: contactToEdit.contact_email || "",
		alternate_email: contactToEdit.alternate_email || "",
		personal_phone_number: contactToEdit.personal_phone_number || "",
		work_phone_number: contactToEdit.work_phone_number || "",
		emergency_contact_email: contactToEdit.emergency_contact_email || "",
		emergency_contact_name: contactToEdit.emergency_contact_name || "",
		emergency_contact_phone_number: contactToEdit.emergency_contact_phone_number || "",
		emergency_contact_relationship: contactToEdit.emergency_contact_relationship || "",
		first_name: contactToEdit.first_name || "",
		last_name: contactToEdit.last_name || "",
		contact_image: '',
	};

	return (
		<Formik
			initialValues={contactValues}
			enableReinitialize validationSchema={ContactSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					let contact = {
						id: values.id,
						title: values.title,
						gender: values.gender,
						first_name: values.first_name,
						last_name: values.last_name,
						id_number: values.id_number,
						assigned_to: values.assigned_to,
						present_address: values.present_address,
						contact_email: values.contact_email,
						alternate_email: values.alternate_email,
						personal_phone_number: values.personal_phone_number,
						work_phone_number: values.work_phone_number,
						emergency_contact_name: values.emergency_contact_name,
						emergency_contact_relationship: values.emergency_contact_relationship,
						emergency_contact_phone_number: values.emergency_contact_phone_number,
						emergency_contact_email: values.emergency_contact_email,
						date_created: new Date().getTime(),
					};
					//first upload the image to firebase
					if (values.contact_image && values.contact_image.data) {
						//if the user had previously uploaded an avatar
						// then delete it here and replace the url with new uploaded image
						if (values.contact_avatar_url) {
							//delete file from storage
							await deleteUploadedFileByUrl(values.contact_avatar_url);
						}
						//upload the first and only image in the contact images array
						var fileDownloadUrl = await uploadFilesToFirebase(values.contact_image)
						contact.contact_avatar_url = fileDownloadUrl;
					}

					await handleItemSubmit(contact, "contacts")
					resetForm({});
					if (values.id) {
						history.goBack();
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
						noValidate
						id="contactInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container direction="column" justify="flex-start">
							{
								status && status.msg && (
									<CustomSnackbar
										variant={status.sent ? "success" : "error"}
										message={status.msg}
									/>
								)
							}
							{
								isSubmitting && (<CustomCircularProgress open={true}/>)
							}
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
														setFieldValue('contact_image', croppedImage);
													}} cropHeight={160} cropWidth={160} />
											}
											<Avatar
												alt="Contact Image"
												src={
													values.contact_image ?
														values.contact_image.data
														: values.contact_avatar_url
												}
												className={classes.largeAvatar}
											/>
										</Grid>
										<Grid key={2} item>
											<Box>
												<input onChange={(event) => {
													const selectedFile = event.currentTarget.files[0]
													//remove the object then push a copy of it with added image object
													setFieldValue("file_to_load_url", selectedFile);
												}} accept="image/*" className={classes.fileInputDisplayNone} id={"contact-image-input"} type="file" />
												<label htmlFor={"contact-image-input"}>
													<IconButton color="primary" aria-label="upload picture" component="span">
														<PhotoCamera />
													</IconButton>
												</label>
												<Box>{values.contact_avatar_url || values.contact_image ? "Change Photo" : "Add Photo"}</Box>
											</Box>
										</Grid>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="title"
											label="Title"
											id="title"
											required
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
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id="first_name"
											name="first_name"
											label="First Name"
											required
											value={values.first_name}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.first_name && touched.first_name}
											helperText={touched.first_name && errors.first_name}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id="last_name"
											name="last_name"
											label="Last Name"
											required
											value={values.last_name}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.last_name && touched.last_name}
											helperText={touched.last_name && errors.last_name}
										/>
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											select
											name="gender"
											label="Gender"
											id="gender"
											required
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
									</Grid>
									<Grid item>
										<TextField
											fullWidth
											variant="outlined"
											id="id_number"
											label="ID No"
											type="text"
											name="id_number"
											required
											value={values.id_number}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.id_number && touched.id_number}
											helperText={touched.id_number && errors.id_number}
										/>
									</Grid>
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
												id="personal_phone_number"
												name="personal_phone_number"
												label="Personal Phone Number"
												required
												onChange={handleChange}
												onBlur={handleBlur}
												error={errors.personal_phone_number && touched.personal_phone_number}
												helperText={"Personal Phone Number"}
												value={values.personal_phone_number}
											/>
										</Grid>
										<Grid item sm>
											<TextField
												fullWidth
												variant="outlined"
												id={"work_phone_number"}
												name={"work_phone_number"}
												label="Work Phone Number"
												onChange={handleChange}
												onBlur={handleBlur}
												helperText="Work Phone Number"
												value={values.work_phone_number}
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
												id='contact_email'
												name='contact_email'
												label="Primary Email"
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
												id='alternate_email'
												name='alternate_email'
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
											id="present_address"
											name="present_address"
											label="Present Address"
											value={values.present_address}
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.present_address && touched.present_address}
											helperText={touched.present_address && errors.present_address}
										/>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">
											Emergency Contact
										</Typography>
									</Grid>
									<Grid item container direction="column" spacing={2}>
										<Grid item sm>
											<TextField
												fullWidth
												type="text"
												variant="outlined"
												id='emergency_contact_name'
												name='emergency_contact_name'
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
												id='emergency_contact_relationship'
												name='emergency_contact_relationship'
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
												id='emergency_contact_phone_number'
												name='emergency_contact_phone_number'
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
												id='emergency_contact_email'
												name='emergency_contact_email'
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
										form="contactInputForm"
										disabled={isSubmitting}
									>
										Save
									</Button>
								</Grid>
							</Grid >
						</Grid >
					</form >
				)}
		</Formik>
	);
};



const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

ContactInputForm = connect(null, mapDispatchToProps)(ContactInputForm);

export default withRouter(ContactInputForm);

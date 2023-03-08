import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { useHistory } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from '@material-ui/icons/PhotoCamera'; 
import {
	getContactTitles,
	getGendersList,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import {
	uploadFilesToFirebase,
	deleteUploadedFileByUrl,
} from "../../actions/actions";
import { Formik } from "formik";
import ImageCropper from '../ImageCropper';

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();


const UserSchema = Yup.object().shape({
	title: Yup.string().trim().required("Title is required"),
	gender: Yup.string().trim().required("Gender is required"),
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is Required"),
	id_number: Yup.string().trim().min(8).required("Id Number is Required"),
	primary_email: Yup.string().trim().email("Invalid Email"),
	other_email: Yup.string().trim().email("Invalid Email"),
	phone_number: Yup.string().trim().min(10, 'Too Short').required("Phone Number is Required"),
	work_mobile_number: Yup.string().trim().min(10, 'Too Short'),
	custom_mobile_number: Yup.string().trim().min(10, 'Too Short'),
	home_phone_number: Yup.string().trim().min(10, 'Too Short'),
});

let UserInputForm = (props) => {
	let { handleItemSubmit } = props;
	const userToEdit = props.userToEdit ? props.userToEdit : {};
	const userValues = {
		id: userToEdit.id || '',
		gender: userToEdit.gender || "",
		title: userToEdit.title || "",
		id_number: userToEdit.id_number || '',
		first_name: userToEdit.first_name || '',
		last_name: userToEdit.last_name || '',
		primary_email: userToEdit.primary_email || '',
		other_email: userToEdit.other_email || '',
		phone_number: userToEdit.phone_number || '',
		work_mobile_number: userToEdit.work_mobile_number || '',
		home_phone_number: userToEdit.home_phone_number || "",
		custom_mobile_number: userToEdit.custom_mobile_number || '',
		user_avatar_url: userToEdit.user_avatar_url || '',
		user_image: '',
	}
	const history = useHistory();
	let classes = commonStyles();

	return (
		<Formik
			initialValues={userValues}
			enableReinitialize
			validationSchema={UserSchema}
			onSubmit={async (values, { resetForm }) => {
				const user = {
					id: values.id,
					title: values.title,
					gender: values.gender,
					id_number: values.id_number,
					primary_email: values.primary_email,
					other_email: values.other_email,
					first_name: values.first_name,
					last_name: values.last_name,
					phone_number: values.phone_number,
					work_mobile_number: values.work_mobile_number,
					home_phone_number: values.home_phone_number,
					custom_mobile_number: values.custom_mobile_number,
				};
				//first upload the image to firebase
				if (values.user_image && values.user_image.data) {
					//if the user had previously had a file avatar uploaded
					// then delete it here
					if (values.user_avatar_url) {
						//delete file
						await deleteUploadedFileByUrl(values.user_avatar_url);
					}
					//upload the first and only image in the contact images array
					var fileDownloadUrl = await uploadFilesToFirebase(values.user_image)
					user.user_avatar_url = fileDownloadUrl;
				}
				await handleItemSubmit(user, "users")
				resetForm({});
				if (values.id) {
					history.goBack();
				}
			}}
		>
			{({
				values,
				touched,
				errors,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
				setFieldValue,
			}) => (
					<form
						className={classes.form}
						method="post"
						id="userInputForm"
						onSubmit={handleSubmit}
					>
						<Grid
							container
							spacing={4}
							justify="center"
							alignItems="center"
							direction="column"
						>
							<Grid
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
											alt="User Image"
											src={
												values.user_image ? values.user_image.data
													: values.user_avatar_url
											}
											className={classes.largeAvatar}
										/>
									</Grid>
									{
										values.file_to_load_url &&
										<ImageCropper open={true} selectedFile={values.file_to_load_url}
											setCroppedImageData={(croppedImage) => {
												setFieldValue('file_to_load_url', '');
												setFieldValue('user_image', croppedImage);
											}} cropHeight={160} cropWidth={160}/>
									}
									<Grid key={2} item>
										<Box>
											<input onChange={(event) => {
												const selectedFile = event.currentTarget.files[0]
												//remove the object then push a copy of it with added image object
												setFieldValue("file_to_load_url", selectedFile);
											}} accept="image/*" className={classes.fileInputDisplayNone} id={"user-image-input"} type="file" />
											<label htmlFor={"user-image-input"}>
												<IconButton color="primary" aria-label="upload picture" component="span">
													<PhotoCamera />
												</IconButton>
											</label>
											<Box>{values.user_avatar_url || values.user_image ? "Change Photo" : "Add Photo"}</Box>
										</Box>
									</Grid>
								</Grid>
								<Grid item container direction="row" spacing={2}>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
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
									</Grid>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
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
									</Grid>
								</Grid>
								<Grid item container direction="row" spacing={2}>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
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
									</Grid>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
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
									</Grid>
								</Grid>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										id="id_number"
										name="id_number"
										label="ID Number"
										value={values.id_number}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.id_number && touched.id_number}
										helperText={touched.id_number && errors.id_number}
									/>
								</Grid>
								<Grid item container direction="row" spacing={2}>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
											variant="outlined"
											id={"phone_number"}
											name={"phone_number"}
											label="Phone Number"
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.phone_number && touched.phone_number}
											helperText={touched.phone_number && errors.phone_number}
											value={values.phone_number}
										/>
									</Grid>
									<Grid item xs={12} sm>
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
									<Grid item xs={12} sm>
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
									<Grid item xs={12} sm>
										<TextField
											fullWidth
											variant="outlined"
											id="custom_mobile_number"
											name="custom_mobile_number"
											label="Custom Mobile Number"
											onChange={handleChange}
											onBlur={handleBlur}
											helperText="Custom Mobile Number"
											value={values.custom_mobile_number}
										/>
									</Grid>
								</Grid>
								<Grid item container direction="row" spacing={2}>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
											variant="outlined"
											name="primary_email"
											label="Primary Email"
											id="primary_email"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.primary_email}
											error={errors.primary_email && touched.primary_email}
											helperText={touched.primary_email && errors.primary_email}
										/>
									</Grid>
									<Grid item xs={12} sm>
										<TextField
											fullWidth
											variant="outlined"
											name="other_email"
											label="Other Email"
											id="other_email"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.other_email}
											error={errors.other_email && touched.other_email}
											helperText={touched.other_email && errors.other_email}
										/>
									</Grid>
								</Grid>
							</Grid>
							{/** end of user details grid **/}
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
										form="userInputForm"
										disabled={isSubmitting}
									>
										{values.id ? "Save Details" : "Create User"}
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
		</Formik>
	);
};

export default UserInputForm;

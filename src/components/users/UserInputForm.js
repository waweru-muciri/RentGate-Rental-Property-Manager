import React from "react";
import { Avatar, Button, TextField, MenuItem, Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { useHistory } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import {
	uploadFilesToFirebase,
	deleteUploadedFileByUrl,
} from "../../actions/actions";
import { Formik } from "formik";

const UserSchema = Yup.object().shape({
	primary_email: Yup.string().trim().email("Invalid Email").required("Email is required"),
	other_email: Yup.string().trim().email("Invalid Email"),
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is Required"),
	personal_mobile_number: Yup.string().trim().min(8).required("Phone Number is Required"),
	work_mobile_number: Yup.string().trim().min(8).required("Work Phone Number"),
	id_number: Yup.string().trim().min(8).required("Id Number is Required"),
});

let UserInputForm = (props) => {
	let { handleItemSubmit, currentUser } = props;
	const userToEdit = typeof props.userToEdit !== 'undefined' ? props.userToEdit : {};
	const userValues = {
		id: userToEdit.uid || '',
		first_name: userToEdit.first_name || '',
		last_name: userToEdit.last_name || '',
		primary_email: userToEdit.primary_email || '',
		other_email: userToEdit.other_email || '',
		personal_mobile_number: userToEdit.personal_mobile_number || '',
		work_mobile_number: userToEdit.work_mobile_number || '',
		id_number: userToEdit.id_number || '',
		user_avatar_url: userToEdit.user_avatar_url || '',
		user_roles: userToEdit.user_roles || [],
	}
	userValues.contact_image = [];
	const history = useHistory();
	let classes = commonStyles();

	const [imageDialogState, toggleImageDialogState] = React.useState(false);

	const toggleImageDialog = () => {
		toggleImageDialogState(!imageDialogState);
	};
	//get all roles that can be assigned to users from the server
	const USER_ROLES_LIST = [];

	return (
		<Formik
			initialValues={{ ...userValues }}
			validationSchema={UserSchema}
			onSubmit={(values, { resetForm }) => {
				const user = {
					id: values.id,
					id_number: values.id_number,
					primary_email: values.primary_email,
					other_email: values.other_email,
					first_name: values.first_name,
					last_name: values.last_name,
					personal_mobile_number: values.personal_mobile_number,
					work_mobile_number: values.work_mobile_number,
					user_roles: values.user_roles,
				};
				//first upload the image to firebase
				if (values.contact_image.length) {
					//if the user had previously had a file avatar uploaded
					// then delete it here
					if (values.user_avatar_url) {
						//delete file
						deleteUploadedFileByUrl(values.user_avatar_url);
					}
					//upload the first and only image in the contact images array
					var fileDownloadUrl = uploadFilesToFirebase([values.contact_image[0]])
					user.user_avatar_url = fileDownloadUrl;
				}
				handleItemSubmit(user, "users").then((response) => {
					resetForm({});
				});
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
												typeof values.contact_image[0] !==
													"undefined"
													? values.contact_image[0].data
													: values.user_avatar_url
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
											{values.user_avatar_url || values.contact_image[0] ? "Change Photo" : "Add Photo"}
										</Button>
										<DropzoneDialogBase
											filesLimit={1}
											fileObjects={values.contact_image}
											acceptedFiles={["image/*"]}
											cancelButtonText={"cancel"}
											submitButtonText={"submit"}
											maxFileSize={5000000}
											open={imageDialogState}
											onClose={() => toggleImageDialog()}
											onDelete={() => {
												setFieldValue("contact_image", []);
											}}
											onSave={(files) => {
												setFieldValue(
													"contact_image",
													files
												);
												toggleImageDialog();
											}}
											onAdd={(files) => {
												setFieldValue(
													"contact_image",
													files
												);
												toggleImageDialog();
											}}
											showPreviews={true}
											showFileNamesInPreview={true}
										/>
									</Grid>
								</Grid>
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
									id="id_number"
									name="id_number"
									label="ID Number"
									value={values.id_number}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.id_number && touched.id_number}
									helperText={touched.id_number && errors.id_number}
								/>
								<TextField
									variant="outlined"
									id="personal_mobile_number"
									name="personal_mobile_number"
									label="Phone Number"
									value={values.personal_mobile_number}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.personal_mobile_number && touched.personal_mobile_number}
									helperText={touched.personal_mobile_number && errors.personal_mobile_number}
								/>
								<TextField
									variant="outlined"
									id="work_mobile_number"
									name="work_mobile_number"
									label="Work Mobile Number"
									value={values.work_mobile_number}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.work_mobile_number && touched.work_mobile_number}
									helperText={touched.work_mobile_number && errors.work_mobile_number}
								/>
								<TextField
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
								<TextField
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
								<TextField
									variant="outlined"
									select
									multiple
									name="user_roles"
									label="User Roles"
									id="user_roles"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.user_roles}
									error={errors.user_roles && touched.user_roles}
									helperText={touched.user_roles && errors.user_roles}
								>
									{USER_ROLES_LIST.map(
										(user_roles_type, index) => (
											<MenuItem
												key={index}
												value={user_roles_type}
											>
												{user_roles_type}
											</MenuItem>
										)
									)}
								</TextField>
							</Grid>
							{/** end of user details grid **/}
							<Grid
								item
								container
								justify="center"
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

import React from "react";
import { Avatar, Button, TextField, MenuItem, Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { useHistory } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import {
	handleItemFormSubmit,
	uploadFilesToFirebase,
	deleteUploadedFileByUrl,
} from "../../actions/actions";
import { Formik } from "formik";

const UserSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	first_name: Yup.string().required("First Name is required"),
	last_name: Yup.date().required("Last Name is Required"),
	phone_number: Yup.date().required("Phone Number is Required"),
});

let UserInputForm = (props) => {
	let { userToEdit } = props;
	const userValues = {};
	if (userToEdit !== null) {
		userValues.id = userToEdit.uid;
		userValues.first_name = userToEdit.displayName;
		userValues.email = userToEdit.email;
		userValues.phone_number = userToEdit.phoneNumber;
		userValues.user_avatar_url = userToEdit.photoURL;
	}
	userValues.contact_images = [];
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
			initialValues={{...userValues}}
			validationSchema={UserSchema}
			onSubmit={(values, { resetForm }) => {
				const user = {
					id: values.id,
					email: values.email,
					first_name: values.first_name,
					last_name: values.last_name,
					phone_number: values.phone_number,
					user_roles: values.user_roles,
				};
				//first upload the image to firebase
				if (values.contact_images.length) {
					//if the user had previously had a file avatar uploaded
					// then delete it here
					if (values.user_avatar_url) {
						//delete file
						deleteUploadedFileByUrl(values.user_avatar_url);
					}
					//upload the first and only image in the contact images array
					uploadFilesToFirebase([values.contact_images[0]]).then(
						(fileDownloadUrl) => {
							user.user_avatar_url = fileDownloadUrl;
						}
					);
				}
				handleItemFormSubmit(user, "users").then((response) => {
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
											typeof values.contact_images[0] !==
											"undefined"
												? values.contact_images[0].data
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
										{values.user_avatar_url || values.contact_images[0] ? "Change Photo" : "Add Photo"}
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
											setFieldValue(
												"contact_images",
												files
											);
											toggleImageDialog();
										}}
										onAdd={(files) => {
											setFieldValue(
												"contact_images",
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
								helperText={
									touched.first_name && errors.first_name
								}
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
								helperText={
									touched.last_name && errors.last_name
								}
							/>
							<TextField
								variant="outlined"
								id="phone_number"
								name="phone_number"
								label="Phone Number"
								value={values.phone_number}
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									errors.phone_number && touched.phone_number
								}
								helperText={
									touched.phone_number && errors.phone_number
								}
							/>
							<TextField
								variant="outlined"
								name="email"
								label="Email"
								id="email"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								error={errors.email && touched.email}
								helperText={touched.email && errors.email}
							/>
							<TextField
								variant="outlined"
								select
								name="user_roles"
								label="User Roles"
								id="user_roles"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.user_roles || []}
								error={touched.user_roles && errors.user_roles}
								helperText={
									touched.user_roles && errors.user_roles
								}
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
							className={classes.buttonBox}
						>
							<Button
								onClick={() => history.goBack()}
								color="secondary"
								variant="contained"
								size="medium"
								startIcon={<CancelIcon />}
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
								form="userInputForm"
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

export default UserInputForm;

import React from "react";
import { Avatar, Button, TextField, MenuItem, Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import { DropzoneDialog } from "material-ui-dropzone";

let InputForm = ({
	values,
	match,
	touched,
	errors,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting,
}) => {
	let styles = commonStyles();

	const [imageDialogState, toggleImageDialogState] = React.useState(false);

	const toggleImageDialog = () => {
		toggleImageDialogState(!imageDialogState);
	};
	//get all roles that can be assigned to users from the server
	const USER_ROLES_LIST = [];

	return (
		<form
			className={styles.form}
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
						justify="start"
						spacing={4}
						alignItems="center"
					>
						<Grid key={1} item>
							<Avatar
								alt="User Image"
								src={""}
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
					<TextField
						required
						variant="outlined"
						id="first_name"
						name="first_name"
						label="First Name"
						value={values.first_name || ""}
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
						value={values.last_name || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.last_name && touched.last_name}
						helperText={touched.last_name && errors.last_name}
					/>
					<TextField
						required
						variant="outlined"
						id="phone_number"
						name="phone_number"
						label="Phone Number"
						value={values.phone_number || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.phone_number && errors.phone_number}
						helperText={touched.phone_number && errors.phone_number}
					/>
					<TextField
						required
						variant="outlined"
						name="email"
						label="Email"
						id="email"
						onBlur={handleBlur}
						onChange={handleChange}
						value={values.email || ""}
						error={touched.email && errors.email}
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
						required
						error={errors.user_roles && touched.user_roles}
						helperText={touched.user_roles && errors.user_roles}
					>
						{USER_ROLES_LIST.map((user_roles_type, index) => (
							<MenuItem key={index} value={user_roles_type}>
								{user_roles_type}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				{/** end of user details grid **/}

				<Grid
					item
					justify="center"
					alignItems="space-evenly"
					direction="row"
					className={styles.buttonBox}
				>
					<Button
						color="secondary"
						variant="contained"
						size="medium"
						startIcon={<CancelIcon />}
						component={Link}
						to={`${match.url}`}
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

let UserInputForm = withFormik({
	mapPropsToValues: (props) => {
		let userToEdit = props.userToEdit;
		if (!userToEdit) {
			userToEdit = {};
		}
		return {
			...userToEdit,
			match: props.match,
			error: props.error,
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		let errors = {};
		if (!values.email) {
			errors.email = "Email is Required";
		}
		if (!values.first_name) {
			errors.first_name = "First Name is Required";
		}
		if (!values.last_name) {
			errors.last_name = "Last Name is Required";
		}
		if (!values.phone_number) {
			errors.phone_number = "Phone Number is Required";
		}
		if (!values.user_roles) {
			errors.user_roles = "User Roles is Required";
		}

		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		window.alert("handleSubmitCalled");
		let user = {
			id: values.id,
			email: values.email,
			first_name: values.first_name,
			last_name: values.last_name,
			phone_number: values.phone_number,
			user_roles: values.user_roles,
		};
		handleItemFormSubmit(user, 'users');
		resetForm({});
	},
	enableReinitialize: true,
	displayName: "User Input Form", // helps with React DevTools
})(InputForm);

UserInputForm = connect()(UserInputForm);

export default withRouter(UserInputForm);

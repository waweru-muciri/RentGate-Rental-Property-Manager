import React from "react";
import {
	Box,
	Typography,
	Button,
	TextField,
	MenuItem,
	Grid,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import PageHeading from "../PageHeading";
import Layout from "../myLayout";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import ItemLink from "../Link";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		paddingRight: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		"& .MuiTextField-root": {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2),
		},
	},
	buttonBox: {
		paddingTop: `${theme.spacing(2)}px`,
		"& .MuiButton-root": {
			margin: theme.spacing(1),
		},
	},
}));

let InputForm = ({
	values,
	touched,
	errors,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting,
}) => {
	let pageTitle = "Contact Details";
	const classes = useStyles();
	return (
		//hello world
		<Box border={1} borderRadius="borderRadius" borderColor="grey.400">
			<form
				className={classes.root}
				method="post"
				id="contactSearchForm"
				onSubmit={handleSubmit}
			>
				<Grid container spacing={2} justify="center" direction="row">
					<Grid item lg={6} md={12} xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							id="first_name"
							name="first_name"
							label="First Name"
							value={values.first_name || ""}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Grid>
					<Grid item lg={6} md={12} xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							select
							name="last_name"
							label="Last Name"
							id="last_name"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.last_name || ""}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} justify="center" direction="row">
					<Grid item lg={6} md={12} xs={12}>
						<TextField
							fullWidth
							type="select"
							variant="outlined"
							id="assigned_to"
							name="assigned_to"
							label="Assinged To"
							value={values.assigned_to || ""}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Grid>
					<Grid item lg={6} md={12} xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							select
							name="gender"
							label="Gender"
							id="gender"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.gender || ""}
						/>
					</Grid>
				</Grid>
				<Grid
					container
					spacing={2}
					item
					justify="flex-end"
					alignItems="center"
					direction="row"
					key={1}
				>
					<Grid item>
						<Button
							type="submit"
							color="primary"
							variant="contained"
							size="medium"
							startIcon={<SearchIcon />}
							onClick={() =>
								window.alert("Add Contact Button clicked!")
							}
						>
							SEARCH{" "}
						</Button>
					</Grid>
					<Grid item>
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							startIcon={<UndoIcon />}
							onClick={() =>
								window.alert("Edit Contact Button clicked!")
							}
						>
							RESET{" "}
						</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

let ContactsSearchForm = withFormik({
	mapPropsToValues: (props) => {
		return {
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		let errors = {};
		if (!values.assigned_to) {
			errors.assigned_to = "Assigned To is Required";
		}
		if (!values.first_name) {
			errors.first_name = "First Name is Required";
		}
		if (!values.last_name) {
			errors.last_name = "Last Name is Required";
		}
		if (!values.gender) {
			errors.gender = "Gender is Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		window.alert("handleSubmitCalled");
		let contactSearchCriteria = {
			assigned_to: values.assigned_to,
			first_name: values.first_name,
			last_name: values.last_name,
			gender: values.gender,
		};
		//        values.submitForm(contact);
		//       resetForm({});
	},
	enableReinitialize: true,
	displayName: "Contact Search Input Form", // helps with React DevTools
})(InputForm);

const mapDispatchToProps = (dispatch) => {
	return {
		submitForm: (contact) => {
			dispatch(handleItemFormSubmit(contact, "contacts"));
		},
	};
};

ContactsSearchForm = connect(null, mapDispatchToProps)(ContactsSearchForm);

export default withRouter(ContactsSearchForm);

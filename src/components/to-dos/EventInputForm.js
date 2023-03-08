import React from "react";
import { Button, TextField, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../commonStyles";

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
	//this will be coming from the server somewhere
	const ASSIGNED_TO = [];

	let pageTitle;
	if (values.id) {
		pageTitle = "Edit To-Do";
	} else {
		pageTitle = "Add To-Do";
	}

	let styles = commonStyles();

	return (
		<Dialog
			open={values.open}
			onClose={values.handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">{pageTitle}</DialogTitle>
			<DialogContent>
				<DialogContentText>To-Do Details here</DialogContentText>
				<form
					className={styles.form}
					method="post"
					id="todoInputForm"
					onSubmit={handleSubmit}
				>
					<TextField
						fullWidth
						variant="outlined"
						name="title"
						label="Title"
						id="title"
						onBlur={handleBlur}
						onChange={handleChange}
						value={values.title || ""}
						required
						error={errors.title && touched.title}
						helperText={touched.title && errors.title}
					/>
					<TextField
						fullWidth
						required
						variant="outlined"
						id="start_date"
						name="start_date"
						label="Start Date"
						type="date"
						value={values.start_date || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.start_date && touched.start_date}
						helperText={touched.start_date && errors.start_date}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						fullWidth
						required
						variant="outlined"
						id="end_date"
						name="end_date"
						label="End Date"
						type="date"
						value={values.end_date || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.end_date && touched.end_date}
						helperText={touched.end_date && errors.end_date}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						fullWidth
						required
						select
						error={errors.assigned_to && touched.assigned_to}
						helperText={touched.assigned_to && errors.assigned_to}
						variant="outlined"
						type="text"
						name="assigned_to"
						id="assigned_to"
						label="Assigned To"
						value={values.assigned_to || ""}
						onChange={handleChange}
						onBlur={handleBlur}
					>
						{ASSIGNED_TO.map((assigned_to, index) => (
							<MenuItem key={index} value={assigned_to}>
								{assigned_to}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						type="date"
						variant="outlined"
						id="reminder"
						name="reminder"
						label="Reminder"
						value={values.reminder || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.reminder && touched.reminder}
						helperText={touched.reminder && errors.reminder}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						fullWidth
						variant="outlined"
						id="description"
						name="description"
						label="Description"
						value={values.description || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.description && touched.description}
						helperText={touched.description && errors.description}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					size="medium"
					startIcon={<CancelIcon />}
					onClick={() => values.handleClose()}
					disableElevation
				>
					Cancel
				</Button>
				<Button
					type="submit"
					color="primary"
					size="medium"
					startIcon={<SaveIcon />}
					form="todoInputForm"
					onClick={() => handleSubmit()}
					disabled={isSubmitting}
				>
					Save
				</Button>
				<Button
					color="primary"
					size="medium"
					startIcon={<DeleteIcon />}
					onClick={() => values.handleClose()}
					disableElevation
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

let ToDoInputForm = withFormik({
	mapPropsToValues: (props) => {
		let eventToShow = props.eventToShow;
		if (!eventToShow) {
			eventToShow = {};
		}
		return {
			...eventToShow,
			match: props.match,
			open: props.open,
			handleClose: props.handleClose,
			error: props.error,
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		let errors = {};
		if (!values.title) {
			errors.title = "Title is Required";
		}
		if (!values.reminder) {
			errors.reminder = "Reminder is Required";
		}
		if (!values.start_date) {
			errors.start_date = "Start Date is Required";
		}
		if (!values.end_date) {
			errors.end_date = "End Date is Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		window.alert("handleSubmitCalled");
		let todo = {
			id: values.id,
			title: values.title,
			start_date: values.start_date,
			end_date: values.end_date,
			reminder: values.reminder,
			description: values.description,
		};
		values.submitForm(todo);
		resetForm({});
	},
	enableReinitialize: true,
	displayName: "ToDo Input Form", // helps with React DevTools
})(InputForm);

const mapDispatchToProps = (dispatch) => {
	return {
		submitForm: (todo) => {
			dispatch(handleItemFormSubmit(todo, "to-dos"));
		},
	};
};

ToDoInputForm = connect(null, mapDispatchToProps)(ToDoInputForm);

export default withRouter(ToDoInputForm);

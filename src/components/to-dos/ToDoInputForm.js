import React from "react";
import {
	Button,
	TextField,
	MenuItem,
	FormControl,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	Radio,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";

const ToDoSchema = Yup.object().shape({
	title: Yup.string().required("Title is Required"),
	start: Yup.string().required("Start Date is Required"),
	end: Yup.date().required("End Date is Required"),
	description: Yup.string().required("Event Description is Required"),
	reminder_date: Yup.date()
		.when("start", (start, schema) => start && schema.min(start, "Reminder date must be greater than start date")),
});

let ToDoInputForm = (props) => {
	let styles = commonStyles();
	const {
		currentUser,
		handleItemSubmit,
		handleItemDelete,
		open,
		handleClose,
		eventToShow,
		users,
		setEventToShow,
	} = props;
	let pageTitle = eventToShow.id ? "Edit To-Do" : "Add To-Do";

	return (
		<Formik
			initialValues={eventToShow}
			enableReinitialize
			validationSchema={ToDoSchema}
			onSubmit={(values, { resetForm }) => {
				let todo = {
					id: values.id,
					title: values.title,
					start: values.start,
					end: values.end,
				};
				todo.extendedProps = {
					description: values.description,
					reminder_date: values.reminder_date,
					complete_status: values.complete_status,
				};
				handleItemSubmit(currentUser, todo, "to-dos").then((response) => {
					setEventToShow({});
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
			}) => (
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">
							{pageTitle}
						</DialogTitle>
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
								error={errors.title && touched.title}
								helperText={touched.title && errors.title}
							/>
							<TextField
								fullWidth
								variant="outlined"
								id="start"
								name="start"
								label="Start Date"
								type="date"
								value={values.start || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.start && touched.start}
								helperText={touched.start && errors.start}
								InputLabelProps={{ shrink: true }}
							/>
							<TextField
								fullWidth
								variant="outlined"
								id="end"
								name="end"
								label="End Date"
								type="date"
								value={values.end || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.end && touched.end}
								helperText={touched.end && errors.end}
								InputLabelProps={{ shrink: true }}
							/>
							<TextField
								fullWidth
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
								value={values.assigned_to || ""}
								onChange={handleChange}
								onBlur={handleBlur}
							>
								{users.map((user, index) => (
									<MenuItem key={index} value={user.id}>
										{user.first_name + " " + user.last_name}
									</MenuItem>
								))}
							</TextField>
							<TextField
								fullWidth
								type="date"
								variant="outlined"
								id="reminder_date"
								name="reminder_date"
								label="Reminder Date"
								value={values.reminder_date || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									errors.reminder_date && touched.reminder_date
								}
								helperText={
									touched.reminder_date && errors.reminder_date
								}
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
								helperText={
									touched.description && errors.description
								}
							/>
							<FormControl fullWidth component="fieldset">
								<FormLabel component="legend">
									Complete Status
							</FormLabel>
								<RadioGroup
									row
									aria-label="Completed Status"
									name="complete_status"
									value={values.complete_status || "false"}
									onChange={handleChange}
								>
									<FormControlLabel
										value={"true"}
										control={<Radio />}
										label="Complete"
									/>
									<FormControlLabel
										value={"false"}
										control={<Radio />}
										label="Incomplete"
									/>
								</RadioGroup>
							</FormControl>
							<DialogActions>
								<Button
									color="primary"
									size="medium"
									startIcon={<CancelIcon />}
									onClick={() => handleClose()}
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
									disabled={isSubmitting}
								>
									Save
							</Button>
								<Button
									color="primary"
									size="medium"
									startIcon={<DeleteIcon />}
									disabled={!values.id}
									onClick={() => {
										handleItemDelete(currentUser.tenant, values.id, "to-dos");
										handleClose();
									}}
									disableElevation
								>
									Delete
							</Button>
							</DialogActions>
						</form>
					</Dialog>
				)}
		</Formik>
	);
};

export default ToDoInputForm;

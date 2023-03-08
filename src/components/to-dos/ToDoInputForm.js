import React from "react";
import {
	Button,
	TextField,
	FormControl,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	Radio,
	Grid,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CustomCircularProgress from "../CustomCircularProgress";
import CustomSnackbar from '../CustomSnackbar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";

const ToDoSchema = Yup.object().shape({
	title: Yup.string().required("Title is Required"),
	start: Yup.string().required("Start Date is Required"),
	end: Yup.date().required("End Date is Required"),
	description: Yup.string().required("Event Description is Required"),
	complete_status: Yup.boolean().default(false),
	reminder_date: Yup.date()
		.when("start", (start, schema) => start && schema.max(start, "Reminder date must be <= start date")),
});

let ToDoInputForm = (props) => {
	const classes = commonStyles();
	const {
		handleItemSubmit,
		handleItemDelete,
		open,
		handleClose,
		eventToShow,
		users,
		setEventToShow,
	} = props;
	const pageTitle = eventToShow.id ? "Edit To-Do" : "Add To-Do";

	return (
		<Dialog
			fullWidth
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">{pageTitle}</DialogTitle>
			<Formik
				initialValues={eventToShow}
				enableReinitialize
				validationSchema={ToDoSchema}
				onSubmit={(values, { resetForm, setStatus }) => {
					try {
						let todo = {
							id: values.id,
							title: values.title,
							start: values.start,
							end: values.end,
							extendedProps: {
								assigned_to: values.assigned_to,
								description: values.description,
								reminder_date: values.reminder_date,
								complete_status: values.complete_status,
							}
						};
						handleItemSubmit(todo, "to-dos").then((response) => {
							setEventToShow({});
							resetForm({});
							if (values.id) {
								handleClose()
							}
						});
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
					errors,
					handleChange,
					handleBlur,
					handleSubmit,
					setFieldValue,
					isSubmitting,
				}) => (
					<form
						className={classes.form}
						method="post"
						id="todoInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container direction="column" spacing={2}>
							{
								status && status.msg && (
									<CustomSnackbar
										variant={status.sent ? "success" : "error"}
										message={status.msg}
									/>
								)
							}
							{
								isSubmitting && (<CustomCircularProgress open={true} />)
							}
							<Grid item>
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
							</Grid>
							<Grid item>
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
							</Grid>
							<Grid item>
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
							</Grid>
							<Grid item>
								<Autocomplete
									id="assigned_to"
									options={users}
									getOptionSelected={(option, value) => option && value ? option.id === value.id : ""}
									name="assigned_to"
									onChange={(event, newValue) => {
										setFieldValue("assigned_to", newValue);
									}}
									value={values.assigned_to}
									getOptionLabel={(user) => user ? `${user.first_name} ${user.last_name}` : ''}
									style={{ width: "100%" }}
									renderInput={(params) => <TextField {...params} label="Assigned To" variant="outlined" />}
								/>
							</Grid>
							<Grid item>
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
							</Grid>
							<Grid item>
								<TextField
									fullWidth
									multiline
									rows={2}
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
							</Grid>
							<Grid item>
								<FormControl fullWidth component="fieldset">
									<FormLabel component="legend">
										Complete Status
									</FormLabel>
									<RadioGroup
										row
										aria-label="Completed Status"
										name="complete_status"
										value={values.complete_status}
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
							</Grid>
							<Grid item
								container
								justify="flex-start"
								direction="row"
								className={classes.buttonBox}>
								<Grid item>
									<Button
										color="primary"
										size="medium"
										startIcon={<CancelIcon />}
										onClick={() => handleClose()}
										disableElevation
									>
										Cancel
									</Button>
								</Grid>
								<Grid item>
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
								</Grid>
								<Grid item>
									<Button
										color="primary"
										size="medium"
										startIcon={<DeleteIcon />}
										disabled={!values.id}
										onClick={() => {
											handleItemDelete(values.id, "to-dos");
											handleClose();
										}}
										disableElevation
									>
										Delete
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Dialog>
	);
};

export default ToDoInputForm;

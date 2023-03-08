import React from "react";
import {
	FormControl,
	FormLabel,
	FormControlLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Button,
	TextField,
	Grid,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import moment from "moment";

const defaultDate = moment().format("YYYY-MM-DD");

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
	let classes = commonStyles();

	return (
		<form
			className={classes.form}
			method="post"
			id="maintenanceRequestInputForm"
			onSubmit={handleSubmit}
		>
			<Grid
				container
				spacing={4}
				justify="center"
				alignItems="center"
				direction="column"
			>
				<Grid item>
					<TextField
						fullWidth
						select
						variant="outlined"
						id="contact"
						name="contact"
						label="Contact"
						value={values.contact}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.contact && touched.contact}
						helperText={touched.contact && errors.contact}
					>
						{values.contacts.map((contact, index) => (
							<MenuItem key={index} value={contact.id}>
								{contact.first_name + " " + contact.last_name}
							</MenuItem>
						))}
					</TextField>
					<TextField
						fullWidth
						type="date"
						InputLabelProps={{ shrink: true }}
						variant="outlined"
						id="date_created"
						name="date_created"
						label="Date Created"
						value={values.date_created}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.date_created && touched.date_created}
						helperText={touched.date_created && errors.date_created}
					/>
					<TextField
						fullWidth
						rows={4}
						multiline
						variant="outlined"
						id="maintenance_details"
						name="maintenance_details"
						label="What Needs Attention?"
						value={values.maintenance_details}
						onChange={handleChange}
						onBlur={handleBlur}
						error={
							errors.maintenance_details &&
							touched.maintenance_details
						}
						helperText={
							touched.maintenance_details &&
							errors.maintenance_details
						}
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						variant="outlined"
						id="other_details"
						name="other_details"
						label="Anything maintenance should know when entering the residence?"
						value={values.other_details}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.other_details && errors.other_details}
						helperText={
							touched.other_details && errors.other_details
						}
					/>
					<FormControl fullWidth component="fieldset">
						<FormLabel component="legend">
							Is the issue urgent?
						</FormLabel>
						<RadioGroup
							row
							aria-label="Issue urgency"
							name="issue_urgency"
							value={values.issue_urgency}
							onChange={handleChange}
						>
							<FormControlLabel
								value="Yes"
								control={<Radio />}
								label="Yes"
							/>
							<FormControlLabel
								value="No"
								control={<Radio />}
								label="No"
							/>
						</RadioGroup>
					</FormControl>
					<FormControl fullWidth component="fieldset">
						<FormLabel component="legend">
							Do we have permission to enter the residence?
						</FormLabel>
						<RadioGroup
							row
							aria-label="Permission to enter residence"
							name="enter_permission"
							value={values.enter_permission}
							onChange={handleChange}
						>
							<FormControlLabel
								value="Yes"
								control={<Radio />}
								label="Yes"
							/>
							<FormControlLabel
								value="No"
								control={<Radio />}
								label="No"
							/>
						</RadioGroup>
					</FormControl>
					<FormControl fullWidth component="fieldset">
						<FormLabel component="legend">
							Maintenance Request Status
						</FormLabel>
						<RadioGroup
							row
							aria-label="Maintenance Request Status"
							name="status"
							value={values.status}
							onChange={handleChange}
						>
							<FormControlLabel
								value="Open"
								control={<Radio />}
								label="Open"
							/>
							<FormControlLabel
								value="Closed"
								control={<Radio />}
								label="Closed"
							/>
						</RadioGroup>
					</FormControl>
				</Grid>
				{/** end of maintenance request details grid **/}

				<Grid item className={classes.buttonBox}>
					<Button
						color="secondary"
						variant="contained"
						size="medium"
						startIcon={<CancelIcon />}
						onClick={() => values.history.goBack()}
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
						form="maintenanceRequestInputForm"
						disabled={isSubmitting}
					>
						Save
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

let MaintenanceRequestInputForm = withFormik({
	mapPropsToValues: (props) => {
		let maintenanceRequestToEdit = props.maintenanceRequestToEdit;
		if (!maintenanceRequestToEdit) {
			maintenanceRequestToEdit = {};
		}
		return {
			id: maintenanceRequestToEdit.id,
			contact: maintenanceRequestToEdit.contact || "",
			date_created: maintenanceRequestToEdit.date_created || defaultDate,
			maintenance_details:
				maintenanceRequestToEdit.maintenance_details || " ",
			other_details: maintenanceRequestToEdit.other_details || " ",
			enter_permission:
				maintenanceRequestToEdit.enter_permission || "Yes",
			issue_urgency: maintenanceRequestToEdit.issue_urgency || "No",
			status: maintenanceRequestToEdit.status || "Open",
			contacts: props.contacts,
			history: props.history,
			match: props.match,
			error: props.error,
		};
	},

	validate: (values) => {
		let errors = {};
		if (!values.contact) {
			errors.contact = "Contact Requesting Maintenance is Required";
		}
		if (!values.date_created) {
			errors.date_created = "Date Created is Required";
		}
		if (!values.maintenance_details) {
			errors.maintenance_details = "Maintenance Details Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		let maintenanceRequest = {
			id: values.id,
			date_created: values.date_created,
			contact: values.contact,
			maintenance_details: values.maintenance_details,
			other_details: values.other_details,
			enter_permission: values.enter_permission,
			issue_urgency: values.issue_urgency,
			status: values.status,
		};
		handleItemFormSubmit(maintenanceRequest, "maintenance-requests").then(
			(response) => {
				console.log("Saved contact successfully => ", response);
			}
		);
		resetForm();
		if (values.id) {
			values.history.goBack();
		}
	},
	enableReinitialize: true,
	displayName: "Maintenance Request Input Form", // helps with React DevTools
})(InputForm);

const mapStateToProps = (state) => {
	return {
		error: state.error,
		contacts: state.contacts,
	};
};

MaintenanceRequestInputForm = connect(mapStateToProps)(
	MaintenanceRequestInputForm
);

export default withRouter(MaintenanceRequestInputForm);

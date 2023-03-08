import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import { format, startOfToday } from "date-fns";
import * as Yup from "yup";

const MaintenanceRequestSchema = Yup.object().shape({
	contact: Yup.string().required("Tenant is required"),
	date_created: Yup.date().required("Date Created is Required"),
	maintenance_details: Yup.string().trim().required("Maintenance Details Required"),
	expected_completion_date: Yup.date().required("Expected Completion Date Required"),
});


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
let MaintenanceRequestInputForm = (props) => {
	let classes = commonStyles();
	const { handleItemSubmit, history, maintenanceRequestToEdit, contacts } = props
	let maintenanceRequest = maintenanceRequestToEdit;
	let maintenanceRequestValues = {
		id: maintenanceRequest.id,
		contact: maintenanceRequest.contact || "",
		date_created: maintenanceRequest.date_created || defaultDate,
		expected_completion_date: maintenanceRequest.expected_completion_date || defaultDate,
		actual_completion_date: maintenanceRequest.actual_completion_date || defaultDate,
		maintenance_details:
			maintenanceRequest.maintenance_details || "",
		other_details: maintenanceRequest.other_details || "",
		enter_permission:
			maintenanceRequest.enter_permission || "Yes",
		issue_urgency: maintenanceRequest.issue_urgency || "No",
		status: maintenanceRequest.status || "Open",
	};

	return (
		<Formik
			initialValues={maintenanceRequestValues}
			enableReinitialize
			validationSchema={MaintenanceRequestSchema}
			onSubmit={(values, { resetForm }) => {
				let maintenanceRequest = {
					id: values.id,
					date_created: values.date_created,
					expected_completion_date: values.expected_completion_date,
					actual_completion_date: values.actual_completion_date,
					contact: values.contact,
					maintenance_details: values.maintenance_details,
					other_details: values.other_details,
					enter_permission: values.enter_permission,
					issue_urgency: values.issue_urgency,
					status: values.status,
				};
				handleItemSubmit(maintenanceRequest, "maintenance-requests").then(
					(response) => {
						resetForm({});
						if (values.id) {
							history.goBack();
						}
					}
				);
			}}
		>
			{({ values,
				touched,
				errors,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting, }) => (
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
									{contacts.map((contact, index) => (
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
									type="date"
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									id="expected_completion_date"
									name="expected_completion_date"
									label="Expected Completion Date"
									value={values.expected_completion_date}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.expected_completion_date && touched.expected_completion_date}
									helperText={touched.expected_completion_date && errors.expected_completion_date}
								/>
								<TextField
									fullWidth
									type="date"
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									id="actual_completion_date"
									name="actual_completion_date"
									label="Actual Completion Date"
									value={values.actual_completion_date}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.actual_completion_date && touched.actual_completion_date}
									helperText={touched.actual_completion_date && errors.actual_completion_date}
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
									error={errors.maintenance_details && touched.maintenance_details}
									helperText={touched.maintenance_details && errors.maintenance_details}
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
									error={errors.other_details && touched.other_details}
									helperText={touched.other_details && errors.other_details}
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
										form="maintenanceRequestInputForm"
										disabled={isSubmitting}
									>
										Save
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
		</Formik>
	);
};

export default MaintenanceRequestInputForm;

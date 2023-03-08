import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button, TextField, Grid} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { connect } from 'react-redux'
import { withFormik } from "formik";
import { handleItemFormSubmit } from '../../actions/actions'
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import {commonStyles} from '../commonStyles';
import moment from 'moment';

let InputForm = ({
    values,
	match,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting, }) => {

	let styles = commonStyles();

	return (
            		<form className={styles.form} method="post" id="maintenanceRequestInputForm" onSubmit={handleSubmit}>
               		 <Grid container spacing={4} justify="center" alignItems="center" direction="column">
               		 <Grid justify="center" item direction="column" spacing={2}>
			                 Add contact select field here to indicate contact requesting maintenance!
                    		<TextField fullWidth required type="date" InputLabelProps={{ shrink: true }} variant="outlined" id="date_created" name="date_created" label="Date Created" value={values.date_created} onChange={handleChange} onBlur={handleBlur} error={errors.date_created && touched.date_created} helperText={touched.date_created && errors.date_created}
/>
							<TextField fullWidth rows={4} multiline required variant="outlined" id="maintenance_details" name="maintenance_details" label="What Needs Attention?" value={values.maintenance_details} onChange={handleChange} onBlur={handleBlur} error={errors.maintenance_details && touched.maintenance_details} helperText={touched.maintenance_details && errors.maintenance_details}/>
							<TextField fullWidth multiline rows={4} variant="outlined" id="other_details" name="other_details" label="Anything maintenance should know when entering the residence?" value={values.other_details} onChange={handleChange} onBlur={handleBlur} error={touched.other_details && errors.other_details} helperText={touched.other_details && errors.other_details} />
			<FormControl fullWidth component="fieldset">
			  <FormLabel component="legend">Is the issue urgent?</FormLabel>
			  <RadioGroup row aria-label="Issue urgency" name="issue_urgency" value={values.issue_urgency } onChange={handleChange}>
			    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
			    <FormControlLabel value="No" control={<Radio />} label="No" />
			  </RadioGroup>
			</FormControl>
			<FormControl fullWidth component="fieldset">
			  <FormLabel component="legend">Do we have permission to enter the residence?</FormLabel>
			  <RadioGroup row aria-label="Permission to enter residence" name="enter_permission" value={values.enter_permission} onChange={handleChange}>
			    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
			    <FormControlLabel value="No" control={<Radio />} label="No" />
			  </RadioGroup>
			</FormControl>

					</Grid>
			  {/** end of maintenance request details grid **/}

			<Grid item justify="center" alignItems="space-evenly" direction="row" className={styles.buttonBox}>
								<Button color="secondary" variant="contained"
									size='medium' startIcon={<CancelIcon />}
									component={Link} to={`${match.url}`}
									disableElevation>Cancel</Button>
								<Button type="submit" color="primary" variant="contained" size='medium'
									startIcon={<SaveIcon />} form='maintenanceRequestInputForm' onClick={() => handleSubmit()} disabled={isSubmitting}>Save</Button>
					</Grid>
			       </Grid>
					</form>
			);
		}

		let MaintenanceRequestInputForm = withFormik({
			mapPropsToValues: (props) => {
				let maintenanceRequestToEdit = props.maintenanceRequestToEdit 
				if (!maintenanceRequestToEdit ) {
					 maintenanceRequestToEdit = {}
				}
				return {
					date_created: maintenanceRequestToEdit.date_created || moment().format("YYYY-MM-DD"),
					maintenance_details: maintenanceRequestToEdit.maintenance_details || " " ,
					other_details: maintenanceRequestToEdit.other_details || " ",
					enter_permission: maintenanceRequestToEdit.enter_permission || "Yes",
					issue_urgency: maintenanceRequestToEdit.issue_urgency || "No",
					match: props.match,
					error: props.error,
					submitForm: props.submitForm
				}
			},

			validate: values => {
				let errors = {};
				if (!values.date_created) {
					errors.date_created = 'Date Creatd is Required';
				}
				if (!values.maintenance_details) {
					errors.maintenance_details = 'Maintenance Details are required';
				}
				return errors;
			},

			handleSubmit: (values, { resetForm }) => {
				window.alert('handleSubmitCalled')
				let maintenanceRequest= {
					id: values.id,
					date_created: values.date_created,
					maintenance_details: values.maintenance_details,
					other_details: values.other_details,
					enter_permission: values.enter_permission,
					issue_urgency: values.issue_urgency,
        }
        values.submitForm(maintenanceRequest);
        resetForm({
			id: '', 
			date_created: moment().format(),
			maintenance_details: ' ',
			other_details: ' ',
			enter_permission: 'Yes',
			issue_urgency: 'No',
		});
    },
    enableReinitialize: true,
    displayName: 'Maintenance Request Input Form', // helps with React DevTools

})(InputForm);

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: maintenanceRequest => {
            dispatch(handleItemFormSubmit(maintenanceRequest, 'maintenance-requests'))
        },
    }
}


MaintenanceRequestInputForm = connect(
	null,
    mapDispatchToProps
)(MaintenanceRequestInputForm)


export default withRouter(MaintenanceRequestInputForm);

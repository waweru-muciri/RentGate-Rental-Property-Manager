import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";import {
	getMeterTypes,
} from "../../assets/commonAssets.js";


import * as Yup from "yup";

const MeterReadingSchema = Yup.object().shape({
  meter_type: Yup.string().required("Meter Reading is required"),
  prior_value: Yup.number().required("Prior Value is required").min(0),
  current_value: Yup.number().required("Current Value is required").min(0),
  base_charge: Yup.number().min(0).default(0),
  unit_charge: Yup.number().min(0).default(0),
  reading_date: Yup.date().required("Reading Date Required"),
  property: Yup.string().required("Property is Required"),
});

const METER_OPTIONS = getMeterTypes();

const MeterReadingInputForm = ({ properties, meterReadingToEdit, currentUser, handleItemSubmit }) => {
  const history = useHistory();
  const classes = commonStyles();

  return (
    <Formik
      initialValues={meterReadingToEdit}
      enableReinitialize
      validationSchema={MeterReadingSchema}
      onSubmit={(values, { resetForm }) => {
        const meterReading = {
          id: values.id,
          meter_type: values.meter_type,
          prior_value: values.prior_value,
          current_value: values.current_value,
          base_charge: values.base_charge,
          unit_charge: values.unit_charge,
          property: values.property,
          reading_date: values.reading_date,
        };
        handleItemSubmit(currentUser, meterReading, "meter_readings").then((response) => {
          resetForm({});
          if (values.id) {
            history.goBack();
          }
        });
      }}
    >
      {({
        values,
        handleSubmit,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
          <form
            className={classes.form}
            method="post"
            id="meterInputForm"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={4}
              justify="center"
              alignItems="stretch"
              direction="column"
            >
              <Grid item>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="property"
                  label="Property"
                  id="property"
                  onChange={handleChange}
                  value={values.property || ''}
                  error={"property" in errors}
                  helperText={errors.property}
                >
                  {properties.map((property, index) => (
                    <MenuItem key={index} value={property.id}>
                      {property.ref}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="reading_date"
                  name="reading_date"
                  label="Reading Date"
                  value={values.reading_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"reading_date" in errors}
                  helperText={errors.reading_date}
                />
                <TextField
                  fullWidth
						select
                  variant="outlined"
                  id="meter_type"
                  name="meter_type"
                  label="Meter Type"
                  value={values.meter_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"meter_type" in errors}
                  helperText={errors.meter_type}
                >
			  {METER_OPTIONS.map((meter_type, meterTypeIndex) => (
											<MenuItem key={meterTypeIndex} value={meter_type}>
												{meter_type}
											</MenuItem>
										))}
									</TextField>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="prior_value"
                  name="prior_value"
                  label="Prior Value"
                  value={values.prior_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"prior_value" in errors}
                  helperText={errors.prior_value}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="current_value"
                  name="current_value"
                  label="Current Value"
                  value={values.current_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"current_value" in errors}
                  helperText={errors.current_value}
                />
                <TextField
                  fullWidth
                  disabled
                  variant="outlined"
                  id="usage"
                  name="usage"
                  label="Usage"
                  value={values.current_value - values.prior_value}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="base_charge"
                  name="base_charge"
                  label="Base Charge"
                  value={values.base_charge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"base_charge" in errors}
                  helperText={errors.base_charge}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="unit_charge"
                  name="unit_charge"
                  label="Unit Charge"
                  value={values.unit_charge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"unit_charge" in errors}
                  helperText={errors.unit_charge}
                />
              </Grid>
              <Grid item className={classes.buttonBox}>
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
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<SaveIcon />}
                  form="meterInputForm"
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

export default MeterReadingInputForm;

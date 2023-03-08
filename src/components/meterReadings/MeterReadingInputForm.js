import React from "react";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel"; import {
  getMeterTypes,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const MeterReadingSchema = Yup.object().shape({
  meter_type: Yup.string().trim().required("Meter Reading is required"),
  prior_value: Yup.number().required("Prior Value is required").min(0),
  current_value: Yup.number().min(Yup.ref('prior_value'), 'Current Value must be greater than prior value').required("Current Value is required"),
  unit_charge: Yup.number().min(0).required("Unit Charge is Required"),
  base_charge: Yup.number().min(0).default(0),
  reading_date: Yup.date().required("Reading Date Required"),
  property: Yup.string().trim().required("Property is Required"),
  property_unit: Yup.string().trim().required("Unit is Required"),
});

const METER_OPTIONS = getMeterTypes();

const MeterReadingInputForm = ({ properties, propertyUnits, history, meterReadingToEdit, handleItemSubmit }) => {

  const classes = commonStyles();
  const meterReadingValues = meterReadingToEdit || {
    property: '',
    property_unit: '',
    reading_date: defaultDate,
    prior_value: '',
    current_value: '',
    base_charge: '',
    unit_charge: '',
    meter_type: '',
    tenant_id: '',
  }

  return (
    <Formik
      initialValues={meterReadingValues}
      enableReinitialize
      validationSchema={MeterReadingSchema}
      onSubmit={async (values, { resetForm }) => {
        const meterReading = {
          id: values.id,
          meter_type: values.meter_type,
          prior_value: values.prior_value,
          current_value: values.current_value,
          base_charge: values.base_charge,
          unit_charge: values.unit_charge,
          property_unit: values.property_unit,
          property: values.property,
          tenant_id: propertyUnits.find(unit => unit.id === values.property_unit).tenant_id,
          reading_date: values.reading_date,
        };
        //assign usage values to meter reading
        meterReading.usage = values.current_value - values.prior_value
        meterReading.amount = (meterReading.usage * parseFloat(values.unit_charge)) + parseFloat(values.base_charge)
        await handleItemSubmit( meterReading, "meter_readings")
        if (!values.id) {
          const newMeterReadingCharge = {
            charge_amount: meterReading.amount,
            charge_date: defaultDate,
            charge_label: "Utility Income",
            charge_type: "meter_type",
            due_date: defaultDate,
            tenant_id: meterReading.tenant_id,
            unit_id: values.property_unit,
            property: values.property,
          }
          await handleItemSubmit( newMeterReadingCharge, "transactions-charges")
        }
        resetForm({})
        if (values.id) {
          history.goBack();
        }
      }}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
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
              spacing={2}
              justify="center"
              alignItems="stretch"
              direction="column"
            >
              <Grid item container direction="row" spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    name="property"
                    label="Property"
                    id="property"
                    onChange={ (event) => {
                      setFieldValue('property', event.target.value)
                      setFieldValue('property_unit', '')
                    }
                    }
                    value={values.property}
                    error={errors.property && touched.property}
                    helperText={touched.property && errors.property}

                  >
                    {properties.map((property, index) => (
                      <MenuItem key={index} value={property.id}>
                        {property.ref}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    name="property_unit"
                    label="Unit"
                    id="property_unit"
                    onChange={handleChange}
                    value={values.property_unit}
                    error={errors.property_unit && touched.property_unit}
                    helperText={touched.property_unit && errors.property_unit}

                  >
                    {propertyUnits.filter((propertyUnit) => propertyUnit.property_id === values.property).map((property_unit, index) => (
                      <MenuItem key={index} value={property_unit.id}>
                        {property_unit.ref}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item>
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
                  error={errors.reading_date && touched.reading_date}
                  helperText={touched.reading_date && errors.reading_date}

                />
              </Grid>
              <Grid item>
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
                  error={errors.meter_type && touched.meter_type}
                  helperText={touched.meter_type && errors.meter_type}
                >
                  {METER_OPTIONS.map((meter_type, meterTypeIndex) => (
                    <MenuItem key={meterTypeIndex} value={meter_type}>
                      {meter_type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="prior_value"
                  name="prior_value"
                  label="Prior Value"
                  value={values.prior_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.prior_value && touched.prior_value}
                  helperText={touched.prior_value && errors.prior_value}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="current_value"
                  name="current_value"
                  label="Current Value"
                  value={values.current_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.current_value && touched.current_value}
                  helperText={touched.current_value && errors.current_value}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  disabled
                  variant="outlined"
                  id="usage"
                  name="usage"
                  label="Usage"
                  value={values.current_value - values.prior_value}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="base_charge"
                  name="base_charge"
                  label="Base Charge"
                  value={values.base_charge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.base_charge && touched.base_charge}
                  helperText={touched.base_charge && errors.base_charge}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="unit_charge"
                  name="unit_charge"
                  label="Unit Charge"
                  value={values.unit_charge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.unit_charge && touched.unit_charge}
                  helperText={touched.unit_charge && errors.unit_charge}
                />
              </Grid>
              <Grid item container className={classes.buttonBox}>
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
                    form="meterInputForm"
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

export default MeterReadingInputForm;

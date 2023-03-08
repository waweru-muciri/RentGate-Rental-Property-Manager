import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel"; import {
  getMeterTypes,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const MeterReadingSchema = Yup.object().shape({
  meter_type: Yup.string().trim().required("Meter Type is required"),
  prior_value: Yup.number().required("Prior Value is required").min(0,"Amount must be greater than 0"),
  current_value: Yup.number().min(Yup.ref('prior_value'), 'Current Value must be greater than prior value').required("Current Value is required"),
  unit_charge: Yup.number().min(0,"Amount must be greater than 0").required("Unit Charge is Required"),
  base_charge: Yup.number().min(0,"Amount must be greater than 0").default(0),
  reading_date: Yup.date().required("Reading Date Required"),
  property_id: Yup.string().trim().required("Property is Required"),
  unit_id: Yup.string().trim().required("Unit is Required"),
});

const METER_OPTIONS = getMeterTypes();

const MeterReadingInputForm = ({ properties, unitsWithActiveLeases, history, meterReadingToEdit, handleItemSubmit }) => {

  const classes = commonStyles();
  const meterReadingValues = {
    id: meterReadingToEdit.id,
    property_id: meterReadingToEdit.property_id || '',
    unit_id: meterReadingToEdit.unit_id || '',
    reading_date: meterReadingToEdit.reading_date || defaultDate,
    prior_value: meterReadingToEdit.prior_value || '',
    current_value: meterReadingToEdit.current_value || '',
    base_charge: meterReadingToEdit.base_charge || '',
    unit_charge: meterReadingToEdit.unit_charge || '',
    meter_type: meterReadingToEdit.meter_type || '',
    tenant_id: meterReadingToEdit.tenant_id || '',
  }

  return (
    <Formik
      initialValues={meterReadingValues}
      enableReinitialize
      validationSchema={MeterReadingSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const meterReading = {
            id: values.id,
            meter_type: values.meter_type,
            prior_value: values.prior_value,
            current_value: values.current_value,
            base_charge: values.base_charge,
            unit_charge: values.unit_charge,
            unit_id: values.unit_id,
            property_id: values.property_id,
            tenant_id: unitsWithActiveLeases.find(unit => unit.id === values.unit_id).tenant_id,
            reading_date: values.reading_date,
          };
          //assign usage values to meter reading
          meterReading.usage = values.current_value - values.prior_value
          meterReading.amount = (meterReading.usage * parseFloat(values.unit_charge)) + parseFloat(values.base_charge)
          await handleItemSubmit(meterReading, "meter_readings")
          if (!values.id) {
            const newMeterReadingCharge = {
              charge_amount: meterReading.amount,
              charge_date: values.reading_date,
              charge_label: `${values.meter_type} meter charge`,
              charge_type: values.meter_type,
              due_date: values.reading_date,
              tenant_id: meterReading.tenant_id,
              unit_id: values.unit_id,
              property_id: values.property_id,
            }
            await handleItemSubmit(newMeterReadingCharge, "transactions-charges")
          }
          resetForm({})
          if (values.id) {
            history.goBack();
          }
          setStatus({ sent: true, msg: "Meter reading and charge saved." })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}.` })
        }
      }}
    >
      {({
        values,
        status,
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
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="property_id"
                  label="Property"
                  id="property_id"
                  onChange={(event) => {
                    setFieldValue('property_id', event.target.value)
                    setFieldValue('unit_id', '')
                  }
                  }
                  value={values.property_id}
                  error={errors.property_id && touched.property_id}
                  helperText={touched.property_id && errors.property_id}
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
                  name="unit_id"
                  label="Unit"
                  id="unit_id"
                  onChange={handleChange}
                  value={values.unit_id}
                  error={errors.unit_id && touched.unit_id}
                  helperText={touched.unit_id && errors.unit_id}

                >
                  {unitsWithActiveLeases.filter(({ property_id }) => property_id === values.property_id).map((propertyUnit, index) => (
                    <MenuItem key={index} value={propertyUnit.id}>
                      {propertyUnit.ref}
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
                  <MenuItem key={meterTypeIndex} value={meter_type.id}>
                    {meter_type.displayValue}
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

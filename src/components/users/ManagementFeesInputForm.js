import React from "react";
import CustomSnackbar from '../CustomSnackbar'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const ManagmentFeeSchema = Yup.object().shape({
  from_date: Yup.date().required("From Date Required"),
  to_date: Yup.date().required("To Date Required"),
  property_id: Yup.string().required("Property is Required"),
  management_fees_notes: Yup.string().default(""),
});

const ManagmentFeeInputForm = (props) => {
  const { properties, transactions, handleItemSubmit, history } = props
  const classes = commonStyles();
  const managmentFeeToEdit = props.managmentFeeToEdit || {}
  const managmentFeeValues = {
    id: managmentFeeToEdit.id,
    management_fees_notes: managmentFeeToEdit.management_fees_notes || '',
    from_date: managmentFeeToEdit.from_date || defaultDate,
    to_date: managmentFeeToEdit.to_date || defaultDate,
    fees_amount: managmentFeeToEdit.fees_amount || '',
    property_id: managmentFeeToEdit.property_id || '',
  }

  return (
    <Formik
      initialValues={managmentFeeValues}
      enableReinitialize
      validationSchema={ManagmentFeeSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const expense = {
            id: values.id,
            fees_amount: values.fees_amount,
            property_id: values.property_id,
            from_date: values.from_date,
            to_date: values.to_date,
            management_fees_notes: values.management_fees_notes,
          };
          await handleItemSubmit(expense, "management-fees")
          resetForm({});
          if (values.id) {
            history.goBack();
          }
          setStatus({ sent: true, msg: "Fees Generated Successfully!" })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}. Please try again later` })
        }
      }}
    >
      {({
        values,
        status,
        handleSubmit,
        touched,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <form
          className={classes.form}
          method="post"
          id="managementFeesInputForm"
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
            <Grid item>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="property_id"
                label="Property"
                id="property_id"
                onChange={handleChange}
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
            <Grid item>
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="from_date"
                name="from_date"
                label="From Date"
                value={values.from_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.from_date && touched.from_date}
                helperText={touched.from_date && errors.from_date}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="to_date"
                name="to_date"
                label="To Date"
                value={values.to_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.to_date && touched.to_date}
                helperText={touched.to_date && errors.to_date}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                id="management_fees_notes"
                name="management_fees_notes"
                label="Notes"
                value={values.management_fees_notes}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText="Any notes on fees collected?"
              />
            </Grid>
            <Grid item container direction="row" className={classes.buttonBox}>
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
                  form="managementFeesInputForm"
                  disabled={isSubmitting}
                >
                  Get Fees
                  </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ManagmentFeeInputForm;

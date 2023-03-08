import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import CancelIcon from "@material-ui/icons/Cancel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const VacatingNoticeSchema = Yup.object().shape({
  lease_details: Yup.object().typeError("Rental agreement is required")
    .required("Rental agreement is required"),
  vacated: Yup.boolean(),
  notification_date: Yup.date().required("Vacating Date Required"),
  vacating_date: Yup.date().required("Move Out Date is Required"),
  actual_vacated_date: Yup.date().when('vacated', { is: true, then: Yup.date().required("Actual Date Vacated is Required") }),
});

const NoticeInputForm = (props) => {
  const { activeLeases, submitForm, history } = props;
  const classes = commonStyles();
  const noticeToEdit = props.noticeToEdit || {}

  let noticeValues = {
    id: noticeToEdit.id,
    notification_date: noticeToEdit.notification_date || defaultDate,
    vacating_date: noticeToEdit.vacating_date || defaultDate,
    actual_vacated_date: noticeToEdit.actual_vacated_date || defaultDate,
    lease_id: noticeToEdit.lease_id || '',
    vacated: noticeToEdit.vacated || false,
    lease_details: activeLeases.find(({ id }) => id === noticeToEdit.lease_id) || null,
  };

  return (
    <Formik
      initialValues={noticeValues}
      enableReinitialize
      validationSchema={VacatingNoticeSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const vacatingNotice = {
            id: values.id,
            lease_id: values.lease_details.id,
            vacating_date: values.vacating_date,
            actual_vacated_date: values.actual_vacated_date,
            notification_date: values.notification_date,
            unit_id: values.lease_details.unit_id,
            property_id: values.lease_details.property_id,
            tenant_id: values.lease_details.tenants[0],
            vacated: values.vacated,
          };
          await submitForm(vacatingNotice, "notices")
          //if lease tenant is already terminated then automatically terminate lease
          const leaseToEdit = {
            id: values.lease_id,
            end_date: values.vacated ? values.actual_vacated_date : '',
            terminated: values.vacated
          }
          await submitForm(leaseToEdit, "leases")
          resetForm({});
          if (values.id) {
            history.goBack()
          }
          setStatus({ sent: true, msg: "Notice saved successfully." })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}.` })
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
        setFieldValue,
        handleBlur,
        isSubmitting,
      }) => (
        <form
          className={classes.form}
          method="post"
          id="noticeInputForm"
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
            <Grid item>
              <Typography color="textSecondary" component="p">
                Recording every tenant's intention to move out will automatically end the agreement
                on the last move-out date.
              </Typography>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="lease_details"
                  value={values.lease_details}
                  onChange={(event, newValue) => {
                    setFieldValue("lease_details", newValue);
                  }}
                  style={{ width: "100%" }}
                  options={activeLeases}
                  autoHighlight
                  getOptionLabel={(option) => option ? `${option.tenant_name} ${option.unit_ref}` : ''}
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.tenant_name} {option.unit_ref}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tenants"
                      variant="outlined"
                      error={errors.lease_details && touched.lease_details}
                      helperText={touched.lease_details && errors.lease_details}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="unit"
                  name="unit"
                  label="Unit"
                  value={values.lease_details ? values.lease_details.unit_ref : ''}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="lease_type"
                  name="type"
                  label="Agreement Type"
                  value={values.lease_details ? values.lease_details.lease_type : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="lease_start"
                  name="lease_start"
                  label="Start - End"
                  value={values.lease_details ? `${values.lease_details.start_date} - ${values.vacating_date}` : ''}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="notification_date"
                  name="notification_date"
                  label="Notification Date"
                  value={values.notification_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"notification_date" in errors}
                  helperText={errors.notification_date}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="vacating_date"
                  name="vacating_date"
                  label="Move Out Date"
                  value={values.vacating_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"vacating_date" in errors}
                  helperText={errors.vacating_date}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={12} md={6}>
                <FormControl error={errors.vacated && touched.vacated}>
                  <FormControlLabel
                    control={<Switch
                      checked={values.vacated}
                      onChange={handleChange}
                      color="primary"
                      name="vacated"
                      inputProps={{ 'aria-label': 'vacated status checkbox' }}
                    />}
                    label="Tenant Has Moved Out"
                    labelPlacement="start"
                  />
                </FormControl>
                <Typography variant="body2" color="textSecondary">
                  Select if tenant has moved out.
							  </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="actual_vacated_date"
                  name="actual_vacated_date"
                  label="Actual Date Vacated"
                  value={values.actual_vacated_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"actual_vacated_date" in errors}
                  helperText={errors.actual_vacated_date}
                  disabled={!values.vacated}
                />
              </Grid>
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
                  form="noticeInputForm"
                  disabled={isSubmitting}
                >
                  Move Out
                  </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )
      }
    </Formik >
  );
};

export default NoticeInputForm;

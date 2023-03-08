import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const VacatingNoticeSchema = Yup.object().shape({
  lease_id: Yup.string().required("Tenant is required"),
  notification_date: Yup.date().required("Vacating Date Required"),
  vacating_date: Yup.date().required("Move Out Date is Required"),
});

const NoticeInputForm = (props) => {
  const { activeLeases, submitForm, history } = props;
  const classes = commonStyles();
  const noticeToEdit = props.noticeToEdit || {}

  let noticeValues = {
    id: noticeToEdit.id,
    notification_date: noticeToEdit.notification_date || defaultDate,
    vacating_date: noticeToEdit.vacating_date || defaultDate,
    lease_id: noticeToEdit.lease_id || '',
    lease_details: activeLeases.find(({ id }) => id === noticeToEdit.lease_id) || { start_date: '', unit_ref: "", lease_type: "" },
  };

  return (
    <Formik
      initialValues={noticeValues}
      validationSchema={VacatingNoticeSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const vacatingNotice = {
            id: values.id,
            lease_id: values.lease_id,
            vacating_date: values.vacating_date,
            notification_date: values.notification_date,
            unit_id: values.lease_details.unit_id,
            property_id: values.lease_details.property_id,
            tenant_id: values.lease_details.tenants[0]
          };
          await submitForm(vacatingNotice, "notices")
          resetForm({});
          if (values.id) {
            history.goBack()
          }
          setStatus({ sent: true, msg: "Details saved successfully!" })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}.` })
        }
      }}
    >
      {({
        values,
        status,
        handleSubmit,
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
              <Grid item>
                <Typography color="textSecondary" component="p">
                  Recording every tenant's intention to move out will automatically end the agreement
                  on the last move-out date.
                </Typography>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item sm>
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    id="lease_id"
                    name="lease_id"
                    label="Tenant"
                    value={values.lease_id}
                    onChange={(event) => {
                      setFieldValue('lease_id', event.target.value)
                      setFieldValue('lease_details', activeLeases.find(({ id }) => id === event.target.value))
                    }}
                    onBlur={handleBlur}
                    error={"lease_id" in errors}
                    helperText={errors.lease_id}
                  >
                    {activeLeases.map((contact, index) => (
                      <MenuItem key={index} value={contact.id}>
                        {contact.tenant_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm>
                  <TextField
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    id="unit"
                    name="unit"
                    label="Unit"
                    value={values.lease_details.unit_ref}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item sm>
                  <TextField
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    id="lease_type"
                    name="type"
                    label="Agreement Type"
                    value={values.lease_details.lease_type}
                  />
                </Grid>
                <Grid item sm>
                  <TextField
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    id="lease_start"
                    name="lease_start"
                    label="Start - End"
                    value={`${values.lease_details.start_date} - ${values.vacating_date}`}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item sm>
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
                    helperText={errors.notification_date
                    }
                  />
                </Grid>
                <Grid item sm>
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

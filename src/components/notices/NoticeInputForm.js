import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { handleItemFormSubmit } from "../../actions/actions";

const VacatingNoticeSchema = Yup.object().shape({
  tenant: Yup.string().required("Tenant is required"),
  landlord: Yup.string().required("Landlord is required"),
  notification_date: Yup.date().required("Vacating Date Required"),
  vacating_date: Yup.date().required("Vacating Date Required"),
});

const NoticeInputForm = (props) => {
  const history = useHistory();
  const classes = commonStyles();

  const { contacts, users, noticeToEdit } = props;

  let noticeValues = { ...noticeToEdit };

  return (
    <Formik
      initialValues={noticeValues}
      validationSchema={VacatingNoticeSchema}
      onSubmit={(values, { resetForm }) => {
        const vacatingNotice = {
          tenant: values.tenant,
          landlord: values.landlord,
          notice_details: values.notice_details,
          vacating_date: values.vacating_date,
          notification_date: values.notification_date,
          notice_details: values.notice_details,
        };
        handleItemFormSubmit(vacatingNotice, "notices").then(
          (response) => {
            resetForm({});
          }
        );
      }}
    >
      {({
        values,
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
          id="noticeInputForm"
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
                id="landlord"
                name="landlord"
                label="LandLord"
                value={values.landlord}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.landlord && touched.landlord}
                helperText={touched.landlord && errors.landlord}
              >
                {users.map((user, index) => (
                  <MenuItem key={index} value={user.id}>
                    {user.first_name + " " + user.last_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                variant="outlined"
                id="tenant"
                name="tenant"
                label="Tenant"
                value={values.tenant}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.tenant && touched.tenant}
                helperText={touched.tenant && errors.tenant}
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
                id="notification_date"
                name="notification_date"
                label="Notification Date"
                value={values.notification_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notification_date && touched.notification_date}
                helperText={
                  touched.notification_date && errors.notification_date
                }
              />
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="vacating_date"
                name="vacating_date"
                label="Vacating Date"
                value={values.vacating_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.vacating_date && touched.vacating_date}
                helperText={touched.vacating_date && errors.vacating_date}
              />
              <TextField
                fullWidth
                rows={4}
                multiline
                variant="outlined"
                id="notice_details"
                name="notice_details"
                label="Notice Details"
                value={values.notice_details}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notice_details && touched.notice_details}
                helperText={touched.notice_details && errors.notice_details}
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
                form="noticeInputForm"
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

export default NoticeInputForm;

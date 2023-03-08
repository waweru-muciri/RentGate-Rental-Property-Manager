import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  from_user: Yup.string().required("From User is required"),
  email_subject: Yup.string().required("Email Subject Required"),
  email_message: Yup.string().required("Email Message Required"),
});

const EmailDetailsForm = (props) => {
  const classes = commonStyles();
  const { emailValues, submitEmailValues } = props;
  return (
    <Formik
      initialValues={emailValues}
      validationSchema={EmailSchema}
      onSubmit={(values) => {
        const email = {
          from_user: values.from_user,
          email_bcc: values.email_bcc,
          email_subject: values.email_subject,
          email_message: values.email_message,
          email_cc: values.email_cc,
          email_subject: values.email_subject,
        };
        submitEmailValues(email);
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
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                id="from_user"
                name="from_user"
                label="From:"
                value={values.from_user}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.from_user && touched.from_user}
                helperText={touched.from_user && errors.from_user}
              />
              <TextField
                fullWidth
                type="text"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="email_cc"
                name="email_cc"
                label="CC:"
                value={values.email_cc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email_cc && touched.email_cc}
                helperText={touched.email_cc && errors.email_cc}
              />
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="email_bcc"
                name="email_bcc"
                label="BCC:"
                value={values.email_bcc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email_bcc && touched.email_bcc}
                helperText={touched.email_bcc && errors.email_bcc}
              />

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="email_subject"
                name="email_subject"
                label="Email Subject"
                value={values.email_subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email_subject && touched.email_subject}
                helperText={touched.email_subject && errors.email_subject}
              />

              <TextField
                fullWidth
                rows={4}
                multiline
                type="text"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="email_message"
                name="email_message"
                label="Email Message"
                value={values.email_message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email_message && touched.email_message}
                helperText={touched.email_message && errors.email_message}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default EmailDetailsForm;

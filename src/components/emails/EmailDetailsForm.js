import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  from_user: Yup.string().required("From User is required"),
  email_subject: Yup.string().required("Email Subject Required"),
  email_message: Yup.string().trim(),
});

const quillEditorModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const quillEditorFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

const EmailDetailsForm = (props) => {
  const classes = commonStyles();
  const { emailValues, submitEmailValues, handleCancel } = props;
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
      }) => (
          <form
            className={classes.form}
            method="post"
            id="emailDetailsInputForm"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={2}
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
                  helperText={errors.from_user}
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
                  helperText={errors.email_cc}
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
                  error={
                    errors.email_subject && touched.email_subject
                  }
                  helperText={
                    touched.email_subject && errors.email_subject
                  }
                />

                <Typography color='textSecondary' variant='body1' paragraph>Email Message</Typography>
                <ReactQuill
                  placeholder="Email Message"

                  value={values.email_message}
                  onChange={handleChange}
                  theme="snow"
                  modules={quillEditorModules}
                  formats={quillEditorFormats} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="email_message"
                    name="email_message"
                    onBlur={handleBlur}
                    error={'email_message' in errors}
                    helperText={
                      errors.email_message
                    }
                  />
                </ReactQuill>
              </Grid>
            </Grid>
            <Grid
              item
              container
              spacing={2}
            >
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  size="medium"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disableElevation
                >
                  Cancel
                      </Button>
              </Grid>
              <Grid item>
                <Button
                  form="emailDetailsInputForm"
                  type="submit"
                  variant="contained"
                  color="primary">
                  Next
                  </Button>
              </Grid>
            </Grid>
          </form>
        )}
    </Formik>
  );
};

export default EmailDetailsForm;

import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  from_user: Yup.string().required("From User is required"),
  email_subject: Yup.string().trim().required("Email Subject Required"),
  email_message: Yup.string().trim().required("Email Message is Required"),
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

const EmailDetailsForm = ({ emailValues, submitEmailValues, handleCancel, emailTemplates }) => {
  const classes = commonStyles();
  return (
    <Formik
      initialValues={emailValues}
      validationSchema={EmailSchema}
      onSubmit={(values) => {
        const email = {
          from_user: values.from_user,
          email_subject: values.email_subject,
          email_message: values.email_message,
        };
        submitEmailValues(email);
      }}
    >
      {({
        values,
        handleSubmit,
        touched,
        setFieldValue,
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
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  id="template"
                  name="template"
                  label="Template"
                  value={values.template}
                  onChange={(event) => {
                    const selectedTemplate = emailTemplates.find(({id}) => id === event.target.value) || {}
                    setFieldValue('template', event.target.value)
                    setFieldValue('email_message', selectedTemplate.template_contents)
                  }}
                  onBlur={handleBlur}
                  error={errors.template && touched.template}
                  helperText={errors.template}>
                  {emailTemplates.map((emailTemplate, index) => (
                    <MenuItem key={index} value={emailTemplate.id}>
                      {emailTemplate.template_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
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
              </Grid>
              <Grid item>
                <Typography color='textSecondary' variant='body1' paragraph>Email Message</Typography>
                <ReactQuill
                  className={classes.quillEditor}
                  value={values.email_message}
                  onChange={(content) => {
                    setFieldValue('email_message', content)
                  }}
                  theme="snow"
                  modules={quillEditorModules}
                  formats={quillEditorFormats} >
                </ReactQuill>
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
            </Grid>
          </form>
        )}
    </Formik>
  );
};

export default EmailDetailsForm;

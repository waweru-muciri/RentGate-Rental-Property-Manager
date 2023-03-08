import React, { useEffect } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import Typography from "@material-ui/core/Typography";
import EmailsSelect from "./EmailsSelect";
import CancelIcon from "@material-ui/icons/Cancel";
import { commonStyles } from "../commonStyles";
import { Formik } from "formik";
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  from_user: Yup.string().required("From User is required"),
  email_subject: Yup.string().required("Email Subject Required"),
  email_message: Yup.string().required("Email Message Required"),
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

function getSteps() {
  return ["Create an email", "Create a contact group"];
}

export default function HorizontalLinearStepper(props) {
  const { currentUser, users, contacts, history } = props;
  const classes = commonStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const emailDetails = {
    from_user: "",
    email_subject: "",
    email_message: "",
  };

  //for the transfer list below
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [emailsSource, setEmailsSource] = React.useState('Tenants');
  const emailsSources = ["Tenants", "Users"];

  useEffect(() => {
    setLeft(contacts);
  }, [contacts, users])

  const setEmailsBySource = (source) => {
    setEmailsSource(source);
    switch (source) {
      case 'Tenants': setLeft(contacts); setRight([]); setChecked([]);
        break;

      case 'Users': setLeft(users); setRight([]); setChecked([]);
        break;

      default: break;
    }

  }
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.fullHeightWidthContainer}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.oneMarginTopBottom}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.oneMarginRight}>
              Reset
            </Button>
          </div>
        ) : (
            <div>
              {
                <Formik
                  initialValues={emailDetails}
                  validationSchema={EmailSchema}
                  onSubmit={(values) => {
                    const email = {
                      from_user: values.from_user,
                      email_bcc: values.email_bcc,
                      email_subject: values.email_subject,
                      email_message: values.email_message,
                      email_cc: values.email_cc,
                      attachments: values.email_attachments
                    };
                    console.log(email);
                    handleNext();
                  }}
                >
                  {({
                    values,
                    handleSubmit,
                    touched,
                    errors,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                  }) => (
                      <form
                        className={classes.form}
                        method="post"
                        id="emailDetailsInputForm"
                        onSubmit={handleSubmit}
                      >
                        {activeStep === 0 ? (
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
                        ) : (
                            <EmailsSelect
                              contacts={contacts}
                              emailsSources={emailsSources}
                              selectedEmailsSource={emailsSource}
                              setEmailsSource={setEmailsBySource}
                              checked={checked}
                              setChecked={setChecked}
                              setLeft={setLeft}
                              setRight={setRight}
                              right={right}
                              left={left}
                            />
                          )}
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
                              onClick={() => history.goBack()}
                              disableElevation
                            >
                              cancel
                      </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              variant="contained"
                              className={classes.oneMarginRight}
                            >
                              Back
                      </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={activeStep === 1}
                              onClick={handleNext}
                              className={classes.oneMarginRight}
                            >
                              Next
                      </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              disabled={!right.length}
                              form="emailDetailsInputForm"
                              type="submit"
                              variant="contained"
                              color="primary"
                              className={classes.oneMarginRight}
                            >
                              Send
                          </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                </Formik>
              }
            </div>
          )}
      </div>
    </div>
  );
}

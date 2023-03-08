import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { Formik } from "formik";
import EmailsSelect from "./EmailsSelect";
import { commonStyles } from "../commonStyles";
import { sendEmails } from "../../actions/actions";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import * as Yup from "yup";
import CustomCircularProgress from "../CustomCircularProgress";


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
    ['link'],
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
  return ["Create an email", "Select an email group"];
}

export default function HorizontalLinearStepper(props) {

  const { currentUser, contactToSendEmailTo, contactSource,
    users, contacts, history, emailTemplates, handleItemSubmit } = props;

  const classes = commonStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const defaultEmailValues = {
    from_user: currentUser.email || "",
    email_subject: "",
    email_message: "",
    template: '',
  }
  //for the transfer list below
  const [emailValues, setEmailValues] = React.useState(defaultEmailValues);
  const [isSaving, setIsSaving] = React.useState(false);

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setEmailValues(defaultEmailValues)
    setActiveStep(0);
  };

  const handleCancel = () => {
    history.goBack()
  }

  const submitEmailDetailsForm = (emailValues) => {
    setEmailValues(emailValues)
    handleNext()
  }

  const handleSendEmailSubmit = async (emailsArray) => {
    //send the emails here
    setIsSaving(true)
    try {
      await sendEmails(emailValues.from_user, emailValues.email_subject, emailValues.email_message, emailsArray)
      const emailObjectToSave = {
        email_subject: emailValues.email_subject,
        from_user: emailValues.from_user,
        date_sent: new Date().toDateString(),
      }
      await handleItemSubmit(emailObjectToSave, "communication_emails")
    } catch (error) {
      console.log("Error during sending email => ", error)
    }
    setIsSaving(false)
    handleNext()
  }

  return (
    <div className={classes.fullHeightWidthContainer}>
      {
        isSaving && (<CustomCircularProgress dialogTitle="Sending email..." open={true} />)
      }
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
              Email Sent...
            </Typography>
            <Button onClick={handleReset} className={classes.oneMarginRight}>
              Reset
            </Button>
          </div>
        ) : activeStep === 0 ? (
          <Grid container direction="column">
            <Formik
              initialValues={emailValues}
              validationSchema={EmailSchema}
              onSubmit={(values) => {
                const email = {
                  from_user: values.from_user,
                  email_subject: values.email_subject,
                  email_message: values.email_message,
                };
                submitEmailDetailsForm(email);
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
                          const selectedTemplate = emailTemplates.find(({ id }) => id === event.target.value) || {}
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
          </Grid>
        ) : activeStep === 1 ? (
          <EmailsSelect contacts={contacts} users={users} handleBack={handleBack}
            contactToSendEmailTo={contactToSendEmailTo} contactSource={contactSource}
            submitEmailSourceValues={handleSendEmailSubmit} />) : null}
      </div>
    </div>
  );
}

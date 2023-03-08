import React, { useEffect }  from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { Button, TextField, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import EmailsSelect from "./EmailsSelect";
import CancelIcon from "@material-ui/icons/Cancel";
import { commonStyles } from "../commonStyles";
import { Formik } from "formik";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { AttachFile, Description, PictureAsPdf, Theaters } from '@material-ui/icons';
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  from_user: Yup.string().required("From User is required"),
  email_subject: Yup.string().required("Email Subject Required"),
  email_message: Yup.string().required("Email Message Required"),
});

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
    email_attachments: []
  };

  //for the transfer list below
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [emailsSource, setEmailsSource] = React.useState('Tenants');
  const emailsSources  = ["Tenants", "Users"];
	
  useEffect(() => {
	setLeft(contacts);
  }, [contacts, users])

	const setEmailsBySource = (source) => {
setEmailsSource(source);
		switch(source){
			case 'Tenants' : setLeft(contacts); setRight([]); setChecked([]);
			break;

			case 'Users' : setLeft(users); setRight([]); setChecked([]);
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

  const handlePreviewIcon = (fileObject, classes) => {
    const { type } = fileObject.file
    const iconProps = {
      className: classes.image,
    }

    if (type.startsWith("video/")) return <Theaters {...iconProps} />
//    if (type.startsWith("audio/")) return <AudioTrack {...iconProps} />

    switch (type) {
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <Description {...iconProps} />
      case "application/pdf":
        return <PictureAsPdf {...iconProps} />
      default:
        return <AttachFile {...iconProps} />
    }
  }


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
                                error={
                                  errors.email_message && touched.email_message
                                }
                                helperText={
                                  touched.email_message && errors.email_message
                                }
                              />
                                <DropzoneAreaBase fullWidth
                                  filesLimit={50}
								  dropzoneText={"Drag and drop email attachment here or click"}
                                  fileObjects={values.email_attachments}
                                  acceptedFiles={["image/*", 'video/*', 'application/*']}
                                  cancelButtonText={"cancel"}
                                  submitButtonText={"submit"}
                                  getPreviewIcon={handlePreviewIcon}
                                  maxFileSize={5000000}
                                  onDelete={(deleteFileObj, deletedFileIndex) => {
                                     setFieldValue("email_attachments", values.email_attachments.filter((file, fileIndex) => deletedFileIndex !== fileIndex));
                                  }}
                                  onSave={(files) => {
                                    setFieldValue(
                                      "email_attachments",
                                      files
                                    );
                                  }}
                                  onAdd={(newFileObjs) => {
                                    setFieldValue(
                                      "email_attachments",
                                      [].concat(values.email_attachments, newFileObjs)
                                    );
                                  }}
								  showAlerts={false}
								  showFileName={true}
                                  showFileNamesInPreview={true}
                                />
                            </Grid>
                          </Grid>
                        ) : (
                            <EmailsSelect
                              contacts={contacts}
							  emailsSources ={ emailsSources }
                              selectedEmailsSource ={emailsSource}
                              setEmailsSource ={setEmailsBySource}
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

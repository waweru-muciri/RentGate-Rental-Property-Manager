import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { Button, TextField, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import EmailSelect from "./EmailsSelect";
import CancelIcon from "@material-ui/icons/Cancel";
import { commonStyles } from "../commonStyles";
import { Formik } from "formik";
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
  const { currentUser, contacts, history } = props;
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
                    email_subject: values.email_subject,
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
                        </Grid>
                      </Grid>
                    ) : (
                      <EmailSelect
                        contacts={contacts}
                        checked={checked}
                        setChecked={setChecked}
                        setLeft={setLeft}
                        setRight={setRight}
                        right={right}
                        left={left}
                      />
                    )}
                    <div>
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
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.oneMarginRight}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={activeStep === 1}
                        onClick={handleNext}
                        className={classes.oneMarginRight}
                      >
                        Next
                      </Button>
                      <Button
                        disabled={!right.length}
                        form="emailDetailsInputForm"
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.oneMarginRight}
                      >
                        Send{" "}
                      </Button>
                    </div>
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

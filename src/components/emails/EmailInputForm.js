import React, { useEffect } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmailsSelect from "./EmailsSelect";
import EmailDetailsForm from "./EmailDetailsForm";
import { commonStyles } from "../commonStyles";
import { sendEmails } from "../../actions/actions";

function getSteps() {
  return ["Create an email", "Select an email group"];
}

export default function HorizontalLinearStepper(props) {
  const { currentUser, contactToSendEmailTo, contactSource, 
    users, contacts, history, emailTemplates } = props;
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
    //send the fucking emails here
    await sendEmails(emailValues.email_subject, emailValues.email_message, emailsArray)
    handleNext()
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
              Email Sent...
            </Typography>
            <Button onClick={handleReset} className={classes.oneMarginRight}>
              Reset
            </Button>
          </div>
        ) : activeStep === 0 ? (
          <Grid container direction="column">
            <EmailDetailsForm emailValues={emailValues} handleCancel={handleCancel}
              submitEmailValues={submitEmailDetailsForm} emailTemplates={emailTemplates} />
          </Grid>
        ) : activeStep === 1 ? (
          <EmailsSelect contacts={contacts} users={users} handleBack={handleBack} 
          contactToSendEmailTo={contactToSendEmailTo} contactSource={contactSource}
          submitEmailSourceValues={handleSendEmailSubmit} />) : null}
      </div>
    </div>
  );
}

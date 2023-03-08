import React from "react";
import { Dialog, Button, FormHelperText, FormControl, TextField } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as Yup from "yup";
import firebase from "firebase/app";
import { Formik } from "formik";


const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

const resetUserEmail = (email) => {
  return firebase
    .auth().sendPasswordResetEmail(email, { handleCodeInApp: false, url: 'https://www.propertymanager.herokuapp.com/' }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage =
        errorCode === "auth/missing-continue-uri"
          ? "A continue URL must be provided."
          : errorCode === "auth/invalid-continue-uri"
            ? "Continue URL provided is invalid"
            : errorCode === "auth/invalid-email"
              ? "Email is Invalid"
              : errorCode === "auth/unauthorized-continue-uri"
                ? "Continue URL domain is not whitelisted"
                : errorCode === "auth/user-not-found"
                  ? "No user found with email"
                  : "May God help Us";
      return errorMessage
    });
}


export default function FormDialog(props) {
  const { open, handleClose } = props
  const emailValues = { email: '' }
  return (
    <div>
      <Formik
        initialValues={emailValues}
        validationSchema={ResetPasswordSchema}
        onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
          var email = values.email;
          try {
            await resetUserEmail(email)
            resetForm({});
            handleClose()
          } catch (errorMessage) {
            setSubmitting(false);
            setStatus({ error: errorMessage });
            console.log("Error message => ", errorMessage);
          };
        }}
        render={({
          values,
          handleSubmit,
          status,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
            <form
              method="post"
              id="resetPasswordForm"
              onSubmit={handleSubmit}
            >
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To reset your password, please enter your email address here. We
                    will reset link to your email.
                  </DialogContentText>
                  <FormControl fullWidth>
                    {status && (
                      <FormHelperText error={true}>
                        {status.error}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    variant="outlined"
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={errors.email}
                    error={'email' in errors}
                    InputLabelProps={{ shrink: true }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
                  <Button color="primary" disabled={isSubmitting}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    form="resetPasswordForm">
                    Send Reset Link
          </Button>
                </DialogActions>
              </Dialog>
            </form>
          )}
      />
    </div>
  );
}

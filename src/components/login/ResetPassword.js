import React from "react";
import { Dialog, Button, FormHelperText, FormControl, TextField } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as Yup from "yup";
import { Formik } from "formik";


const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

export default function FormDialog(props) {
  const { auth, open, handleClose } = props
 
const resetUserPasswordByEmail = (email) => {
  return auth.sendPasswordResetEmail(email, { handleCodeInApp: false, url: 'https://gallant-propertymanager.herokuapp.com/' })}

 const emailValues = { email: '' }
  return (
    <div>
      <Formik
        initialValues={emailValues}
        validationSchema={ResetPasswordSchema}
        onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
          var email = values.email;
          try {
           	await resetUserPasswordByEmail(email)
            resetForm({});
            setSubmitting(false);
            setStatus({ success: 'Password Reset Email Sent Successfully' });
          } catch (error) {
            setSubmitting(false);
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

            setStatus({ error: errorMessage });
		// console.log('Error sending password reset email => ', error);
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
                    will send the reset link to your email.
                  </DialogContentText>
                    {status &&  status.success && (
                  <FormControl fullWidth>
                      <FormHelperText>
                        {status.success}
                      </FormHelperText>
                  </FormControl>
                    )}
                    {status && status.error && (
                  <FormControl fullWidth>
                      <FormHelperText error={true}>
                        {status.error}
                      </FormHelperText>
                  </FormControl>
                    )}
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

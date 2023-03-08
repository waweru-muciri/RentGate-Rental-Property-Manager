import React, { useState } from "react";
import { auth } from "../firebase";
import Layout from "../components/GeneralLayout";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import queryString from 'query-string';
import { Formik } from "formik";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";


const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Too Short!")
        .max(20, "We prefer insecure system, try a shorter password.")
        .required("Pasword is Required"),
    email: Yup.string().email("Invalid email").required("Email is Required"),
    confirmPassword: Yup.string()
        .required("Confirm Password Required")
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
        }),
});

let AccountActions = (props) => {
    const [emailVerificationSuccess, setEmailVerificationSuccess] = useState()
    const [emailVerificationError, setEmailVerificationError] = useState()
    const classes = commonStyles();

    let loginValues = { email: '', password: "", confirmPassword: "" };

    let params = queryString.parse(props.location.search)
    // Get the action to complete.
    var mode = params.mode;
    // Get the one-time code from the query parameter.
    var actionCode = params.oobCode;

    const applyEmailConfirmationCode = async () => {
        try {
            await auth.applyActionCode(actionCode)
            // Email address has been verified.
            // Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.
            setEmailVerificationSuccess(true)
        } catch (error) {
            // Code is invalid or expired. Ask the user to verify their email address
            // again.
            setEmailVerificationError(true)
        }

    }

    return (
        <Layout>
            <Box border={1} borderRadius="borderRadius" borderColor="grey.400" p={4}>
                {
                    mode === "resetPassword" ?
                        (
                            <Formik
                                initialValues={loginValues}
                                validationSchema={ResetPasswordSchema}
                                onSubmit={async (values, { resetForm, setStatus }) => {
                                    // Verify the password reset code is valid.
                                    try {
                                        var accountEmail = await auth.verifyPasswordResetCode(actionCode)
                                        var newPassword = values.password;
                                        try {
                                            // TODO: Show the reset screen with the user's email and ask the user for
                                            // the new password.
                                            // Save the new password.
                                            await auth.confirmPasswordReset(actionCode, newPassword)
                                            // Password reset has been confirmed and new password updated.
                                            //sign-in the user directly
                                            resetForm({});
                                            setStatus({ success: "Password reset successful!" });
                                        } catch (error) {
                                            setStatus({ error: "Error occurred during confirmation. The code might have expired or the password is too weak." });
                                            console.log('Error confirming password reset => ', error)
                                        }
                                    } catch (error) {
                                        setStatus({ error: "Invalid or expired action code.Please try to reset the password again" })
                                        console.log("Error verifying code => ", error)
                                    }
                                }
                                }
                                render={({
                                    values,
                                    handleSubmit,
                                    touched,
                                    status,
                                    errors,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                }) => (
                                        <form
                                            className={classes.form}
                                            method="post"
                                            id="resetPasswordForm"
                                            onSubmit={handleSubmit}
                                        >
                                            <Grid container justify="center" direction="column" spacing={2}>
                                                <Grid item>
                                                    <Typography variant="subtitle1">Reset Password</Typography>
                                                </Grid>
                                                {status && status.error && (
                                                    <Grid item>
                                                        <FormControl fullWidth>
                                                            <FormHelperText error={true}>
                                                                {status.error}
                                                            </FormHelperText>
                                                        </FormControl>
                                                    </Grid>
                                                )}
                                                {status && status.success && (
                                                    <Grid item>
                                                        <Typography variant="h6">Password reset successful.</Typography>
                                                        <Link component={RouterLink} to="/app/login">Click here to login</Link>
                                                    </Grid>
                                                )}
                                                <Grid item>
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
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        margin="dense"
                                                        id="password"
                                                        label="Password"
                                                        type="password"
                                                        value={values.password}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={touched.password && errors.password}
                                                        error={errors.password && touched.password}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        margin="dense"
                                                        id="confirmPassword"
                                                        label="Confirm Password"
                                                        type="password"
                                                        value={values.confirmPassword}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={
                                                            errors.confirmPassword
                                                        }
                                                        error={'confirmPassword' in errors}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        disabled={isSubmitting}
                                                        type="submit"
                                                        variant="outlined"
                                                        form="resetPasswordForm">
                                                        Reset Password
                                                </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    )
                                }
                            />
                        )
                        : mode === 'verifyEmail' ?
                            // Display email verification handler and UI.
                            // Localize the UI to the selected language as determined by the lang
                            // parameter.
                            // Try to apply the email verification code.
                            (
                                <Grid container justify="center" alignItems="center" direction="column" spacing={2}>
                                    <Grid item>
                                        <Typography variant="subtitle1">Email Account Verification</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={applyEmailConfirmationCode}>Verify Email</Button>
                                    </Grid>
                                    {
                                        emailVerificationSuccess &&
                                        <Grid item>
                                            <Typography variant="subtitle1" align="center">
                                                Email Verified Successfully
                                        </Typography>
                                            <Link component={RouterLink} to="/app/login">Click here to login</Link>
                                        </Grid>
                                    }
                                    {
                                        emailVerificationError &&
                                        <Grid item>
                                            <Typography variant="subtitle1" align="center">
                                                Email Verification Failed! Code is invalid or expired!
                                        </Typography>
                                        </Grid>
                                    }
                                </Grid>
                            )

                            : null
                }
            </Box>
        </Layout>
    );
};

export default connect(null)(AccountActions);

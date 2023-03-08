import React, { useState } from "react";
import firebase from "../../firebase";
import PageHeading from "../PageHeading";
import {
    Grid,
    Button,
    TextField,
    Typography,
    FormControl,
    FormHelperText,
} from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
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

let PasswordResetConfirmation = (props) => {
    const auth = firebase.auth();
    const { actionCode, setUser, history } = props

    const [codeVerificationError, setCodeVerificationError] = useState(undefined)

    const classes = commonStyles();

    let loginValues = { password: "", confirmPassword: "" };

    const verifyPasswordResetCode = async () => {
        // Verify the password reset code is valid.
        try {
            var accountEmail = await auth.verifyPasswordResetCode(actionCode)
            loginValues.email = accountEmail
        } catch (error) {
            setCodeVerificationError(error)
            console.log("Error verifying code => ", error)
        }
    }

    verifyPasswordResetCode()

    const signInWithEmailAndPassword = (email, password) => {
        return auth
            .signInWithEmailAndPassword(email, password)
            .then((authCredential) => {
                const user = authCredential.user;
                const userDetails = {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    id: user.uid,
                    phoneNumber: user.phoneNumber,
                    providerData: user.providerData,
                };
                setUser(userDetails);
            });
    };

    return (
        <Formik
            initialValues={loginValues}
            validationSchema={ResetPasswordSchema}
            onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
                var userEmail = values.email;
                var newPassword = values.password;
                // Verify the password reset code is valid.
                try {
                    // TODO: Show the reset screen with the user's email and ask the user for
                    // the new password.
                    // Save the new password.
                    await auth.confirmPasswordReset(actionCode, newPassword)
                    // Password reset has been confirmed and new password updated.
                    //sign-in the user directly
                    try {
                        await signInWithEmailAndPassword(userEmail, newPassword);
                        history.push('/')
                    } catch (error) {
                        console.log('Cannot sign in user with password change')
                    }
                } catch (error) {
                    setStatus({ error: "Error occurred during confirmation. The code might have expired or the password is too weak." });
                    console.log('Error confirming password reset => ', error)
                }
                setSubmitting(false)
                resetForm({});
            }}
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
                        <Grid container justify="center" direction="column" spacing={3}>
                            <Grid item key={2}>
                                <PageHeading paddingLeft={2} text={"Reset Password"} />
                            </Grid>
                            <Grid item key={'hhhf'}>
                                {
                                codeVerificationError ?
                                    <Typography variant="subtitle1" align="center">
                                        Invalid or expired action code. Please try to reset the password again.
                                    </Typography> : null
                                }
                            </Grid>
                            <Grid item key={3}>
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
                                    color="primary"
                                    form="resetPasswordForm">
                                    Reset Password
                                        </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
        />
    );
};

export default PasswordResetConfirmation;

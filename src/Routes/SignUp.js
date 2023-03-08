import React from "react";
import Layout from "../components/GeneralLayout";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Alert from "@material-ui/lab/Alert"
import Box from "@material-ui/core/Box"
import { connect } from "react-redux";
import { Formik } from "formik";
import { signUpWithEmailAndPassword } from "../actions/actions";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  password: Yup.string().min(6, "Too Short!")
    .max(50, "We prefer an insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  confirmPassword: Yup.string().required("Confirm Password Required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  first_name: Yup.string().trim().min(4, "Too Short!").required("First Name is Required"),
  last_name: Yup.string().trim().min(4, "Too Short!").required("Last Name is Required"),
  phone_number: Yup.string().trim().min(10, "Too Short!").required("Phone Number is Required"),
});

const SignUpLayout = () => {

  const classes = commonStyles();

  let loginValues = { email: "", password: "", confirmPassword: "", first_name: '', last_name: '', phone_number: '' };

  return (
    <Layout maxWidth="md" pageTitle="Sign Up">
      <Typography align="center" variant="h5" gutterBottom paragraph>Sign Up</Typography>
      <Box border={1} borderRadius="borderRadius" borderColor="grey.400">
        <Formik
          initialValues={loginValues}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
            const userDetails = {
              email: values.email,
              password: values.password,
              phone_number: values.phone_number,
              first_name: values.first_name,
              last_name: values.last_name,
              primary_email: values.email
            }
            try {
              await signUpWithEmailAndPassword(userDetails);
              resetForm({});
              setStatus({ success: "Successfully added user" })
            } catch (error) {
              setSubmitting(false);
              setStatus({ error: error.message });
              console.log("Error message => ", error);
            }
          }}>
          {({
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
              id="signUpForm"
              onSubmit={handleSubmit}
            >
              <Grid container justify="center" direction="column" spacing={3}>
                {status && status.error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{status.error}</Alert>
                  </Grid>
                )}
                {status && status.success && (
                  <Grid item>
                    <Alert severity="success">Account created successfully.
                    Please verify your email address. A link to verify your email has been sent to the
                    email provided. </Alert>
                    <Alert severity="success">If you do not receive the confirmation message within a
                    few minutes, please check your spam folder just in case
                    the confirmation email got delivered there instead of your inbox.
                    If so, select the confirmation message and click Not Spam,
                    which will allow future messages to get through.
                    </Alert>
                  </Grid>
                )}
                <Grid item container justify="center" direction="row" spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="first_name"
                      label="First Name"
                      type="first_name"
                      value={values.first_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.first_name && errors.first_name}
                      error={errors.first_name && touched.first_name}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="last_name"
                      label="Last Name"
                      type="last_name"
                      value={values.last_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.last_name && errors.last_name}
                      error={errors.last_name && touched.last_name}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Grid item container justify="center" direction="row" spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="phone_number"
                      label="Phone Number"
                      type="text"
                      value={values.phone_number}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={
                        touched.phone_number && errors.phone_number
                      }
                      error={errors.phone_number && touched.phone_number}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="email"
                      label="Email Address"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={errors.email && touched.email}
                      type="email"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Grid item container justify="center" direction="row" spacing={2}>
                  <Grid item xs={12} md>
                    <TextField
                      fullWidth
                      variant="outlined"
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
                  <Grid item xs={12} md>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={values.confirmPassword}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      error={errors.confirmPassword && touched.confirmPassword}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    form="signUpForm"
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item container direction="row" alignItems="center">
                  <Grid item>
                    <Typography variant="subtitle1">
                      Have an account?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      disabled={isSubmitting}
                      color="primary"
                      component={RouterLink}
                      to={"/app/login"}
                    >
                      Sign In
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};


export default connect(null)(SignUpLayout);

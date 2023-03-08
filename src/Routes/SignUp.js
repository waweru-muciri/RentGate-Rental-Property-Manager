import React from "react";
import Layout from "../components/GeneralLayout";
import PageHeading from "../components/PageHeading";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Link from "@material-ui/core/Link"
import FormHelperText from "@material-ui/core/FormHelperText"
import Box from "@material-ui/core/Box"
import FormControl from "@material-ui/core/FormControl"
import { connect } from "react-redux";
import { Formik } from "formik";
import {
  signUpWithEmailAndPassword,
  handleItemFormSubmit,
} from "../actions/actions";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "We prefer an insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  confirmPassword: Yup.string()
    .required("Confirm Password Required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const SignUpLayout = ({ handleItemSubmit, history }) => {

  const classes = commonStyles();

  let loginValues = { email: "", password: "", confirmPassword: "" };

  return (
    <Layout pageTitle="Sign Up">
      <Box border={1} borderRadius="borderRadius" borderColor="grey.400">
        <Formik
          initialValues={loginValues}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
            var email = values.email;
            var password = values.password;
            try {
              await signUpWithEmailAndPassword(email, password);
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
                  <Grid item key={2}>
                    <PageHeading text={"Sign Up"} />
                  </Grid>
                  {status && status.error && (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <FormHelperText error={true}>{status.error}</FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                  {status && status.success && (
                    <Grid item>
                      <Typography variant="h6" align="center">Verify your email address</Typography>
                      <Typography variant="subtitle1">In order to start using your account, you need to
                      confirm your email address. A link to verify your email has been sent to the email provided.</Typography>
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
                      helperText={touched.email && errors.email}
                      error={errors.email && touched.email}
                      type="email"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                        touched.confirmPassword && errors.confirmPassword
                      }
                      error={errors.confirmPassword && touched.confirmPassword}
                      InputLabelProps={{ shrink: true }}
                    />
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

const mapDispatchToProps = (dispatch) => {
  return {
    handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
  };
};

export default connect(null, mapDispatchToProps)(SignUpLayout);

import React from "react";
import Layout from "../components/GeneralLayout";
import PageHeading from "../components/PageHeading";
import { useHistory, Link } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
  setCurrentUser,
  signUpWithEmailAndPassword,
  handleItemFormSubmit,
} from "../actions/actions";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "We prefer insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  confirmPassword: Yup.string()
    .required("Confirm Password Required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const SignUpLayout = ({ setUser }) => {
  const history = useHistory();

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
              const createdUser = await signUpWithEmailAndPassword(email, password);
              setUser(createdUser)
              resetForm({});
              history.push("/");
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
                  <PageHeading paddingLeft={2} text={"Sign Up"} />
                </Grid>
                <FormControl fullWidth>
                  {status && (
                    <FormHelperText error={true}>{status.error}</FormHelperText>
                  )}
                </FormControl>
                <Grid item key={3}>
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
                <Grid item>
                  <Typography variant="subtitle1">
                    Have an account?
                    <Button
                      disabled={isSubmitting}
                      color="primary"
                      component={Link}
                      to={"/login"}
                    >
                      Sign In
                    </Button>
                  </Typography>
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
    submitForm: (currentUser, userDetails) => dispatch(handleItemFormSubmit(currentUser, userDetails, "users")),
    setUser: (user) => dispatch(setCurrentUser(user)),
  };
};

export default connect(null, mapDispatchToProps)(SignUpLayout);

import React from "react";
import firebase from "firebase/app";
import Layout from "../components/myLayout";
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
import { setCurrentUser, handleItemFormSubmit } from "../actions/actions";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";

const signUpWithEmailAndPassword = (email, password) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((authCredential) => {
      const user = authCredential.user;
      const userDetails = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        providerData: user.providerData,
      };
      user.getIdToken().then(function (accessToken) {
        userDetails.accessToken = accessToken;
      });
      setCurrentUser(userDetails);
    });
};

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
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            var email = values.email;
            var password = values.password;
            signUpWithEmailAndPassword(email, password)
              .then(() => history.push("/"))
              .catch(function (error) {
                // Handle Errors here.
              resetForm({});
              setSubmitting(false);
                var errorCode = error.code;
                var errorMessage =
                  errorCode === "auth/weak-password"
                    ? "The password is too weak."
                    : errorCode === "auth/operation-not-allowed"
                    ? "Operation Not Allowed"
                    : errorCode === "auth/invalid-email"
                    ? "Email is Invalid"
                    : errorCode === "auth/email-already-in-use"
                    ? "Email is already in Use"
                    : "May God help Us";
                setStatus({ error: errorMessage });
                console.log("Error code => ", errorCode);
                console.log("Error message => ", errorMessage);
              });
          }}
          render={({
            values,
            handleSubmit,
            touched,
            status,
            errors,
            handleChange,
            handleBlur,
            isSubmitting
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
                  {status && 
                    <FormHelperText error={true}>
                      {status.error}
                    </FormHelperText>
                  }
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
                  <Button type="submit" variant="outlined" color="primary" form="signUpForm">
                    Sign Up
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    Have an account?
                    <Button color="primary" component={Link} to={"/login"}>
                      Sign In
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </Box>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitForm: (contact) => {
      dispatch(handleItemFormSubmit(contact, "user"));
    },
    setUser: (user) => {
      dispatch(setCurrentUser(user));
    },
  };
};

export default connect(null, mapDispatchToProps)(SignUpLayout);

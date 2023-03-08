import React from "react";
import app from "../firebase";
import firebase from "firebase/app";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
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
import PasswordResetDialog from "../components/login/ResetPassword";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const signInWithEmailAndPassword = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
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

const SignInSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "We prefer insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

let SignInLayout = ({ setUser }) => {
  const history = useHistory();

  const classes = commonStyles();

  let loginValues = { email: "", password: "" };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Layout pageTitle="Sign In">
      <Box border={1} borderRadius="borderRadius" borderColor="grey.400">
        <Formik
          initialValues={loginValues}
          validationSchema={SignInSchema}
          onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
            var email = values.email;
            var password = values.password;
            signInWithEmailAndPassword(email, password)
              .then(() => history.push("/"))
              .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage =
                  errorCode === "auth/wrong-password"
                    ? "Wrong password."
                    : errorCode === "auth/user-disabled"
                    ? "User account disabled"
                    : errorCode === "auth/invalid-email"
                    ? "Email is Invalid"
                    : errorCode === "auth/user-not-found"
                    ? "No user found with email"
                    : "May God help Us";
                setSubmitting(false);
                setStatus({ error: errorMessage });
                console.log("Error code => ", errorCode);
                console.log("Error message => ", errorMessage);
              });
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
              id="signInForm"
              onSubmit={handleSubmit}
            >
              <Grid container justify="center" direction="column" spacing={3}>
                <Grid item key={2}>
                  <PageHeading paddingLeft={2} text={"Sign In"} />
                </Grid>
                <PasswordResetDialog open={open} handleClose={handleClose} />
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
                </Grid>
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    form="signInForm"
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    Forgot your Password?
                    <Button
                      disabled={isSubmitting}
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      Reset Password
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

export default connect(null, mapDispatchToProps)(SignInLayout);

import React from "react";
import app from "../firebase";
import firebase from "firebase/app";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import { Grid, Button, TextField, Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { setCurrentUser, handleItemFormSubmit } from "../actions/actions";
import PasswordResetDialog from "../components/login/ResetPassword";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";

const signInWithEmailAndPassword = (email, password) => {
  firebase
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
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error code => ", errorCode);
      console.log("Error message => ", errorMessage);
    });
};

let SignInLayout = ({
  values,
  handleSubmit,
  touched,
  errors,
  handleChange,
  handleBlur,
}) => {
  let classes = commonStyles();

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
        <form
          className={classes.form}
          method="post"
          id="contactSearchForm"
          onSubmit={handleSubmit}
        >
          <Grid container justify="center" direction="column" spacing={3}>
            <Grid item key={2}>
              <PageHeading paddingLeft={2} text={"Sign In"} />
            </Grid>
            <PasswordResetDialog open={open} handleClose={handleClose} />
            <Grid item key={3}>
              <TextField
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
                fullWidth
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
              />
            </Grid>
            <Grid item>
              <Button type="submit" variant="outlined" color="primary">
                Sign In
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                Forgot your Password?
                <Button color="primary" onClick={handleClickOpen}>
                  Reset Password
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
};

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "We prefer insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

let SignInPage = withFormik({
  mapPropsToValues: (props) => {
    return {
      submitForm: props.submitForm,
      setUser: props.setUser,
    };
  },

  validationSchema: SignupSchema,

  handleSubmit: (values, { resetForm }) => {
    var email = values.email;
    var password = values.password;
    signInWithEmailAndPassword(email, password);
    resetForm({});
  },
  enableReinitialize: true,
  displayName: "Sign In Form", // helps with React DevTools
})(SignInLayout);

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

export default connect(null, mapDispatchToProps)(SignInPage);

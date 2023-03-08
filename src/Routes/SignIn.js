import React from "react";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import {
  Grid,
  Button,
  TextField,
  Box,
  Typography,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Formik } from "formik";
import { signInUserWithEmailAndPassword, setCurrentUser } from "../actions/actions";
import PasswordResetDialog from "../components/login/ResetPassword";
import { commonStyles } from "../components/commonStyles";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const SignInSchema = Yup.object().shape({
  password: Yup.string().trim()
    .min(6, "Too Short!")
    .max(50, "We prefer insecure system, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().trim().email("Invalid email").required("Email is Required"),
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
          onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
            var email = values.email;
            var password = values.password;
            try {
              const signedInUser = await signInUserWithEmailAndPassword(email, password)
              setUser(signedInUser)
              resetForm({});
              history.push("/")
            } catch (error) {
              setSubmitting(false);
              setStatus({ error: error.message });
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
          }) => {
            const passwordOrOtherError = (touched.password && errors.password) ||  (status && status.error)
            return (
				  <div>
                  <PasswordResetDialog open={open} handleClose={handleClose} />
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
                      helperText={ passwordOrOtherError }
                      error={( passwordOrOtherError ? true : false)}
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
				  </div>
            )}}
        </Formik>
      </Box>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setCurrentUser(user)),
  };
};

export default connect(null, mapDispatchToProps)(SignInLayout);

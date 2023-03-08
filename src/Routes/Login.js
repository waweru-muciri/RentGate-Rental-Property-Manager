import React from "react";
import app from "../firebase";
import firebase from "firebase";
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import { Grid, Button } from "@material-ui/core";
import * as firebaseui from "firebaseui";
import "../../node_modules/firebaseui/dist/firebaseui.css";
import { connect } from "react-redux";
import { setCurrentUser } from "../actions/actions";

let LoginPage = ({setUser}) => {
  const login = () => {
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(app.auth());
    var uiConfig = {
      callbacks: {
        signInFailure: function (error) {
          window.alert("A fucking error mate!");
        },
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          const userObject = authResult.user
          const loggedInUser =  {
            displayName: userObject.displayName,
            email: userObject.email,
            emailVerified: userObject.emailVerified,
            photoURL: userObject.photoURL,
            uid: userObject.uid,
            phoneNumber: userObject.phoneNumber,
            providerData: userObject.providerData,
          };
          setUser(loggedInUser);
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("login_button").style.display = "none";
        },
      },
      signInSuccessUrl: "/",
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: "select_account",
          },
        },
      ],
      // Terms of service url.
      tosUrl: "/terms_of_service",
      // Privacy policy url.
      privacyPolicyUrl: "/privacy_policy",
    };
    if (ui.isPendingRedirect()) {
      ui.start("#firebaseui-auth-container", uiConfig);
    } else {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  };

  return (
    <Layout pageTitle="Login">
      <Grid container justify="center" direction="column">
        <Grid item key={2}>
          <PageHeading paddingLeft={2} text={"Login"} />
        </Grid>
        <Grid container direction="column" justify="center" item key={3}>
          <div id="firebaseui-auth-container"></div>
          <Button
            id="login_button"
            color="primary"
            variant="contained"
            onClick={() => login()}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setCurrentUser(user));
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginPage);

import React from "react";
import app from "../firebase";
import firebase from 'firebase'
import Layout from "../components/myLayout";
import PageHeading from "../components/PageHeading";
import { Grid, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { setCurrentUser } from "../actions/actions";

let LoginPage = ({ setUser }) => {
  // Initialize the FirebaseUI Widget using Firebase.
  var firebaseui = require("firebaseui");
  var ui = new firebaseui.auth.AuthUI(app.auth());
  var uiConfig = {
    callbacks: {
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("login_button").style.display = "none";
      },
    },
    signInSuccessUrl: "/dashboard",
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

  const initApp = () => {
    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          // User is signed in.
           const userDetails = {
           displayName : user.displayName,
           email : user.email,
           emailVerified : user.emailVerified,
           photoURL : user.photoURL,
           uid : user.uid,
           phoneNumber : user.phoneNumber,
           providerData : user.providerData,
        }
          user.getIdToken().then(function (accessToken) {
            userDetails.accessToken = accessToken;
          });
          setUser(userDetails)
        } else {
          // User is signed out.
              setUser(user);
        }
      },
      function (error) {
        console.log(error);
      }
    );
  }

  initApp();
  
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
            onClick={() => {
              if (ui.isPendingRedirect()) {
                ui.start("#firebaseui-auth-container", uiConfig);
              } else {
                ui.start("#firebaseui-auth-container", uiConfig);
              }
            }}
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

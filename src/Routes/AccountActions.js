import React from "react";
import app from "../firebase";
import Layout from "../components/myLayout";
import {
    Box, Button, Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import { setCurrentUser } from "../actions/actions";
import { useHistory, Link } from "react-router-dom";
import queryString from 'query-string';
import PasswordResetConfirmation from "../components/login/PasswordResetConfirmation";


let AccountActions = (props) => {
    const { setUser } = props
    const auth = app.auth()
    const history = useHistory();
    let params = queryString.parse(props.location.search)
    // Get the action to complete.
    var mode = params.mode;
    // Get the one-time code from the query parameter.
    var actionCode = params.oobCode;

    // Handle the user management action.
    const getLayout = () => {
        let componentToDisplay;
        switch (mode) {
            case 'resetPassword':
                componentToDisplay = <PasswordResetConfirmation auth={auth} history={history} actionCode={actionCode} setUser={setUser} />
                break;

            case 'verifyEmail':
                // Display email verification handler and UI.
                // Localize the UI to the selected language as determined by the lang
                // parameter.
                // Try to apply the email verification code.
                componentToDisplay = async () => {
                    try {
                        await auth.applyActionCode(actionCode)
                        // Email address has been verified.

                        // Display a confirmation message to the user.
                        // You could also provide the user with a link back to the app.
                        return (
                            <div>
                                <Typography variant="subtitle1" align="center">
                                    Email Verified Successfully
                            </Typography>
                                <Button component={Link} to={'/sign-in'}>Sign In</Button>
                            </div>)
                    } catch (error) {
                        // Code is invalid or expired. Ask the user to verify their email address
                        // again.
                        return (<Typography variant="subtitle1" align="center">
                            Email Verification Failed! Code is invalid or expired!
                        </Typography>)
                    }
                }
                break;
            default:
            // Error: invalid mode.
        }
        return componentToDisplay;
    }

    return (
        <Layout pageTitle="Sign In">
            <Box border={1} borderRadius="borderRadius" borderColor="grey.400">
                {getLayout()}
            </Box>
        </Layout>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => dispatch(setCurrentUser(user)),
    };
};

export default connect(null, mapDispatchToProps)(AccountActions);

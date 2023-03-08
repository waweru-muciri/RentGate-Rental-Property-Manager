import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import AccountSettings from "../components/users/AccountSettings";
import { withRouter } from "react-router-dom";

let ContactPage = ({userToShow}) => {
    
	const pageTitle = "Account Settings";

	return (
		<Layout pageTitle={pageTitle}>
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading  text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<AccountSettings userToShow={userToShow} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	console.log("currentUser => ", state.currentUser)
	return {
		userToShow: state.contacts.find(({id}) => id === state.currentUser.uid) || {},
	};
};

ContactPage = connect(mapStateToProps)(ContactPage);

export default withRouter(ContactPage);

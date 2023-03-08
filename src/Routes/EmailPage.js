import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import EmailInputForm from "../components/emails/EmailInputForm";
import { withRouter } from "react-router-dom";

let EmailPage = (props) => {
	const { users, currentUser, contacts } = props
	let emailToEditId = props.match.params.emailId;

	let emailToEdit = props.communication_emails.find(({ id }) => id === emailToEditId);
	let pageTitle = typeof emailToEdit !== 'undefined' ? "Edit Email campaign" : "New Email Campaign";

	return (
		<Layout pageTitle="Email Campaign Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading paddingLeft={2} text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<EmailInputForm currentUser={currentUser} emailToEdit={emailToEdit} contacts={contacts} history={props.history} users={users}/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts,
		currentUser: state.currentUser,
		communication_emails : state.communication_emails,
		error: state.error,
		users: state.users,
	};
};

EmailPage = connect(mapStateToProps)(EmailPage);

export default withRouter(EmailPage);

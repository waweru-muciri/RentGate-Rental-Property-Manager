import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import EmailInputForm from "../components/emails/EmailInputForm";
import { withRouter } from "react-router-dom";
import queryString from 'query-string';

let EmailPage = (props) => {
	const { users, currentUser, contacts, emailTemplates } = props
	const pageTitle = "Compose Email";
	const params = queryString.parse(props.location.search)
	var contactToSendEmailTo = params.contact;
	var contactSource = params.contactSource;
	const contactToSendEmailToDetails = users.find(({id}) => id === contactToSendEmailTo)

	return (
		<Layout pageTitle="Email Campaign Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<EmailInputForm contactToSendEmailTo={contactToSendEmailToDetails} contactSource={contactSource}
						currentUser={currentUser} contacts={contacts} history={props.history}
						users={users} emailTemplates={emailTemplates} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts,
		currentUser: state.currentUser,
		emailTemplates: state.emailTemplates,
		users: state.users,
	};
};

EmailPage = connect(mapStateToProps)(EmailPage);

export default withRouter(EmailPage);

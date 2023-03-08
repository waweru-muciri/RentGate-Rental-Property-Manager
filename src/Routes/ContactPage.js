import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ContactInputForm from "../components/contacts/ContactInputForm";
import { withRouter } from "react-router-dom";

let ContactPage = (props) => {
	let contactToEditId = props.match.params.contactId;

	let contactToEdit;

	if (typeof contactToEditId != "undefined") {
		contactToEdit = props.contacts.find(({ id }) => id === contactToEditId);
	}
	let pageTitle = contactToEditId ? "Edit Contact" : "New Contact";

	return (
		<Layout pageTitle="Contact Details">
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
					<ContactInputForm contactToEdit={contactToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts,
		error: state.error,
	};
};

ContactPage = connect(mapStateToProps)(ContactPage);

export default withRouter(ContactPage);

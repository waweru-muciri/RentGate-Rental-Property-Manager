import React from "react";
import Grid  from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import UserInputForm from "../components/users/UserInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let UserPage = ({ match, userToEdit, handleItemSubmit }) => {

	const pageTitle = userToEdit.id ? "Edit User" : "New User";

	return (
		<Layout pageTitle="User Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading text={pageTitle} />
					<Typography variant='body1' color="textSecondary">
						Only admin user can create/edit users
					</Typography>
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<UserInputForm match={match} userToEdit={userToEdit} handleItemSubmit={handleItemSubmit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		userToEdit: state.users.find(({ id }) => id === ownProps.match.params.userId) || {},
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

UserPage = connect(mapStateToProps, mapDispatchToProps)(UserPage);

export default withRouter(UserPage);

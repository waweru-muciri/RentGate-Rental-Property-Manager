import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PropertyInputForm from "../components/property/PropertyInputForm";
import { withRouter } from "react-router-dom";

let PropertyPage = ({propertyToEdit}) => {

	const pageTitle = propertyToEdit.id ? "Edit Property" : "Add Property";

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
					<PropertyInputForm propertyToEdit={propertyToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		propertyToEdit : state.properties.find(({ id }) => id === ownProps.match.params.propertyId) || {},
	};
};

PropertyPage = connect(mapStateToProps)(PropertyPage);

export default withRouter(PropertyPage);

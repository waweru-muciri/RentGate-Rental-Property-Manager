import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import UnitLeaseInputForm from "../components/property/UnitLeaseInputForm";
import { withRouter } from "react-router-dom";

let PropertyPage = (props) => {
	let propertyToEditId = props.match.params.propertyId;

	let propertyToEdit;

	if (typeof propertyToEditId != "undefined") {
		propertyToEdit = props.properties.find(
			({ id }) => id === propertyToEditId
		);
	}

	let pageTitle = propertyToEditId ? "Edit Property" : "Add Property";

	return (
		<Layout pageTitle={pageTitle}>
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
					<UnitLeaseInputForm propertyToEdit={propertyToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		properties: state.properties,
	};
};

PropertyPage = connect(mapStateToProps)(PropertyPage);

export default withRouter(PropertyPage);

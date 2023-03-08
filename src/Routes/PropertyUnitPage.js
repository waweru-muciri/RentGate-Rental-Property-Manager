import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PropertyUnitInputForm from "../components/property/PropertyUnitInputForm";
import { withRouter } from "react-router-dom";

let PropertyPage = (props) => {
	let propertyUnitToEditId = props.match.params.propertyUnitId;

	let propertyUnitToEdit = props.propertyUnits.find(({ id }) => id === propertyUnitToEditId);

	let pageTitle = propertyUnitToEdit ? "Edit Unit" : "Add Unit";

	return (
		<Layout pageTitle={pageTitle}>
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading  text={pageTitle} />
				</Grid>
				<Grid
					item
				>
					<PropertyUnitInputForm propertyUnitToEdit={propertyUnitToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		propertyUnits: state.propertyUnits,
	};
};

PropertyPage = connect(mapStateToProps)(PropertyPage);

export default withRouter(PropertyPage);

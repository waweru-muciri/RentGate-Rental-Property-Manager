import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PropertyUnitInputForm from "../components/property/PropertyUnitInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from "../actions/actions";

let PropertyUnitPage = ({ propertyUnitToEdit, properties, handleItemSubmit }) => {

	let pageTitle = propertyUnitToEdit.id ? "Edit Unit" : "Add Unit";

	return (
		<Layout pageTitle={pageTitle}>
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading text={pageTitle} />
				</Grid>
				<Grid
					item
				>
					<PropertyUnitInputForm handleItemSubmit={handleItemSubmit}
						propertyUnitToEdit={propertyUnitToEdit} properties={properties} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	let propertyUnitToEdit = state.propertyUnits.find(({ id }) => id === ownProps.match.params.propertyUnitId);
	if (!propertyUnitToEdit) {
		const propertyToAddUnit = state.properties.find(({ id }) => id === ownProps.match.params.propertyId) || {};
		propertyUnitToEdit = {
			property_id: propertyToAddUnit.id
		}
	}

	return {
		propertyUnitToEdit: propertyUnitToEdit,
		properties: state.properties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

PropertyUnitPage = connect(mapStateToProps, mapDispatchToProps)(PropertyUnitPage);

export default withRouter(PropertyUnitPage);

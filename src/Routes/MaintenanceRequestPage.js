import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../actions/actions'
import MaintenanceRequestInputForm from "../components/maintenance/MaintenanceInputForm";
import { withRouter } from "react-router-dom";

let MaintenanceRequestPage = ({ history, contacts, properties, propertyUnits, maintenanceRequestToEdit, handleItemSubmit }) => {
	const pageTitle = maintenanceRequestToEdit.id ? "Edit Maintenance Request" : "New Maintenance Request";

	return (
		<Layout pageTitle="Maintenance Request Details">
			<Grid container justify="center" direction="column">
				<Grid item key={1}>
					<PageHeading text={pageTitle} />
				</Grid>
				<Grid item key={2}>
					<MaintenanceRequestInputForm
						maintenanceRequestToEdit={maintenanceRequestToEdit}
						contacts={contacts}
						handleItemSubmit={handleItemSubmit}
                        history={history}
                        properties={properties}
                        propertyUnits={propertyUnits}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	//only allow adding meter readings to units with active leases
	const unitsWithActiveLeases = state.leases
		.filter(({ terminated }) => terminated !== true)
		.map(activeLease => ({
			...state.propertyUnits.find(unit => unit.id === activeLease.unit_id),
			tenant_id: Array.isArray(activeLease.tenants) ? activeLease.tenants[0] : ''
		}))
	return {
		maintenanceRequestToEdit: state.maintenanceRequests.find(({ id }) => id === ownProps.match.params.maintenanceRequestId) || {},
		properties: state.properties,
        propertyUnits: unitsWithActiveLeases,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};


MaintenanceRequestPage = connect(mapStateToProps, mapDispatchToProps)(MaintenanceRequestPage);

export default withRouter(MaintenanceRequestPage);

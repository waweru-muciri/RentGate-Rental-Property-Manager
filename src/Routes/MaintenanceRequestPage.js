import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../actions/actions'
import MaintenanceRequestInputForm from "../components/maintenance/MaintenanceInputForm";
import { withRouter } from "react-router-dom";

let MaintenanceRequestPage = ({match, history, contacts, maintenanceRequests, handleItemSubmit}) => {
	let maintenanceRequestToEditId = match.params.maintenanceRequestId;
	let maintenanceRequestToEdit = maintenanceRequests.find(({ id }) => id === maintenanceRequestToEditId) || {};
	let pageTitle = maintenanceRequestToEdit.id
		? "Edit Maintenance Request"
		: "New Maintenance Request";

	return (
		<Layout pageTitle="Maintenance Request Details">
			<Grid container justify="center" direction="column">
				<Grid item key={1}>
					<PageHeading  text={pageTitle} />
				</Grid>
				<Grid item key={2}>
					<MaintenanceRequestInputForm
						maintenanceRequestToEdit={maintenanceRequestToEdit}
						contacts={contacts}
						handleItemSubmit={handleItemSubmit}
						history={history}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		maintenanceRequests: state.maintenanceRequests,
		contacts: state.contacts,
	};
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};


MaintenanceRequestPage = connect(mapStateToProps, mapDispatchToProps)(MaintenanceRequestPage);

export default withRouter(MaintenanceRequestPage);

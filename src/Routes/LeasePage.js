import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import {
	handleItemFormSubmit,
	handleDelete,
} from "../actions/actions";
import UnitLeaseInputForm from "../components/property/UnitLeaseInputForm";
import { withRouter } from "react-router-dom";

let TransactionPage = ({ leaseToEdit, tenantsToShow, history, properties, propertyUnitsToShow,
	leaseUnitCharges, handleItemSubmit, handleItemDelete }) => {

	const pageTitle = leaseToEdit.id ? "Edit Rental Agreement" : "Add Rental Agreement";

	return (
		<Layout pageTitle="Rental Agreement Details">
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
					<UnitLeaseInputForm
						contacts={tenantsToShow} history={history}
						properties={properties} propertyUnits={propertyUnitsToShow}
						leaseUnitCharges={leaseUnitCharges}
						handleItemSubmit={handleItemSubmit}
						handleItemDelete={handleItemDelete}
						leaseToEdit={leaseToEdit}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	const leaseToEdit = state.leases.find(({ id }) => id === ownProps.match.params.leaseId) || {}
	//here we are editing this lease so we need to remove it from active leases
	//add unit to units without active leases for it to be selected
	const activeLeases = leaseToEdit.id ?
		state.leases.filter(({ terminated, id }) => terminated !== true && id !== leaseToEdit.id) :
		state.leases.filter(({ terminated }) => terminated !== true)
	const unitsWithActiveLeases = activeLeases.map(lease => lease.unit_id)
	const contactsWithActiveLeases = []
	activeLeases.forEach(lease => {
		contactsWithActiveLeases.push(...lease.tenants)
	});
	const propertyUnitsToShow = state.propertyUnits.filter(({ id }) => !unitsWithActiveLeases.includes(id))
	const tenantsToShow = state.contacts.filter(({ id }) => !contactsWithActiveLeases.includes(id))

	return {
		leaseToEdit: state.leases.find(({ id }) => id === ownProps.match.params.leaseId) || {},
		properties: state.properties,
		propertyUnitsToShow: propertyUnitsToShow,
		tenantsToShow: tenantsToShow,
		leaseUnitCharges: state.propertyUnitCharges.filter(({ lease_id }) => lease_id === leaseToEdit.id),
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

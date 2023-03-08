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

let TransactionPage = ({ leases, match, contacts, history, properties, propertyUnits,
	propertyUnitCharges, handleItemSubmit, handleItemDelete }) => {
	const leaseToEditId = match.params.leaseId;
	const leaseToEdit = leases.find(({ id }) => id === leaseToEditId) || {};
	const pageTitle = leaseToEdit.id ? "Edit Rental Agreement" : "Add Rental Agreement";
	let activeLeases = leases.filter(({ terminated }) => terminated !== true)
	if (leaseToEdit.id) {
		//add unit to units without active leases for it to be selected
		activeLeases = activeLeases.filter(({id}) => id !== leaseToEditId)
	}
	const unitsWithActiveLeases = activeLeases
		.map(lease => lease.unit_id)
	const contactsWithActiveLeases = []
	activeLeases.forEach(lease => contactsWithActiveLeases.push(...lease.tenants))
	const propertyUnitsToShow = propertyUnits.filter(({ id }) => !unitsWithActiveLeases.includes(id))
	const tenantsToShow = contacts.filter(({ id }) => !contactsWithActiveLeases.includes(id))
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
						propertyUnitCharges={propertyUnitCharges}
						handleItemSubmit={handleItemSubmit}
						handleItemDelete={handleItemDelete}
						leaseToEdit={leaseToEdit}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		leases: state.leases,
		contacts: state.contacts,
		properties: state.properties,
		propertyUnits: state.propertyUnits,
		propertyUnitCharges: state.propertyUnitCharges,
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

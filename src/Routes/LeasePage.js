import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import UnitLeaseInputForm from "../components/property/UnitLeaseInputForm";
import { withRouter } from "react-router-dom";

let TransactionPage = (props) => {
	let leaseToEditId = props.match.params.leaseId;
	let leaseToEdit = props.leases.find(({ id }) => id === leaseToEditId) || {};
	let pageTitle =  leaseToEdit.id ? "Edit Rental Agreement" : "Add New Rental Agreement";

	return (
		<Layout pageTitle="Rental Agreement Details">
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
					<UnitLeaseInputForm
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
	};
};

TransactionPage = connect(mapStateToProps)(TransactionPage);

export default withRouter(TransactionPage);

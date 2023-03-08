import React from 'react'
import { Grid} from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from '../components/myLayout';
import { connect } from 'react-redux'
import MaintenanceRequestInputForm from "../components/maintenance/MaintenanceInputForm";
import { withRouter } from 'react-router-dom';


let MaintenanceRequestPage = (props) =>  {
	let maintenanceRequestToEditId = props.match.params.maintenanceRequestId
	console.log('Request id => ' , maintenanceRequestToEditId);
	let maintenanceRequestToEdit; 

	if(typeof maintenanceRequestToEditId != 'undefined'){
		 maintenanceRequestToEdit = props.maintenanceRequests.find(({ id }) => id === maintenanceRequestToEditId)
	}

	let pageTitle = maintenanceRequestToEditId ? "Edit Maintenance Request(s)" : "New Maintenance Request(s)"		

    return (
        <Layout pageTitle="Maintenance Request Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
            		<PageHeading paddingLeft={2} text={pageTitle} />
				</Grid>
				<Grid item key={3}>
			    	<MaintenanceRequestInputForm maintenanceRequestToEdit={maintenanceRequestToEdit} />
				</Grid>
				</Grid>
				</Layout>
			);
		}

const mapStateToProps = (state) => {
    return {
        maintenanceRequests: state.maintenanceRequests, error: state.error
    }
}


MaintenanceRequestPage = connect(
    mapStateToProps,
)(MaintenanceRequestPage)


export default withRouter(MaintenanceRequestPage);

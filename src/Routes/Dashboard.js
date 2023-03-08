import Layout from '../components/myLayout';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import UndoIcon from '@material-ui/icons/Undo';
import AddIcon from '@material-ui/icons/Add';
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem, Typography }from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { connect } from "react-redux";
import { itemsFetchData, handleDelete } from '../actions/actions'
import PageHeading from '../components/PageHeading';
import CommonTable from '../components/table/commonTable';
import {commonStyles} from '../components/commonStyles';
import LoadingBackdrop  from '../components/loadingBackdrop';
import { withRouter } from 'react-router-dom';
import ExportToExcelBtn from "../components/ExportToExcelBtn";


let DashboardPage = ({
    isLoading,
    contacts,
    match,
    error,
    fetchData,
    handleDelete,
    submitForm
}) => {
   const [selected, setSelected] = useState([]);
	
    const classes = commonStyles()

    useEffect(() => {
        if (!contacts.length) {
            fetchData('contacts');
        }
    }, [contacts.length, fetchData])

    const exportContactRecordsToExcel = () => {
		let items = contacts.filter(({id}) => selected.includes(id)) 
        exportDataToXSL('Contacts  Records', 'Contact Data', items, 'ContactData')
    }

    return (
        <Layout pageTitle="Dashboard">
            <Grid container spacing={3} justify="space-evenly" alignItems="center">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <PageHeading text="Dashboard" />
                </Grid>
				<Grid container spacing={2} item  alignItems="center"  direction="row" key={1}>
					<Grid item>
						<Typography variant="subtitle1">
							It's a dream. It's just a dream.
						</Typography>
					</Grid>
					<Grid item>
					</Grid>
					<Grid item>
                		<ExportToExcelBtn aria-label="Export to Excel" disabled={ selected.length <= 0 } onClick={event => { exportContactRecordsToExcel() }}/>
					</Grid>
				</Grid>
                <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
                    {
                        error && <div>
                            <CustomizedSnackbar variant="error" message={error.message} />
                        </div>
                    }
                </Grid>
			{
			  isLoading && <LoadingBackdrop open={isLoading}/>
			}
            </Grid>
        </Layout >
    );
}


const mapStateToProps = (state, ownProps) => {
    return {
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => {
            dispatch(itemsFetchData(url))
        },
        handleDelete: (id) => {
            dispatch(handleDelete(id, 'contacts'));
        },
    }
}

DashboardPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DashboardPage)

export default withRouter(DashboardPage);

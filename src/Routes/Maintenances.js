import Layout from '../components/myLayout';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import UndoIcon from '@material-ui/icons/Undo';
import AddIcon from '@material-ui/icons/Add';
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem }from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { connect } from "react-redux";
import { itemsFetchData, handleDelete } from '../actions/actions'
import PageHeading from '../components/PageHeading';
import CommonTable from '../components/table/commonTable';
import {commonStyles} from '../components/commonStyles';
import LoadingBackdrop  from '../components/loadingBackdrop';
import { withRouter } from 'react-router-dom';
import ExportToExcelBtn from "../components/ExportToExcelBtn";

const STATUS_LIST = ['Open', 'Closed'];
const USERS_LIST = [];


const maintenanceRequestsTableHeadCells = [
		{id: 'date_created', numeric: false, disablePadding: true, label: 'Date Created' },
		{id: 'name', numeric: false, disablePadding: true, label: 'Contact Name' },
		{id: 'phone_number', numeric: false, disablePadding: true, label: 'Contact Phone Number' },
		{id: 'email', numeric: false, disablePadding: true, label: 'Contact Email' },
		{id: 'created_by', numeric: false, disablePadding: true, label: 'Created By' },
		{id: 'status', numeric: false, disablePadding: true, label: 'Status' },
]

    const rows = [
		{ id: 1, name: 'Brian Muciri', status: 'active', email: "bwwaweru18@gmail.com", date_created: '12/12/2012', created_by: 'User 2', phone_number: '254742654637', },
		{ id: 2, name: 'Brian Muciri', status: 'active', email: "bwwaweru18@gmail.com",  date_created: '12/12/2012', created_by: 'User 2',  phone_number: '254742654637', },
		{ id: 3, name: 'Brian Muciri', status: 'active', email: "bwwaweru18@gmail.com",  date_created: '12/12/2012',  created_by: 'User 2', phone_number: '254742654637', }, 
	]

let MaintenanceRequestsPage = ({
    isLoading,
    maintenanceRequests,
    match,
    error,
    fetchData,
    handleDelete,
    submitForm
}) => {
    let [maintenanceRequestItems, setMaintenanceRequestItems] = useState(rows)
    let [fromDateFilter, setFromDateFilter] = useState('')
    let [toDateFilter, setToDateFilter] = useState('')
    let [userFilter, setUserFilter] = useState('')
    let [statusFilter, setStatusFilter] = useState('')
    const [selected, setSelected] = useState([]);
	
    const classes = commonStyles()

    useEffect(() => {
        if (!maintenanceRequests.length) {
            fetchData('maintenanceRequests');
        }
    }, [maintenanceRequests.length, fetchData])

    const exportMaintenanceRequestRecordsToExcel = () => {
		let items = maintenanceRequests.filter(({id}) => selected.includes(id)) 
        exportDataToXSL('MaintenanceRequests  Records', 'Contact Data', items, 'ContactData')
    }

    const handleSearchFormSubmit  = (event) => {
			event.preventDefault(); 
			//filter the maintenanceRequests here according to search criteria
	}

    const resetSearchForm  = (event) => {
			event.preventDefault(); 
			setMaintenanceRequestItems(maintenanceRequests);
			setUserFilter('');
			setStatusFilter('');
			setFromDateFilter('');
			setToDateFilter('');
}

return (
<Layout pageTitle="Maintenance Requests">
	<Grid container spacing={3} justify="space-evenly"
		alignItems="center">
		<Grid item xs={12} sm={12} md={12} lg={12}>
			<PageHeading text="Maintenance Requests" />
		</Grid>
		<Grid container spacing={2} item  alignItems="center"  direction="row" key={1}>
			<Grid item>
						<Button type="button" color="primary" variant="contained" size='medium'startIcon={<AddIcon />}  component={Link} to={`${match.url}/new`}> NEW
						</Button>
			</Grid> 
			<Grid item>
						<Button type="button" color="primary" variant="contained" size='medium'startIcon={<EditIcon />} disabled={ selected.length <= 0 } component={Link} to={`${match.url}${selected[0]}/edit`}> Edit 
						</Button>
			</Grid>
			<Grid item>
				<ExportToExcelBtn aria-label="Export to Excel" disabled={ selected.length <= 0 } onClick={event => { exportMaintenanceRequestRecordsToExcel() }}/>
			</Grid>
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<Box border={1} borderRadius="borderRadius" borderColor="grey.400">
			<form className={classes.form} id="maintenanceRequestSearchForm" onSubmit={ handleSearchFormSubmit}>
			<Grid container spacing={2} justify="center" direction="row">
				<Grid item lg={6} md={12} xs={12}>
					<TextField fullWidth  variant="outlined" type='date' id="from_date_filter" name="from_date_filter" label="From Date" value={fromDateFilter || ''} onChange={(event) => {setFromDateFilter(event.target.value)}} InputLabelProps={{shrink: true}} />
				</Grid >
				<Grid item lg={6} md={12} xs={12}>
				<TextField fullWidth variant="outlined" type='date' name="to_date_filter" label="To Date" id="to_date_filter"  onChange={(event) => {setToDateFilter(event.target.value)}} value={ toDateFilter || ''} InputLabelProps={{shrink: true}} />
				</Grid >
			</Grid> 
			<Grid container spacing={2}justify="center" direction="row">
				<Grid item lg={6} md={12} xs={12}>
							<TextField fullWidth select variant="outlined" id="user" name="user" label="Assigned To" value={userFilter || ''} onChange={(event) => {setUserFilter(event.target.value)}} >
								{
									USERS_LIST.map((user, index) => <MenuItem key={index} value={user}>{user}</MenuItem>)
								}

							</TextField> 
						</Grid >
						<Grid item lg={6} md={12} xs={12}>
						<TextField fullWidth select variant="outlined" name="status" label="Status" id="status"  onChange={(event) => {setStatusFilter(event.target.value)}} value={statusFilter || ''} >
			{
									STATUS_LIST.map((status, index) => <MenuItem key={index} value={status}>{status}</MenuItem>)
								}
						</TextField>
						</Grid >
					</Grid> 
				<Grid container spacing={2} item justify="flex-end" alignItems="center"  direction="row" key={1}>
					<Grid item>
								<Button type="submit" form="maintenanceRequestSearchForm" color="primary" variant="contained" size='medium'startIcon={<SearchIcon />} >SEARCH </Button>
					</Grid> 
					<Grid item>
								<Button onClick={event => { resetSearchForm(event) }} type="reset" form="propertySearchForm" color="primary" variant="contained" size='medium' startIcon={<UndoIcon />} >RESET </Button>
					</Grid>
				</Grid>
					</form>
				</Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
                    {
                        error && <div>
                            <CustomizedSnackbar variant="error" message={error.message} />
                        </div>
                    }
                    <CommonTable  selected={selected} setSelected={setSelected} rows={maintenanceRequestItems} headCells={maintenanceRequestsTableHeadCells} />
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
        maintenanceRequests: state.maintenanceRequests,
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
            dispatch(handleDelete(id, 'maintenanceRequests'));
        },
    }
}

MaintenanceRequestsPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MaintenanceRequestsPage)

export default withRouter(MaintenanceRequestsPage);

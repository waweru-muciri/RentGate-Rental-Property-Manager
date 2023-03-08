import Layout from "../components/myLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import exportDataToXSL from "../assets/printToExcel";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintMaintenanceRequest from "../assets/PrintMaintenanceRequest";

const STATUS_LIST = ["Open", "Closed"];

const maintenanceRequestsTableHeadCells = [
	{
		id: "date_created",
		numeric: false,
		disablePadding: true,
		label: "Date Created",
	},
	{
		id: "tenant_name",
		numeric: false,
		disablePadding: true,
		label: "Tenant Name",
	},
	{
		id: "property_ref",
		numeric: false,
		disablePadding: true,
		label: "Property Ref",
	},
	{
		id: "maintenance_details",
		numeric: false,
		disablePadding: true,
		label: "Request Details",
	},
	{ id: "status", numeric: false, disablePadding: true, label: "Status" },
];

let MaintenanceRequestsPage = ({
	isLoading,
	maintenanceRequests,
	users,
	contacts,
	properties,
	match,
	error,
}) => {
	let [maintenanceRequestItems, setMaintenanceRequestItems] = useState([]);
	let [fromDateFilter, setFromDateFilter] = useState("");
	let [toDateFilter, setToDateFilter] = useState("");
	let [contactFilter, setContactFilter] = useState("");
	let [statusFilter, setStatusFilter] = useState("");
	const [selected, setSelected] = useState([]);

	const classes = commonStyles();

	const getMappedMaintenanceRequests = () => {
		const mappedMaintenanceRequests = maintenanceRequests.map(
			(maintenanceRequest) => {
				const contactWithRequest = contacts.find(
					(contact) => contact.id === maintenanceRequest.contact
				);
				const maintenanceRequestDetails = {}
				if (typeof contactWithRequest !== 'undefined') {
					maintenanceRequestDetails.tenant_id_number = contactWithRequest.id_number
					maintenanceRequestDetails.tenant_name = contactWithRequest.first_name + " " + contactWithRequest.last_name
					const property = properties.find(
						({ tenants }) => tenants.length ? tenants[0] === contactWithRequest.id : false
					);
					if (typeof property !== "undefined") {
						maintenanceRequestDetails.property_ref = property.ref;
						maintenanceRequestDetails.property_address = property.address;
						maintenanceRequestDetails.property = property.id;
					}
					const landlord = users.find(
						(user) => user.id === contactWithRequest.assigned_to
					);
					if (typeof landlord !== "undefined") {
						maintenanceRequestDetails.landlord_name = landlord.first_name + " " + landlord.last_name
						maintenanceRequestDetails.landlord_email = landlord.email
						maintenanceRequestDetails.landlord_phone_number = landlord.phone_number
					}
				}
				return Object.assign(
					{},
					maintenanceRequest, maintenanceRequestDetails
				);
			}
		);
		return mappedMaintenanceRequests;
	};

	useEffect(() => {
		setMaintenanceRequestItems(getMappedMaintenanceRequests());
	}, [maintenanceRequests, contacts]);

	const exportMaintenanceRequestRecordsToExcel = () => {
		let items = maintenanceRequests.filter(({ id }) =>
			selected.includes(id)
		);
		exportDataToXSL(
			"MaintenanceRequests  Records",
			"Contact Data",
			items,
			"ContactData"
		);
	};

	const handleSearchFormSubmit = (event) => {
		event.preventDefault();
		//filter the maintenanceRequests here according to search criteria
		let filteredMaintenanceRequests = getMappedMaintenanceRequests()
			.filter(({ date_created }) =>
				!fromDateFilter ? true : date_created >= fromDateFilter
			)
			.filter(({ date_created }) =>
				!toDateFilter ? true : date_created === toDateFilter
			)
			.filter(({ contact }) =>
				!contactFilter ? true : contact === contactFilter
			)
			.filter(({ status }) =>
				!statusFilter ? true : status === statusFilter
			);

		setMaintenanceRequestItems(filteredMaintenanceRequests);
	};

	const resetSearchForm = (event) => {
		event.preventDefault();
		setMaintenanceRequestItems(getMappedMaintenanceRequests());
		setContactFilter("");
		setStatusFilter("");
		setFromDateFilter("");
		setToDateFilter("");
	};

	return (
		<Layout pageTitle="Maintenance Requests">
			<Grid
				container
				spacing={3}
				justify="space-evenly"
				alignItems="center"
			>
				<Grid item xs={12} sm={12} md={12} lg={12}>
					<PageHeading text="Maintenance Requests" />
				</Grid>
				<Grid
					container
					spacing={2}
					item
					alignItems="center"
					direction="row"
					key={1}
				>
					<Grid item>
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							startIcon={<AddIcon />}
							component={Link}
							to={`${match.url}/new`}
						>

							NEW
						</Button>
					</Grid>
					<Grid item>
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							startIcon={<EditIcon />}
							disabled={selected.length <= 0}
							component={Link}
							to={`${match.url}/${selected[0]}/edit`}
						>

							Edit
						</Button>
					</Grid>
					<Grid item>
						<ExportToExcelBtn
							aria-label="Export to Excel"
							disabled={selected.length <= 0}
							onClick={(event) => {
								exportMaintenanceRequestRecordsToExcel();
							}}
						/>
					</Grid>
					<Grid item>
						<PrintMaintenanceRequest
							disabled={selected.length <= 0}
							maintenanceRequestToPrint={maintenanceRequestItems.find(({ id }) => id === selected[0])}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={12}>
					<Box
						border={1}
						borderRadius="borderRadius"
						borderColor="grey.400"
					>
						<form
							className={classes.form}
							id="maintenanceRequestSearchForm"
							onSubmit={handleSearchFormSubmit}
						>
							<Grid
								container
								spacing={2}
								justify="center"
								direction="row"
							>
								<Grid item lg={6} md={12} xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										type="date"
										id="from_date_filter"
										name="from_date_filter"
										label="From Date"
										value={fromDateFilter}
										onChange={(event) => {
											setFromDateFilter(
												event.target.value
											);
										}}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
								<Grid item lg={6} md={12} xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										type="date"
										name="to_date_filter"
										label="To Date"
										id="to_date_filter"
										onChange={(event) => {
											setToDateFilter(event.target.value);
										}}
										value={toDateFilter}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
							</Grid>
							<Grid
								container
								spacing={2}
								justify="center"
								direction="row"
							>
								<Grid item lg={6} md={12} xs={12}>
									<TextField
										fullWidth
										select
										variant="outlined"
										id="contact"
										name="contact"
										label="Contact"
										value={contactFilter}
										onChange={(event) => {
											setContactFilter(
												event.target.value
											);
										}}
									>
										{contacts.map((contact, index) => (
											<MenuItem
												key={index}
												value={contact.id}
											>
												{contact.first_name +
													" " +
													contact.last_name}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item lg={6} md={12} xs={12}>
									<TextField
										fullWidth
										select
										variant="outlined"
										name="status"
										label="Status"
										id="status"
										onChange={(event) => {
											setStatusFilter(event.target.value);
										}}
										value={statusFilter}
									>
										{STATUS_LIST.map((status, index) => (
											<MenuItem
												key={index}
												value={status}
											>
												{status}
											</MenuItem>
										))}
									</TextField>
								</Grid>
							</Grid>
							<Grid
								container
								spacing={2}
								item
								justify="flex-end"
								alignItems="center"
								direction="row"
								key={1}
							>
								<Grid item>
									<Button
										type="submit"
										form="maintenanceRequestSearchForm"
										color="primary"
										variant="contained"
										size="medium"
										startIcon={<SearchIcon />}
									>
										SEARCH
									</Button>
								</Grid>
								<Grid item>
									<Button
										onClick={(event) => {
											resetSearchForm(event);
										}}
										type="reset"
										form="propertySearchForm"
										color="primary"
										variant="contained"
										size="medium"
										startIcon={<UndoIcon />}
									>
										RESET
									</Button>
								</Grid>
							</Grid>
						</form>
					</Box>
				</Grid>
				<Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
					{error && (
						<div>
							<CustomizedSnackbar
								variant="error"
								message={error.message}
							/>
						</div>
					)}
					<CommonTable
						selected={selected}
						setSelected={setSelected}
						rows={maintenanceRequestItems}
						headCells={maintenanceRequestsTableHeadCells}
						handleDelete={handleDelete}
						deleteUrl={"maintenance-requests"}
					/>
				</Grid>
				{isLoading && <LoadingBackdrop open={isLoading} />}
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		maintenanceRequests: state.maintenanceRequests,
		properties: state.properties,
		users: state.users,
		contacts: state.contacts,
		isLoading: state.isLoading,
		error: state.error,
		match: ownProps.match,
	};
};

MaintenanceRequestsPage = connect(
	mapStateToProps,
)(MaintenanceRequestsPage);

export default withRouter(MaintenanceRequestsPage);

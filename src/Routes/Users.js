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
import { itemsFetchData, handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import LoadingBackdrop from "../components/loadingBackdrop";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";

const STATUS_LIST = ["Active", "Inactive"];
const ROLES_LIST = [];

const usersTableHeadCells = [
	{ id: "email", numeric: false, disablePadding: true, label: "Email" },
	{
		id: "first_name",
		numeric: false,
		disablePadding: true,
		label: "First Name",
	},
	{
		id: "last_name",
		numeric: false,
		disablePadding: true,
		label: "Last Name",
	},
	{ id: "status", numeric: false, disablePadding: true, label: "Status" },
	{
		id: "phone_number",
		numeric: false,
		disablePadding: true,
		label: "Phone Number",
	},
	{
		id: "date_created",
		numeric: false,
		disablePadding: true,
		label: "Date Created",
	},
];

const rows = [
	{
		id: 1,
		first_name: "Brian",
		last_name: "Muciri",
		status: "active",
		email: "bwwaweru18@gmail.com",
		date_created: "12/12/2012",
		phone_number: "254742654637",
	},
	{
		id: 2,
		first_name: "Brian",
		last_name: "Muciri",
		status: "active",
		email: "bwwaweru18@gmail.com",
		date_created: "12/12/2012",
		phone_number: "254742654637",
	},
	{
		id: 3,
		first_name: "Brian",
		last_name: "Muciri",
		status: "active",
		email: "bwwaweru18@gmail.com",
		date_created: "12/12/2012",
		phone_number: "254742654637",
	},
];

let UsersPage = ({
	isLoading,
	users,
	match,
	error,
	handleDelete,
}) => {
	let [userItems, setUserItems] = useState(rows);
	let [firstNameFilter, setFirstNameFilter] = useState("");
	let [lastNameFilter, setLastNameFilter] = useState("");
	let [roleFilter, setRoleFilter] = useState("");
	let [statusFilter, setStatusFilter] = useState("");
	const [selected, setSelected] = useState([]);

	const classes = commonStyles();

	const exportUserRecordsToExcel = () => {
		let items = users.filter(({ id }) => selected.includes(id));
		exportDataToXSL("Users  Records", "Contact Data", items, "ContactData");
	};

	const handleSearchFormSubmit = (event) => {
		event.preventDefault();
		//filter the users here according to search criteria
	};

	const resetSearchForm = (event) => {
		event.preventDefault();
		setUserItems(users);
		setFirstNameFilter("");
		setLastNameFilter("");
		setRoleFilter("");
		setStatusFilter("");
	};

	return (
		<Layout pageTitle="Users">
			<Grid
				container
				spacing={3}
				justify="space-evenly"
				alignItems="center"
			>
				<Grid item xs={12} sm={12} md={12} lg={12}>
					<PageHeading text="Users" />
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
							{" "}
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
							to={`${match.url}${selected[0]}/edit`}
						>
							{" "}
							Edit User
						</Button>
					</Grid>
					<Grid item>
						<ExportToExcelBtn
							aria-label="Export to Excel"
							disabled={selected.length <= 0}
							onClick={(event) => {
								exportUserRecordsToExcel();
							}}
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
							id="userSearchForm"
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
										id="first_name"
										name="first_name"
										label="First Name"
										value={firstNameFilter || ""}
										onChange={(event) => {
											setFirstNameFilter(
												event.target.value
											);
										}}
									/>
								</Grid>
								<Grid item lg={6} md={12} xs={12}>
									<TextField
										fullWidth
										variant="outlined"
										name="last_name"
										label="Last Name"
										id="last_name"
										onChange={(event) => {
											setLastNameFilter(
												event.target.value
											);
										}}
										value={lastNameFilter || ""}
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
										id="email"
										name="email"
										label="Role"
										value={roleFilter || ""}
										onChange={(event) => {
											setRoleFilter(event.target.value);
										}}
									>
										{ROLES_LIST.map((role, index) => (
											<MenuItem key={index} value={role}>
												{role}
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
										value={statusFilter || ""}
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
										form="userSearchForm"
										color="primary"
										variant="contained"
										size="medium"
										startIcon={<SearchIcon />}
									>
										SEARCH{" "}
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
										RESET{" "}
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
						rows={userItems}
						headCells={usersTableHeadCells}
					/>
				</Grid>
				{isLoading && <LoadingBackdrop open={isLoading} />}
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		users: state.users,
		isLoading: state.isLoading,
		error: state.error,
		match: ownProps.match,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleDelete: (id) => {
			dispatch(handleDelete(id, "users"));
		},
	};
};

UsersPage = connect(mapStateToProps, mapDispatchToProps)(UsersPage);

export default withRouter(UsersPage);

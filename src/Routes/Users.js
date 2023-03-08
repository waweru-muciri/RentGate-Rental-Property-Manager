import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import BlockIcon from '@material-ui/icons/Block';
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import CustomizedSnackbar from "../components/CustomSnackbar";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";

import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";

const STATUS_LIST = [{ disabled: false, displayName: "Active" }, { disabled: true, displayName: "Inactive" }];
const ROLES_LIST = [];

const usersTableHeadCells = [
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
	{
		id: "phone_number",
		numeric: false,
		disablePadding: true,
		label: "Phone Number",
	},
	{ id: "primary_email", numeric: false, disablePadding: true, label: "Primary Email" },
	{
		id: "id_number",
		numeric: false,
		disablePadding: true,
		label: "ID Number",
	},
	{ id: "disabled", numeric: false, disablePadding: true, label: "Status" },
	{ id: "edit", numeric: false, disablePadding: true, label: "Edit" },
	{ id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let UsersPage = ({
	isLoading,
	users,
	match,
	error,
	handleItemDelete,
	currentUser,
}) => {
	let [userItems, setUserItems] = useState([]);
	let [firstNameFilter, setFirstNameFilter] = useState("");
	let [lastNameFilter, setLastNameFilter] = useState("");
	let [roleFilter, setRoleFilter] = useState("");
	let [statusFilter, setStatusFilter] = useState("");
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		setUserItems(users)
	}, [users])

	const classes = commonStyles();

	const handleSearchFormSubmit = (event) => {
		event.preventDefault();
		//filter the users here according to search criteria
		let filteredUsers = userItems
			.filter(({ first_name }) =>
				!firstNameFilter ? true : first_name.toLowerCase().includes(firstNameFilter.toLowerCase())
			)
			.filter(({ last_name }) =>
				!lastNameFilter ? true : last_name.toLowerCase().includes(lastNameFilter.toLowerCase())
			)
			.filter((user) =>
				!statusFilter ? true : user.disabled === statusFilter
			)

		setUserItems(filteredUsers);
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
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							startIcon={<BlockIcon />}
							disabled={selected.length <= 0}
						>
							{selected.length <= 0 ? "Disable" : selected.length[0].disabled ? "Enable" : "Disable"}
						</Button>
					</Grid>
					<Grid item>
						<ExportToExcelBtn
							disabled={selected.length <= 0}
							reportName={'Users Records'}
							reportTitle={'Users Data'}
							headCells={usersTableHeadCells}
							dataToPrint={userItems.filter(({ id }) => selected.includes(id))}
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
												event.target.value.trim()
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
												event.target.value.trim()
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
										{STATUS_LIST.map((statusObject, index) => (
											<MenuItem
												key={index}
												value={statusObject.disabled}
											>
												{statusObject.displayName}
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
						deleteUrl={'users'}
						rows={userItems}
						headCells={usersTableHeadCells}
						tenantId={currentUser.tenant}
						handleDelete={handleItemDelete}
					/>
				</Grid>
				
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		currentUser: state.currentUser,
		users: state.users,
		isLoading: state.isLoading,
		error: state.error,
		match: ownProps.match,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (tenantId, itemId, url) => dispatch(handleDelete(tenantId, itemId, url)),
	};
};

UsersPage = connect(mapStateToProps, mapDispatchToProps)(UsersPage);

export default withRouter(UsersPage);

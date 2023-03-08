import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import BlockIcon from "@material-ui/icons/Block";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { handleDelete, updateFirebaseUser } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";

const usersTableHeadCells = [
	{ id: "first_name", numeric: false, disablePadding: true, label: "First Name" },
	{ id: "last_name", numeric: false, disablePadding: true, label: "Last Name" },
	{ id: "phone_number", numeric: false, disablePadding: true, label: "Phone Number" },
	{ id: "primary_email", numeric: false, disablePadding: true, label: "Primary Email" },
	{ id: "id_number", numeric: false, disablePadding: true, label: "ID Number" },
	{ id: "details", numeric: false, disablePadding: true, label: "Details" },
	{ id: "edit", numeric: false, disablePadding: true, label: "Edit" },
	{ id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let UsersPage = ({
	users,
	match,
	handleItemDelete,
}) => {
	let [userItems, setUserItems] = useState([]);
	let [firstNameFilter, setFirstNameFilter] = useState("");
	let [lastNameFilter, setLastNameFilter] = useState("");
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

		setUserItems(filteredUsers);
	};

	const resetSearchForm = (event) => {
		event.preventDefault();
		setUserItems(users);
		setFirstNameFilter("");
		setLastNameFilter("");
	};

	return (
		<Layout pageTitle="Users">
			<Grid
				container
				spacing={3}
				justify="space-evenly"
				alignItems="center"
			>
				<Grid item xs={12}>
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
							onClick={async () => {
								try {
									await updateFirebaseUser({
										uid: selected[0],
										userProfile: {
											disabled: true
										}
									})
								} catch (error) {
									console.log("Error during disabling user => ", error)
								}
							}}
						>
							Disable
						</Button>
					</Grid>
					<Grid item>
						<Button
							type="button"
							color="primary"
							variant="contained"
							size="medium"
							component={Link}
							to={`/app/emails/new?contact=${selected[0]}&contactSource=Users`}
							disabled={selected.length <= 0}
						>
							Compose Email
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
				<Grid item xs={12}>
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
				<Grid item xs={12}>
					<CommonTable
						selected={selected}
						setSelected={setSelected}
						deleteUrl={'users'}
						rows={userItems}
						noDetailsCol={true}
						headCells={usersTableHeadCells}
						handleDelete={handleItemDelete}
					/>
				</Grid>

			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
	};
};

UsersPage = connect(mapStateToProps, mapDispatchToProps)(UsersPage);

export default withRouter(UsersPage);

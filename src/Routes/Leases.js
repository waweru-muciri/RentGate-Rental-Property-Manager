import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import BlockIcon from "@material-ui/icons/Block";
import AddIcon from "@material-ui/icons/Add";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const headCells = [
    { id: "property_ref", numeric: false, disablePadding: true, label: "Property", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit", },
    { id: "lease_type", numeric: false, disablePadding: true, label: "Lease Type", },
    { id: "rent_cycle", numeric: false, disablePadding: true, label: "Rent Cycle", },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "start_date", numeric: false, disablePadding: true, label: "Lease Start", },
    { id: "end_date", numeric: false, disablePadding: true, label: "Lease End", },
    { id: "security_deposit", numeric: false, disablePadding: true, label: "Deposit Held", },
    { id: "rent_amount", numeric: false, disablePadding: true, label: "Rent", },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let TransactionPage = ({
    leases,
    properties,
    match,
    users,
    handleItemDelete,
    error,
}) => {
    const classes = commonStyles();
    let [leaseItems, setLeaseItems] = useState([]);
    let [filteredLeaseItems, setFilteredLeaseItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState('');
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setLeaseItems(leases);
        setFilteredLeaseItems(leases);
    }, [leases]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the leases according to the search criteria here
        let filteredLeases = leaseItems
            .filter(({ start_date }) =>
                !fromDateFilter ? true : start_date >= fromDateFilter
            )
            .filter(({ end_date }) =>
                !toDateFilter ? true : !end_date ? false : end_date <= toDateFilter
            )
            .filter(({ property_id }) =>
                !propertyFilter ? true : property_id === propertyFilter
            )
            .filter(({ landlord }) =>
                !assignedToFilter ? true : landlord === assignedToFilter
            );
        setFilteredLeaseItems(filteredLeases);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredLeaseItems(leaseItems);
        setPropertyFilter("");
        setAssignedToFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Layout pageTitle="Rental Agreements">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Rental Agreements'} />
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
                            End Agreement
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={selected.length <= 0}
                            reportName={'Rental Agreements Records'}
                            reportTitle={'Rental Agreements Data'}
                            headCells={headCells}
                            dataToPrint={leaseItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Rental Agreements Records'}
                            reportTitle={'Rental Agreements Data'}
                            headCells={headCells}
                            dataToPrint={leaseItems.filter(({ id }) => selected.includes(id))}
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
                            id="contactSearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="row"
                            >
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="assigned_to"
                                        name="assigned_to"
                                        label="Assigned To"
                                        value={assignedToFilter}
                                        onChange={(event) => {
                                            setAssignedToFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {users.map((user, index) => (
                                            <MenuItem
                                                key={index}
                                                value={user.id}
                                            >
                                                {user.first_name} {user.last_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="property_filter"
                                        label="Select Property"
                                        id="property_filter"
                                        onChange={(event) => {
                                            setPropertyFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={propertyFilter}
                                    >
                                        {properties.map((property, index) => (
                                            <MenuItem
                                                key={index}
                                                value={property.id}
                                            >
                                                {property.ref}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="row"
                            >
                                <Grid item xs={12} md={6}>
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
                                <Grid item xs={12} md={6}>
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
                                item
                                justify="flex-end"
                                alignItems="center"
                                direction="row"
                                key={1}
                            >
                                <Grid item>
                                    <Button
                                        onClick={(event) => handleSearchFormSubmit(event)}
                                        type="submit"
                                        form="contactSearchForm"
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
                                        onClick={(event) => resetSearchForm(event)}
                                        type="reset"
                                        form="contactSearchForm"
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
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredLeaseItems}
                        headCells={headCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"leases"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        leases: state.leases.sort((lease1, lease2) => lease2.start_date > lease1.start_date)
            .map((lease) => {
                const tenant = state.contacts.find((contact) => contact.id === lease.tenants[0]) || {};
                const property = state.properties.find(({ id }) => id === lease.property_id) || {};
                return Object.assign({}, lease,
                    {
                        tenant_name: tenant.first_name + " " + tenant.last_name,
                        tenant_id_number: tenant.id_number,
                        property_ref: property.ref,
                    });
            }),
        users: state.users,
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

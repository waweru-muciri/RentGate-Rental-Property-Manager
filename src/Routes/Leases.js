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
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import { parse } from "date-fns";

const headCells = [
    { id: "property_ref", numeric: false, disablePadding: true, label: "Property", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit", },
    { id: "lease_type", numeric: false, disablePadding: true, label: "Agreement Type", },
    { id: "rent_cycle", numeric: false, disablePadding: true, label: "Rent Cycle", },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "start_date", numeric: false, disablePadding: true, label: "Start Date", },
    { id: "end_date", numeric: false, disablePadding: true, label: "End Date", },
    { id: "security_deposit", numeric: false, disablePadding: true, label: "Deposit Held", },
    { id: "rent_amount", numeric: false, disablePadding: true, label: "Rent", },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

const LEASE_TERMINATED_STATUS_TYPES = [{ id: false, name: "Active" }, { id: true, name: "In-Active" }]

let TransactionPage = ({
    leases,
    properties,
    match,
    handleItemDelete,
}) => {
    const classes = commonStyles();
    let [leaseItems, setLeaseItems] = useState([]);
    let [filteredLeaseItems, setFilteredLeaseItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("all");
    let [activeStatusFilter, setActiveStatusFilter] = useState('');
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
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
            .filter(({ terminated }) =>
                activeStatusFilter === '' ? true : typeof terminated === 'undefined' ? true : terminated === activeStatusFilter
            );
        setFilteredLeaseItems(filteredLeases);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredLeaseItems(leaseItems);
        setPropertyFilter("all");
        setActiveStatusFilter('');
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
                    <PageHeading text={'Rental Agreements'} />
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
                            component={Link}
                            to={`/app/notices/new?lease=${selected[0]}`}
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
                <Grid item xs={12}>
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
                                        id="lease_status"
                                        name="lease_status"
                                        label="Agreement Status"
                                        value={activeStatusFilter}
                                        onChange={(event) => {
                                            setActiveStatusFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {LEASE_TERMINATED_STATUS_TYPES.map((leaseStatus, index) => (
                                            <MenuItem
                                                key={index}
                                                value={leaseStatus.id}
                                            >
                                                {leaseStatus.name}
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
                                        <MenuItem key={"all"} value={"all"}>All Properties</MenuItem>
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
                <Grid item xs={12}>
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
        leases: state.leases
            .map((lease) => {
                const tenant = state.contacts.find((contact) => contact.id === lease.tenants[0]) || {};
                const property = state.properties.find(({ id }) => id === lease.property_id) || {};
                return Object.assign({}, lease,
                    {
                        tenant_name: tenant.first_name + " " + tenant.last_name,
                        tenant_id_number: tenant.id_number,
                        property_ref: property.ref,
                    });
            })
            .sort((lease1, lease2) => parse(lease2.start_date, 'yyyy-MM-dd', new Date()) -
                parse(lease1.start_date, 'yyyy-MM-dd', new Date())),
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

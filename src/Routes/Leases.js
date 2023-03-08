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
import { handleDelete, handleItemFormSubmit } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import RentAdjustModal from "./RentAdjustModal";
import AddChargeForm from "../components/charges/AddChargeForm";
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
    { id: "security_deposit", numeric: true, disablePadding: true, label: "Deposit Held", },
    { id: "rent_amount", numeric: true, disablePadding: true, label: "Rent", },
    { id: "rent_due_date", numeric: false, disablePadding: true, label: "Rent Due Date", },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let TransactionPage = ({
    leases,
    properties,
    match,
    history,
    handleItemSubmit,
    handleItemDelete,
}) => {
    const classes = commonStyles();
    const [leaseItems, setLeaseItems] = useState([]);
    const [filteredLeaseItems, setFilteredLeaseItems] = useState([]);
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [activeStatusFilter, setActiveStatusFilter] = useState("all");
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [adjustRentModalState, setAdjustRentModalState] = useState(false);
    const [addChargeModalState, setAddChargeModalState] = useState(false);

    const filterLeasesByCriteria = (leasesToFilter) => {
        //filter the leases according to the search criteria here
        const filteredLeases = leasesToFilter
            .filter(({ start_date, end_date, property_id, terminated }) =>
                (!fromDateFilter ? true : start_date >= fromDateFilter)
                && (!toDateFilter ? true : !end_date ? false : end_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (activeStatusFilter === "all" ? true : typeof terminated === 'undefined' ? true : terminated === activeStatusFilter)
            )
        return filteredLeases;
    }

    useEffect(() => {
        setLeaseItems(leases);
        setFilteredLeaseItems(filterLeasesByCriteria(leases));
    }, [leases]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        setFilteredLeaseItems(filterLeasesByCriteria(leases));
    };

    const handleModalStateToggle = () => {
        setAdjustRentModalState(!adjustRentModalState)
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("all");
        setActiveStatusFilter("all");
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
                            disabled={selected.length !== 1}
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
                            disabled={selected.length !== 1}
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setAddChargeModalState(!addChargeModalState)
                            }}
                        >
                            Add Charge
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            disabled={!selected.length}
                            onClick={handleModalStateToggle}
                        >
                            Adjust Rent Amount
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<BlockIcon />}
                            disabled={selected.length !== 1}
                            component={Link}
                            to={`/app/notices/new?lease=${selected[0]}`}
                        >
                            End Agreement
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Rental Agreements Records'}
                            reportTitle={'Rental Agreements Data'}
                            headCells={headCells}
                            dataToPrint={leaseItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
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
                                        <MenuItem key="all" value={"all"}>All</MenuItem>
                                        <MenuItem key="active" value={false}>Active</MenuItem>
                                        <MenuItem key="in-active" value={true}>In-Active</MenuItem>
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
                                        <MenuItem key={"all"} value={"all"}>All</MenuItem>
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
                {
                    adjustRentModalState ?
                        <RentAdjustModal open={adjustRentModalState}
                            leasesToAdjustRentAmounts={leaseItems.filter(({ id }) => selected.includes(id))}
                            handleClose={handleModalStateToggle} history={history}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                {
                    addChargeModalState ?
                        <AddChargeForm open={addChargeModalState}
                            leaseToAddCharge={leaseItems.find(({ id }) => id === selected[0])}
                            handleClose={() => {
                                setAddChargeModalState(!addChargeModalState);
                            }}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
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
                const unitWithLease = state.propertyUnits.find(({ id }) => id === lease.unit_id) || {};
                return Object.assign({}, lease,
                    {
                        tenant_name: tenant.first_name + " " + tenant.last_name,
                        tenant_id_number: tenant.id_number,
                        property_ref: property.ref,
                        unit_ref: unitWithLease.ref,
                    });
            })
            .sort((lease1, lease2) => parse(lease2.start_date, 'yyyy-MM-dd', new Date()) -
                parse(lease1.start_date, 'yyyy-MM-dd', new Date())),
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TransactionPage = connect(mapStateToProps, mapDispatchToProps)(TransactionPage);

export default withRouter(TransactionPage);

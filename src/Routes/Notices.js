import Layout from "../components/PrivateLayout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import { startOfToday, parse, differenceInDays } from "date-fns";


const noticesTableHeadCells = [
    { id: "days_left", numeric: false, disablePadding: true, label: "Days Left" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID Number" },
    { id: "notification_date", numeric: false, disablePadding: true, label: "Notification Date" },
    { id: "vacating_date", numeric: false, disablePadding: true, label: "Move Out Date" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let VacatingNoticesPage = ({
    notices,
    properties,
    contacts,
    handleItemDelete,
    match,
}) => {
    const classes = commonStyles();
    let [filteredNoticeItems, setFilteredNoticeItems] = useState(notices);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [propertyFilter, setPropertyFilter] = useState('');
    let [tenantFilter, setTenantFilter] = useState("");
    const [selected, setSelected] = useState([]);


    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the notices here according to search criteria
        let filteredNotices = notices
            .filter(({ notification_date }) =>
                !fromDateFilter ? true : notification_date >= fromDateFilter
            )
            .filter(({ notification_date }) =>
                !toDateFilter ? true : notification_date <= toDateFilter
            )
            .filter(({ tenant }) =>
                !tenantFilter ? true : tenant === tenantFilter
            )
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)

        setFilteredNoticeItems(filteredNotices);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredNoticeItems(notices);
        setFromDateFilter("");
        setToDateFilter("");
        setPropertyFilter("all");
        setTenantFilter("");
    };

    return (
        <Layout pageTitle="Move Outs">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading text={'Move Outs'} />
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
                            disabled={selected.length <= 0}
                            reportName={'Notices Records'}
                            reportTitle={'Notices Data'}
                            headCells={noticesTableHeadCells}
                            dataToPrint={notices.filter(({ id }) => selected.includes(id))}
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
                                        id="propertyFilter"
                                        name="propertyFilter"
                                        label="Property"
                                        value={propertyFilter}
                                        onChange={(event) => {
                                            setPropertyFilter(
                                                event.target.value
                                            );
                                        }}
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
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="tenant"
                                        name="tenant"
                                        label="Tenant"
                                        value={tenantFilter}
                                        onChange={(event) => {
                                            setTenantFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {contacts.map((tenant, index) => (
                                            <MenuItem
                                                key={index}
                                                value={tenant.id}
                                            >
                                                {tenant.first_name} {tenant.last_name}
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
                                        onClick={(event) =>
                                            resetSearchForm(event)
                                        }
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
                        rows={filteredNoticeItems}
                        headCells={noticesTableHeadCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"notices"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        notices: state.notices.map((notice) => {
            const noticeLease = state.leases.find(({ id }) => id === notice.lease_id) || {}
            const tenant = state.contacts.find(({ id }) => id === noticeLease.tenants ? noticeLease.tenants[0] : false) || {};
            const noticeDetails = {};
            noticeDetails.tenant_id_number = tenant.id_number
            noticeDetails.tenant_name = tenant.first_name + " " + tenant.last_name
            const days_left = differenceInDays(parse(notice.vacating_date, 'yyyy-MM-dd', new Date()), startOfToday())
            noticeDetails.days_left = days_left >= 0 ? days_left : 0
            return Object.assign({}, notice, noticeDetails);
        }),
        properties: state.properties,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

VacatingNoticesPage = connect(mapStateToProps, mapDispatchToProps)(VacatingNoticesPage);

export default withRouter(VacatingNoticesPage);

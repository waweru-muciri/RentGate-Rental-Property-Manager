import Layout from "../components/PrivateLayout";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { handleDelete, itemsFetchData } from "../actions/actions";
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
    { id: "vacated", numeric: false, disablePadding: true, label: "Vacated Status" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let VacatingNoticesPage = ({
    fetchData,
    notices,
    properties,
    contacts,
    handleItemDelete,
    match,
}) => {
    const classes = commonStyles();
    const [vacatingNotices, setVacatingNotices] = useState([]);
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [tenantFilter, setTenantFilter] = useState(null);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
		fetchData(['notices']);
	}, [fetchData]);

    useEffect(() => {
        setVacatingNotices(notices);
    }, [notices]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the notices here according to search criteria
        const filteredNotices = notices
            .filter(({ notification_date, tenant_id, property_id }) =>
                (!fromDateFilter ? true : notification_date >= fromDateFilter)
                && (!toDateFilter ? true : notification_date <= toDateFilter)
                && (!tenantFilter ? true : tenant_id === tenantFilter.id)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
            )
        setVacatingNotices(filteredNotices);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setToDateFilter("");
        setPropertyFilter("all");
        setTenantFilter(null);
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
                            disabled={!selected.length}
                            component={Link}
                            to={`${match.url}/${selected[0]}/edit`}
                        >
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
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
                                <Grid item md={6} xs={12}>
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
                                <Grid item md={6} xs={12}>
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
                                <Grid item md={6} xs={12}>
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
                                <Grid item md={6} xs={12}>
                                    <Autocomplete
                                        id="contact_filter"
                                        options={contacts}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        name="contact_filter"
                                        onChange={(event, newValue) => {
                                            setTenantFilter(newValue);
                                        }}
                                        value={tenantFilter}
                                        getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                        style={{ width: "100%" }}
                                        renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
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
                        rows={vacatingNotices}
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
            const tenant = state.contacts.find(({ id }) => id === notice.tenant_id) || {};
            const tenantUnit = state.propertyUnits.find(({ id }) => id === notice.unit_id) || {};
            const noticeDetails = {};
            noticeDetails.tenant_id_number = tenant.id_number
            noticeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
            const days_left = differenceInDays(parse(notice.vacating_date, 'yyyy-MM-dd', new Date()), startOfToday())
            noticeDetails.days_left = days_left >= 0 ? days_left : 0
            noticeDetails.unit_ref = tenantUnit.ref
            return Object.assign({}, notice, noticeDetails);
        }).sort((notice1, notice2) => parse(notice2.notification_date, 'yyyy-MM-dd', new Date()) -
            parse(notice1.notification_date, 'yyyy-MM-dd', new Date())),
        properties: state.properties,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (collectionsUrls) => dispatch(itemsFetchData(collectionsUrls)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

VacatingNoticesPage = connect(mapStateToProps, mapDispatchToProps)(VacatingNoticesPage);

export default withRouter(VacatingNoticesPage);

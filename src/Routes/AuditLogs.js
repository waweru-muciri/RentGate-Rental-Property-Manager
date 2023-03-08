import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import CustomizedSnackbar from "../components/CustomSnackbar";
import { connect } from "react-redux";
import { itemsFetchData, handleDelete } from "../actions/actions";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";

import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";

const ENTITIES_LIST = [];
const USERS_LIST = [];

const auditLogsTableHeadCells = [
    { id: "log_date", numeric: false, disablePadding: true, label: "Date" },
    { id: "user", numeric: false, disablePadding: true, label: "User" },
    {
        id: "user_email",
        numeric: false,
        disablePadding: true,
        label: "User Email",
    },
    { id: "entity", numeric: false, disablePadding: true, label: "Entity" },
    { id: "action", numeric: false, disablePadding: true, label: "Action" },
    {
        id: "entity_id",
        numeric: false,
        disablePadding: true,
        label: "Entity Id",
    },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

const rows = [
    {
        id: 1,
        user_email: "user@yourdomain.com",
        action: "create",
        entity: "property",
        user: "user001",
        log_date: "12/12/2012",
        entity_id: "5ee61c19ed13fc00027af18b",
    },
    {
        id: 2,
        user_email: "user@yourdomain.com",
        action: "create",
        entity: "property",
        user: "user002",
        log_date: "12/12/2012",
        entity_id: "5ee61c19ed13fc00027af18b",
    },
    {
        id: 3,
        user_email: "user@yourdomain.com",
        action: "create",
        entity: "property",
        user: "user003",
        log_date: "12/12/2012",
        entity_id: "5ee61c19ed13fc00027af18b",
    },
];

let AuditLogsPage = ({
    isLoading,
    contacts,
    match,
    error,
    handleDelete,
    submitForm,
}) => {
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [auditLogItems, setContactItems] = useState(rows);
    let [firstNameFilter, setUserEmailFilter] = useState("");
    let [actionFilter, setActionFilter] = useState("");
    let [userFilter, setUserFilter] = useState("");
    let [entitiesIdsFilter, setEntitiesIdsFilter] = useState([]);

    const [selected, setSelected] = useState([]);

    const classes = commonStyles();

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the contacts here according to search criteria
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setContactItems(contacts);
        setUserEmailFilter("");
        setActionFilter("");
        setUserFilter("");
        setEntitiesIdsFilter([]);
    };

    return (
        <Layout pageTitle="Audit Logs">
            <Grid container spacing={3} justify="flex-start" alignItems="start">
                <Grid item xs={12}>
                    <PageHeading text="Audit Logs" />
                </Grid>
                <Grid item>
                    <ExportToExcelBtn
                        disabled={selected.length <= 0}
                        reportName={'Audit Log Records'}
                        reportTitle={'Audit Log Data'}
                        headCells={auditLogsTableHeadCells}
                        dataToPrint={auditLogItems.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box
                        border={1}
                        borderRadius="borderRadius"
                        borderColor="grey.400"
                    >
                        <form
                            className={classes.form}
                            id="logSearchForm"
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
                                        value={fromDateFilter || ""}
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
                                        value={toDateFilter || ""}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="user"
                                        name="user"
                                        label="User"
                                        value={userFilter}
                                        onChange={(event) => {
                                            setUserFilter(event.target.value);
                                        }}
                                    >
                                        {USERS_LIST.map((user, index) => (
                                            <MenuItem key={index} value={user}>
                                                {user}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="user_email"
                                        name="user_email"
                                        label="User Email"
                                        value={firstNameFilter || ""}
                                        onChange={(event) => {
                                            setUserEmailFilter(
                                                event.target.value
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="action"
                                        label="Action"
                                        id="action"
                                        onChange={(event) => {
                                            setActionFilter(event.target.value);
                                        }}
                                        value={actionFilter || ""}
                                    />
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="entities_ids"
                                        label="Entities"
                                        id="entities_ids"
                                        onChange={(event) => {
                                            setEntitiesIdsFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={entitiesIdsFilter}
                                    >
                                        {ENTITIES_LIST.map((entity, index) => (
                                            <MenuItem
                                                key={index}
                                                value={entity}
                                            >
                                                {entity}
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
                                        form="logSearchForm"
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
                                        form="logSearchForm"
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
                        rows={auditLogItems}
                        headCells={auditLogsTableHeadCells}
                    />
                </Grid>
                
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        contacts: state.contacts,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleDelete: (id) => {
            dispatch(handleDelete(id, "contacts"));
        },
    };
};

AuditLogsPage = connect(mapStateToProps, mapDispatchToProps)(AuditLogsPage);

export default withRouter(AuditLogsPage);

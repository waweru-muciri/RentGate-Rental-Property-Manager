import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import { withRouter } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { parse } from "date-fns";

const ENTITIES_LIST = ["users", "users", "properties", "property_units"];
const ACTIONS_LIST = ["Delete", "Create", "Edit"];

const auditLogsTableHeadCells = [
    { id: "log_date", numeric: false, disablePadding: true, label: "Date" },
    { id: "user_name", numeric: false, disablePadding: true, label: "User" },
    { id: "user_email", numeric: false, disablePadding: true, label: "User Email" },
    { id: "entity", numeric: false, disablePadding: true, label: "Entity" },
    { id: "entity_id", numeric: false, disablePadding: true, label: "Entity Id" },
    { id: "action", numeric: false, disablePadding: true, label: "Action" },
];


let AuditLogsPage = ({
    auditLogs,
    users,
}) => {
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [auditLogItems, setAuditLogItems] = useState([]);
    let [actionFilter, setActionFilter] = useState("");
    let [userFilter, setUserFilter] = useState("");
    let [entityFilter, setEntityFilter] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setAuditLogItems(auditLogs)
    }, [auditLogs])

    const classes = commonStyles();

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the logs here according to search criteria
        const filteredAuditLogs = auditLogs
            .filter(({ log_date }) => !fromDateFilter ? true : log_date >= fromDateFilter)
            .filter(({ log_date }) => !toDateFilter ? true : log_date <= toDateFilter)
            .filter(({ user_id }) => !userFilter ? true : user_id === userFilter)
            .filter(({ entity }) => !entityFilter ? true : entity === entityFilter)
            .filter(({ action }) => !actionFilter ? true : action === actionFilter)
        setAuditLogItems(filteredAuditLogs)

    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setToDateFilter("");
        setActionFilter("");
        setUserFilter("");
        setEntityFilter("");
        setAuditLogItems(auditLogs)
    };

    return (
        <Layout pageTitle="Audit Logs">
            <Grid container spacing={3}>
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
                                <Grid item xs={12} md={4}>
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
                                        {users.map((user, index) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.first_name} {user.last_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="outlined"
                                        name="action"
                                        label="Action"
                                        id="action"
                                        onChange={(event) => {
                                            setActionFilter(event.target.value);
                                        }}
                                        value={actionFilter}
                                    >
                                        {ACTIONS_LIST.map((action, index) => (
                                            <MenuItem key={index} value={action}>
                                                {action}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="entities_ids"
                                        label="Entities"
                                        id="entities_ids"
                                        onChange={(event) => {
                                            setEntityFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={entityFilter}
                                    >
                                        {ENTITIES_LIST.map((entity, index) => (
                                            <MenuItem key={index} value={entity}>
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

const mapStateToProps = (state) => {
    return {
        auditLogs: state.auditLogs.map((auditLog) => {
            const user = state.users.find((user) => user.id === auditLog.user_id) || {};
            return Object.assign({}, auditLog, { user_name: `${user.first_name} ${user.last_name}`, 
            user_email: user.primary_email });
        }).sort((auditLog1, auditLog2) => parse(auditLog2.log_date, 'yyyy-MM-dd', new Date()) -
            parse(auditLog1.log_date, 'yyyy-MM-dd', new Date())),
        users: state.users,
    };
};

AuditLogsPage = connect(mapStateToProps, null)(AuditLogsPage);

export default withRouter(AuditLogsPage);

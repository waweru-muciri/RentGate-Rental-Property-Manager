import Layout from "../components/myLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import exportDataToXSL from "../assets/printToExcel";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import CustomizedSnackbar from "../components/customizedSnackbar";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintTenantVacatingNotice from "../assets/PrintTenantVacatingNotice";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import moment from "moment";


const noticesTableHeadCells = [
    { id: "days_left", numeric: false, disablePadding: true, label: "Days Left" },
    {
        id: "landlord_name",
        numeric: false,
        disablePadding: true,
        label: "LandLord",
    },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    {
        id: "tenant_id_number",
        numeric: false,
        disablePadding: true,
        label: "Tenant ID Number",
    },
    {
        id: "notification_date",
        numeric: false,
        disablePadding: true,
        label: "Notification Date",
    },
    {
        id: "vacating_date",
        numeric: false,
        disablePadding: true,
        label: "Move Out Date",
    },
];

let VacatingNoticesPage = ({
    currentUser,
    notices,
    users,
    properties,
    contacts,
    handleItemDelete,
    match,
    error,
}) => {
    const classes = commonStyles();
    let [noticeItems, setNoticeItems] = useState([]);
    let [filteredNoticeItems, setFilteredNoticeItems] = useState([]);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [assignedToFilter, setAssignedToFilter] = useState(currentUser.id);
    let [contactFilter, setContactFilter] = useState("");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        const mappedNotices = notices.map((notice) => {
            const tenant = contacts.find(
                (contact) => contact.id === notice.tenant
            );
            const landlord = users.find(
                (user) => user.id === notice.landlord
            );
            const property = properties.find(
                (property) => property.id === notice.property
            );
            const noticeDetails = {};
            if (typeof tenant !== 'undefined') {
                noticeDetails.tenant_id_number = tenant.id_number
                noticeDetails.tenant_name = tenant.first_name + " " + tenant.last_name
                noticeDetails.tenant_phone_number = tenant.personal_mobile_number
                noticeDetails.tenant_email = tenant.contact_email
            }
            noticeDetails.days_left = moment(notice.vacating_date).diff(moment(), 'days') + ' Days'
            if (typeof landlord !== "undefined") {
                noticeDetails.landlord_name = landlord.first_name + " " + landlord.last_name
                noticeDetails.landlord_email = landlord.email
                noticeDetails.landlord_phone_number = landlord.phone_number
            }
            if (typeof property !== "undefined") {
                noticeDetails.property_ref = property.ref;
                noticeDetails.property_address = property.address;
                noticeDetails.property = property.id;
            }
            return Object.assign({}, notice, noticeDetails);
        });
        setNoticeItems(mappedNotices);
        setFilteredNoticeItems(mappedNotices);
    }, [notices, contacts, properties, users]);

    const exportVacatingNoticesToExcel = () => {
        let items = noticeItems.filter(({ id }) => selected.includes(id));
        exportDataToXSL(
            "Contacts  Records",
            "Contact Data",
            items,
            "ContactData"
        );
    };

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the notices here according to search criteria
        let filteredNotices = noticeItems
            .filter(({ notification_date }) =>
                !fromDateFilter ? true : notification_date >= fromDateFilter
            )
            .filter(({ notification_date }) =>
                !toDateFilter ? true : notification_date <= toDateFilter
            )
            .filter(({ tenant }) =>
                !contactFilter ? true : tenant === contactFilter
            )
            .filter(({ assigned_to }) =>
                !assignedToFilter ? true : assigned_to === assignedToFilter
            );

        setFilteredNoticeItems(filteredNotices);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredNoticeItems(noticeItems);
        setFromDateFilter("");
        setToDateFilter("");
        setAssignedToFilter("");
        setContactFilter("");
    };

    return (
        <Layout pageTitle="Move Outs">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading paddingLeft={2} text={'Move Outs'} />
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
                            aria-label="Export to Excel"
                            disabled={selected.length <= 0}
                            onClick={(event) => {
                                exportVacatingNoticesToExcel();
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <PrintTenantVacatingNotice
                            disabled={selected.length <= 0}
                            noticeToPrint={
                                noticeItems.find(({ id }) => id === selected[0])
                            }
                        >
                            pdf
                        </PrintTenantVacatingNotice>
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
                                                {user.first_name +
                                                    user.last_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={6} md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        id="contact"
                                        name="contact"
                                        label="Contact"
                                        value={contactFilter}
                                        onChange={(event) => {
                                            setContactFilter(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {contacts.map((contact, index) => (
                                            <MenuItem
                                                key={index}
                                                value={contact.id}
                                            >
                                                {contact.first_name + ' ' +
                                                    contact.last_name}
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
        notices: state.notices,
        users: state.users,
        contacts: state.contacts,
        properties: state.properties,
        error: state.error,
        currentUser: state.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (noticeId) => dispatch(handleDelete(noticeId, "notices")),
    };
};

VacatingNoticesPage = connect(mapStateToProps, mapDispatchToProps)(VacatingNoticesPage);

export default withRouter(VacatingNoticesPage);

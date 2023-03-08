import Layout from "../components/PrivateLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import { connect } from "react-redux";
import { handleDelete, itemsFetchData } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import { withRouter } from "react-router-dom";
import PageHeading from "../components/PageHeading";

const emailsTableHeadCells = [
    { id: "from_user", numeric: false, disablePadding: true, label: "From" },
    { id: "date_sent", numeric: false, disablePadding: true, label: "Date Sent" },
    { id: "email_subject", numeric: false, disablePadding: true, label: "Email Subject" },
];

let EmailsPage = ({
    fetchData,
    communicationEmails,
    match,
}) => {
    const classes = commonStyles();
    const [emailItems, setEmailItems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");

    useEffect(() => {
        fetchData(['communication_emails']);
    }, [fetchData]);
    
    
    useEffect(() => {
        setEmailItems(communicationEmails);
    }, [communicationEmails]);
    
    const filterEmailCommunicationsByCriteria = (emailsToFilter) => {
        const filteredEmailCommunications = emailsToFilter
        .filter(({ date_sent }) =>
        (!fromDateFilter ? true : date_sent >= fromDateFilter)
        && (!toDateFilter ? true : date_sent <= toDateFilter));
        return filteredEmailCommunications;
    }
    
    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the communicationEmails here according to search criteria
        setEmailItems(filterEmailCommunicationsByCriteria(communicationEmails));
    };
    
    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setToDateFilter("");
    };
    
    return (
        <Layout pageTitle="Emails">
            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
                >
                <Grid item xs={12}>
                    <PageHeading text="Emails" />
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
                            Compose Email
                        </Button>
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
                                <Grid item lg={6} md={6} xs={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        id="from_date"
                                        name="from_date"
                                        label="From Date"
                                        value={fromDateFilter}
                                        onChange={(event) => {
                                            setFromDateFilter(
                                                event.target.value
                                                );
                                            }}
                                            />
                                </Grid>
                                <Grid item lg={6} md={6} xs={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        name="to_date"
                                        label="To Date"
                                        id="to_date"
                                        onChange={(event) => {
                                            setToDateFilter(event.target.value);
                                        }}
                                        value={toDateFilter}
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
                                        onClick={(event) =>
                                            handleSearchFormSubmit(event)
                                        }
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
                        rows={emailItems}
                        headCells={emailsTableHeadCells}
                        handleDelete={handleDelete}
                        deleteUrl={"communication_emails"}
                        noDetailsCol
                        noEditCol
                        noDeleteCol
                        />
                </Grid>

            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    console.log(state.users)
    return {
        users: state.users,
        currentUser: state.currentUser,
        communicationEmails: state.communicationEmails,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (collectionsUrls) => dispatch(itemsFetchData(collectionsUrls)),
    };
};
EmailsPage = connect(mapStateToProps, mapDispatchToProps)(EmailsPage);

export default withRouter(EmailsPage);

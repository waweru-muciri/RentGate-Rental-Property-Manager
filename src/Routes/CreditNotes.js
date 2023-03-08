import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleItemFormSubmit, handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import { getStartEndDatesForPeriod, getTransactionsFilterOptions } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CreditNoteEditForm from "../components/charges/EditCreditNote";


const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

const headCells = [
    { id: "credit_issue_date", numeric: false, disablePadding: true, label: "Date Issued" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Number/Ref" },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name" },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID" },
    { id: "credit_amount", numeric: true, disablePadding: true, label: "Credit Amount" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];


let CreditNotesPage = ({
    creditNotes,
    contacts,
    properties,
    handleItemSubmit,
}) => {
    const classes = commonStyles();
    const [creditNotesItems, setCreditNotesItems] = useState([]);
    const [filteredCreditNotesItems, setFilteredCreditNotesItems] = useState([]);
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [contactFilter, setContactFilter] = useState(null);
    const [editCreditNoteModalState, setEditCreditNoteModalState] = useState(false);

    const [selected, setSelected] = useState([]);
    const [creditNoteToEditId, setCreditNoteToEditId] = useState();

    useEffect(() => {
        setCreditNotesItems(creditNotes);
        setFilteredCreditNotesItems(filterCreditNotesByCriteria(creditNotes));
    }, [creditNotes]);

    const filterCreditNotesByCriteria = (creditNotesToFilter) => {
        //filter the creditNotes according to the search criteria here
        let filteredCreditNotes = creditNotesToFilter
        if (periodFilter) {
            const { startDate, endDate } = getStartEndDatesForPeriod(periodFilter)
            filteredCreditNotes = filteredCreditNotes.filter((creditNoteItem) => {
                const creditNoteDate = parse(creditNoteItem.credit_issue_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(creditNoteDate, { start: startDate, end: endDate })
            })
        }
        filteredCreditNotes = filteredCreditNotes
            .filter(({ credit_issue_date, tenant_id, property_id }) =>
                (!fromDateFilter ? true : credit_issue_date >= fromDateFilter)
                && (!toDateFilter ? true : credit_issue_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
                && (!contactFilter ? true : tenant_id === contactFilter.id)
            )
        return filteredCreditNotes;
    }

    const toggleEditCreditNoteModalState = () => {
        setEditCreditNoteModalState(!editCreditNoteModalState)
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        setFilteredCreditNotesItems(filterCreditNotesByCriteria(creditNotesItems));
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setPropertyFilter("all");
        setPeriodFilter("month-to-date");
        setFromDateFilter("");
        setToDateFilter("");
        setContactFilter("");
    };

    return (
        <Layout pageTitle="Credit Notes">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading text={'Credit Notes'} />
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
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Credit Notes Records'}
                            reportTitle={'Credit Notes Data'}
                            headCells={headCells}
                            dataToPrint={filteredCreditNotesItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
                            reportName={'Credit Notes Records'}
                            reportTitle={'Credit Notes Data'}
                            headCells={headCells}
                            dataToPrint={filteredCreditNotesItems.filter(({ id }) => selected.includes(id))}
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
                            id="creditNoteSearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                            >
                                <Grid item container spacing={2}>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item container xs={12} md={6} direction="row" spacing={2}>
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
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                select
                                                id="period_filter"
                                                name="period_filter"
                                                label="Period"
                                                value={periodFilter}
                                                onChange={(event) => {
                                                    setPeriodFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                            >
                                                {TRANSACTIONS_FILTER_OPTIONS.map((filterOption, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={filterOption.id}
                                                    >
                                                        {filterOption.text}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                name="property_filter"
                                                label="Property"
                                                id="property_filter"
                                                onChange={(event) => {
                                                    setPropertyFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                value={propertyFilter}
                                            >
                                                <MenuItem key={"all"} value={"all"}>All</MenuItem>
                                                {properties.map(
                                                    (property, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={property.id}
                                                        >
                                                            {property.ref}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                id="contact_filter"
                                                options={contacts}
                                                getOptionSelected={(option, value) => option.id === value.id}
                                                name="contact_filter"
                                                onChange={(event, newValue) => {
                                                    setContactFilter(newValue);
                                                }}
                                                value={contactFilter}
                                                getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                                style={{ width: "100%" }}
                                                renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
                                            />
                                        </Grid>
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
                                            form="creditNoteSearchForm"
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
                                            form="creditNoteSearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<UndoIcon />}
                                        >
                                            RESET
                                    </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
                {
                    editCreditNoteModalState ?
                        <CreditNoteEditForm open={editCreditNoteModalState}
                            creditNoteToEdit={creditNotesItems.find(({ id }) => id === creditNoteToEditId)}
                            handleClose={toggleEditCreditNoteModalState}
                            handleItemSubmit={handleItemSubmit} /> : null
                }
                <Grid item xs={12}>
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredCreditNotesItems}
                        headCells={headCells}
                        optionalEditHandler={(selectedRowIndex) => {setCreditNoteToEditId(selectedRowIndex); toggleEditCreditNoteModalState()}}
                        deleteUrl={"credit-notes"}
                    />
                </Grid>

            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        creditNotes: state.creditNotes
            .map((creditNote) => {
                const tenant = state.contacts.find((contact) => contact.id === creditNote.tenant_id) || {};
                const tenantUnit = state.propertyUnits.find(({ id }) => id === creditNote.unit_id) || {};

                return Object.assign({}, creditNote, {
                    tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                    tenant_id_number: tenant.id_number,
                    unit_ref: tenantUnit.ref
                })
            })
            .sort((creditNote1, creditNote2) => parse(creditNote2.credit_issue_date, 'yyyy-MM-dd', new Date()) -
                parse(creditNote1.credit_issue_date, 'yyyy-MM-dd', new Date())),
        properties: state.properties,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

CreditNotesPage = connect(mapStateToProps, mapDispatchToProps)(CreditNotesPage);

export default withRouter(CreditNotesPage);

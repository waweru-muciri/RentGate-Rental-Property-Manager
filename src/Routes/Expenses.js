import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import CustomizedSnackbar from "../components/CustomSnackbar";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";

const expensesTableHeadCells = [
    {
        id: "expense_date",
        numeric: false,
        disablePadding: true,
        label: "Date",
    },
    { id: "type", numeric: false, disablePadding: true, label: "Expenditure Type" },
    {
        id: "property_ref",
        numeric: false,
        disablePadding: true,
        label: "Property/Unit Ref",
    },
    { id: "amount", numeric: false, disablePadding: true, label: "Expenditure Amount(Ksh)" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let ExpensesPage = ({
    currentUser,
    expenses,
    handleItemDelete,
    properties,
    match,
    error,
}) => {
    const classes = commonStyles();
    let [expenseItems, setExpenseItems] = useState([]);
    let [filteredExpenseItems, setFilteredExpenseItems] = useState([]);
    let [fromDateFilter, setFromDateFilter] = useState("");
    let [toDateFilter, setToDateFilter] = useState("");
    let [propertyFilter, setPropertyFilter] = useState("");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        const mappedExpenses = expenses.sort((expense1, expense2) => expense2.expense_date > expense1.expense_date).map((expense) => {
            const property = properties.find(
                (property) => property.id === expense.property
            );
            const expenseDetails = {};
            expenseDetails.property_ref =
                typeof property !== "undefined" ? property.ref : null;
            expenseDetails.property =
                typeof property !== "undefined" ? property.id : null;
            return Object.assign({}, expense, expenseDetails);
        });
        setExpenseItems(mappedExpenses);
        setFilteredExpenseItems(mappedExpenses);
    }, [expenses, properties]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the expenses here according to search criteria
        let filteredExpenses = expenseItems
            .filter(({ expense_date }) =>
                !fromDateFilter ? true : expense_date >= fromDateFilter
            )
            .filter(({ expense_date }) =>
                !toDateFilter ? true : expense_date <= toDateFilter
            )
            .filter(({ property }) =>
                !propertyFilter ? true : property === propertyFilter
            )

        setFilteredExpenseItems(filteredExpenses);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredExpenseItems(expenseItems);
        setFromDateFilter("");
        setToDateFilter("");
        setPropertyFilter("");
    };

    return (
        <Layout pageTitle="Property Expenses">

            <Grid
                container
                spacing={3}
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item lg={12}>
                    <PageHeading text="Property Expenses" />
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
                        <PrintArrayToPdf
                            disabled={selected.length <= 0}
                            reportName={'Expenses Records'}
                            reportTitle={'Expenses Data'}
                            headCells={expensesTableHeadCells}
                            dataToPrint={expenseItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={selected.length <= 0}
                            reportName={'Expenses Records'}
                            reportTitle={'Expenses Data'}
                            headCells={expensesTableHeadCells}
                            dataToPrint={expenseItems.filter(({ id }) => selected.includes(id))}
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
                                <Grid
                                    container
                                    item
                                    xs={12} md={6}
                                    spacing={1}
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
                                <Grid item xs={12} md={6}>
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
                        rows={filteredExpenseItems}
                        headCells={expensesTableHeadCells}
                        tenant={currentUser.tenant}
                        handleDelete={handleItemDelete}
                        deleteUrl={"expenses"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.currentUser,
        expenses: state.expenses,
        properties: state.properties,
        isLoading: state.isLoading,
        error: state.error,
        match: ownProps.match,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (tenantId, itemId, url) => dispatch(handleDelete(tenantId, itemId, url)),
    };
};

ExpensesPage = connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);

export default withRouter(ExpensesPage);

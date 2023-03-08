import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import { parse } from "date-fns";
import { getExpensesCategories } from "../assets/commonAssets";


const EXPENSES_CATEGORIES = getExpensesCategories();

const expensesTableHeadCells = [
    { id: "expense_date", numeric: false, disablePadding: true, label: "Date", },
    { id: "property_ref", numeric: false, disablePadding: true, label: "Property" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "expense_name", numeric: false, disablePadding: true, label: "Expenditure Type" },
    { id: "amount", numeric: true, disablePadding: true, label: "Expenditure Amount(Ksh)" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let ExpensesPage = ({
    expenses,
    handleItemDelete,
    properties,
    match,
}) => {
    const classes = commonStyles();
    const [expenseItems, setExpenseItems] = useState([]);
    const [filteredExpenseItems, setFilteredExpenseItems] = useState([]);
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        setExpenseItems(expenses);
        setFilteredExpenseItems(expenses);
    }, [expenses]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the expenses here according to search criteria
        const filteredExpenses = expenseItems
            .filter(({ expense_date, property_id }) =>
                (!fromDateFilter ? true : expense_date >= fromDateFilter)
                && (!toDateFilter ? true : expense_date <= toDateFilter)
                && (propertyFilter === "all" ? true : property_id === propertyFilter)
            )
        setFilteredExpenseItems(filteredExpenses);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setToDateFilter("");
        setPropertyFilter("all");
    };

    return (
        <Layout pageTitle="Property Expenses">
            <Grid
                container
                spacing={3}
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
                            disabled={!selected.length}
                            component={Link}
                            to={`${match.url}/${selected[0]}/edit`}
                        >
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Expenses Records'}
                            reportTitle={'Expenses Data'}
                            headCells={expensesTableHeadCells}
                            dataToPrint={expenseItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
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
                        rows={filteredExpenseItems}
                        headCells={expensesTableHeadCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"expenses"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        expenses: state.expenses
            .map(expense => {
                const unitWithExpense = state.propertyUnits.find(({ id }) => id === expense.unit_id) || {}
                const propertyWithUnit = state.properties.find(({ id }) => id === expense.property_id) || {}
                const expenseDetails = EXPENSES_CATEGORIES.find(({ id }) => id === expense.type) || {}
                return Object.assign({}, expense, { expense_name: expenseDetails.displayValue },
                    { unit_ref: unitWithExpense.ref, property_ref: propertyWithUnit.ref })
            })
            .sort((expense1, expense2) => parse(expense2.expense_date, 'yyyy-MM-dd', new Date()) -
                parse(expense1.expense_date, 'yyyy-MM-dd', new Date())),
        properties: state.properties,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

ExpensesPage = connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);

export default withRouter(ExpensesPage);

import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { getExpensesCategories } from "../../assets/commonAssets";
import moment from "moment";

const defaultDate = moment().format("YYYY-MM-DD");

const VacatingNoticeSchema = Yup.object().shape({
  type: Yup.string().required("Expenditure Type/Name is required"),
  amount: Yup.number().min(0).required("Expenditure Amount is required"),
  expense_date: Yup.date().required("Expenditure Date Required"),
  property: Yup.string().required("Property is Required"),
  expense_notes: Yup.string().default(""),
});

const ExpenseInputForm = (props) => {
  const { properties, handleItemSubmit, currentUser } = props
  const history = useHistory();
  const classes = commonStyles();
  const expenseCategories = getExpensesCategories();
  const expenseToEdit =  typeof props.expenseToEdit !== 'undefined' ? props.expenseToEdit : {}
  const expenseValues =  {
        id: expenseToEdit.id,
		expense_notes: expenseToEdit.expense_notes ||  '',
		expense_date: expenseToEdit.expense_date || defaultDate,
		amount: expenseToEdit.amount || 0,
		property: expenseToEdit.property || '',
		type: expenseToEdit.type || '',
	}

  return (
    <Formik
      initialValues={expenseValues}
      enableReinitialize
      validationSchema={VacatingNoticeSchema}
      onSubmit={(values, { resetForm }) => {
        const expense = {
          id: values.id,
          type: values.type,
          amount: values.amount,
          property: values.property,
          expense_date: values.expense_date,
          expense_notes: values.expense_notes,
        };
        handleItemSubmit(currentUser, expense, "expenses").then((response) => {
          resetForm({});
          if (values.id) {
            history.goBack();
          }
        });
      }}
    >
      {({
        values,
        handleSubmit,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
          <form
            className={classes.form}
            method="post"
            id="expenseInputForm"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={4}
              justify="center"
              alignItems="stretch"
              direction="column"
            >
              <Grid item>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="property"
                  label="Property/Unit Ref"
                  id="property"
                  onChange={handleChange}
                  value={values.property || ''}
                  error={"property" in errors}
                  helperText={errors.property}
                >
                  {properties.map((property, index) => (
                    <MenuItem key={index} value={property.id}>
                      {property.ref}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="expense_date"
                  name="expense_date"
                  label="Expenditure Date"
                  value={values.expense_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"expense_date" in errors}
                  helperText={errors.expense_date}
                />
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  id="type"
                  name="type"
                  label="Expense Type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"type" in errors}
                  helperText={errors.type}
                >
                  {expenseCategories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="amount"
                  name="amount"
                  label="Expenditure Amount"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"amount" in errors}
                  helperText={errors.amount}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  id="expense_notes"
                  name="expense_notes"
                  label="Notes"
                  value={values.expense_notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={"Any notes regarding this expense?"}
                />
              </Grid>
              <Grid item className={classes.buttonBox}>
                <Button
                  color="secondary"
                  variant="contained"
                  size="medium"
                  startIcon={<CancelIcon />}
                  onClick={() => history.goBack()}
                  disableElevation
                >
                  Cancel
              </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<SaveIcon />}
                  form="expenseInputForm"
                  disabled={isSubmitting}
                >
                  Save
              </Button>
              </Grid>
            </Grid>
          </form>
        )}
    </Formik>
  );
};

export default ExpenseInputForm;

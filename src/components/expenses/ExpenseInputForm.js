import React from "react";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { getExpensesCategories } from "../../assets/commonAssets";
import moment from "moment";

const defaultDate = moment().format("YYYY-MM-DD");

const PropertyExpenseSchema = Yup.object().shape({
  type: Yup.string().required("Expenditure Type/Name is required"),
  amount: Yup.number().min(0).required("Expenditure Amount is required"),
  expense_date: Yup.date().required("Expenditure Date Required"),
  property: Yup.string().required("Property is Required"),
  property_unit: Yup.string().required("Unit is Required"),
  expense_notes: Yup.string().default(""),
});

const ExpenseInputForm = (props) => {
  const { properties, propertyUnits, handleItemSubmit, currentUser, history } = props
  const classes = commonStyles();
  const expenseCategories = getExpensesCategories();
  const expenseToEdit = typeof props.expenseToEdit !== 'undefined' ? props.expenseToEdit : {}
  const expenseValues = {
    id: expenseToEdit.id,
    expense_notes: expenseToEdit.expense_notes || '',
    expense_date: expenseToEdit.expense_date || defaultDate,
    amount: expenseToEdit.amount || '',
    property: expenseToEdit.property || '',
    property_unit: expenseToEdit.property_unit || '',
    type: expenseToEdit.type || '',
  }

  return (
    <Formik
      initialValues={expenseValues}
      enableReinitialize
      validationSchema={PropertyExpenseSchema}
      onSubmit={async (values, { resetForm }) => {
        const expense = {
          id: values.id,
          type: values.type,
          amount: values.amount,
          property_unit: values.property_unit,
          expense_date: values.expense_date,
          expense_notes: values.expense_notes,
        };
        await handleItemSubmit(currentUser, expense, "expenses")
        resetForm({});
        if (values.id) {
          history.goBack();
        }
      }}
    >
      {({
        values,
        handleSubmit,
        touched,
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
              spacing={2}
              justify="center"
              alignItems="stretch"
              direction="column"
            >
              <Grid item container direction="row" spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    name="property"
                    label="Property"
                    id="property"
                    onChange={handleChange}
                    value={values.property}
                    error={errors.property && touched.property}
                    helperText={touched.property && errors.property}

                  >
                    {properties.map((property, index) => (
                      <MenuItem key={index} value={property.id}>
                        {property.ref}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    name="property_unit"
                    label="Unit"
                    id="property_unit"
                    onChange={handleChange}
                    value={values.property_unit}
                    error={errors.property_unit && touched.property_unit}
                    helperText={touched.property_unit && errors.property_unit}

                  >
                    {propertyUnits.filter((propertyUnit) => propertyUnit.property_id === values.property).map((property_unit, index) => (
                      <MenuItem key={index} value={property_unit.id}>
                        {property_unit.ref}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item>
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
                  error={errors.expense_date && touched.expense_date}
                  helperText={touched.expense_date && errors.expense_date}
                />
              </Grid>
              <Grid item>
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
                  error={errors.type && touched.type}
                  helperText={touched.type && errors.type}
                >
                  {expenseCategories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="amount"
                  name="amount"
                  label="Expenditure Amount"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.amount && touched.amount}
                  helperText={touched.amount && errors.amount}
                />
              </Grid>
              <Grid item>
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
              <Grid item container direction="row" className={classes.buttonBox}>
                <Grid item>
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
                </Grid>
                <Grid item>
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
            </Grid>
          </form>
        )}
    </Formik>
  );
};

export default ExpenseInputForm;

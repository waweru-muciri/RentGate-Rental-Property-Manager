import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";

const VacatingNoticeSchema = Yup.object().shape({
  type: Yup.string().required("Expenditure Type/Name is required"),
  amount: Yup.number().required("Expenditure Amount is required"),
  expense_date: Yup.date().required("Expenditure Date Required"),
  property: Yup.string().required("Property is Required"),
});

const ExpenseInputForm = ({ properties, expenseToEdit, handleItemSubmit }) => {
  const history = useHistory();
  const classes = commonStyles();

  return (
    <Formik
      initialValues={expenseToEdit}
      enableReinitialize
      validationSchema={VacatingNoticeSchema}
      onSubmit={(values, { resetForm }) => {
        const expense = {
          id: values.id,
          type: values.type,
          amount: values.amount,
          property: values.property,
          expense_date: values.expense_date,
        };
        handleItemSubmit(expense, "expenses").then((response) => {
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
            {
              console.log('Values => ', values)
            }
            {
              console.log('Properties => ', properties)

            }
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
                  variant="outlined"
                  id="type"
                  name="type"
                  label="Expenditure Type/Name"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"type" in errors}
                  helperText={errors.type}
                />
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
                  select
                  variant="outlined"
                  name="property"
                  label="Property"
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

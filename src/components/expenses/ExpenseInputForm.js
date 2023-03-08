import React from "react";
import CustomSnackbar from '../CustomSnackbar'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { getExpensesCategories } from "../../assets/commonAssets";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const EXPENSE_CATEGORIES = getExpensesCategories();
const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const PropertyExpenseSchema = Yup.object().shape({
  type: Yup.string().required("Expenditure Type/Name is required"),
  amount: Yup.number().positive("Amount must be a positive number").required("Expenditure Amount is required"),
  expense_date: Yup.date().required("Expenditure Date Required"),
  property_id: Yup.string().required("Property is Required"),
  unit_id: Yup.string().default(""),
  expense_notes: Yup.string().default(""),
});

const ExpenseInputForm = (props) => {
  const { properties, propertyUnits, handleItemSubmit, history } = props
  const classes = commonStyles();
  const expenseToEdit = props.expenseToEdit || {}
  const expenseValues = {
    id: expenseToEdit.id,
    expense_notes: expenseToEdit.expense_notes || '',
    expense_date: expenseToEdit.expense_date || defaultDate,
    amount: expenseToEdit.amount || '',
    property_id: expenseToEdit.property_id || '',
    unit_id: expenseToEdit.unit_id || '',
    type: expenseToEdit.type || '',
  }

  return (
    <Formik
      initialValues={expenseValues}
      enableReinitialize
      validationSchema={PropertyExpenseSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const expense = {
            id: values.id,
            type: values.type,
            amount: values.amount,
            unit_id: values.unit_id,
            property_id: values.property_id,
            expense_date: values.expense_date,
            expense_notes: values.expense_notes,
          };
          await handleItemSubmit(expense, "expenses")
          resetForm({});
          if (values.id) {
            history.goBack();
          }
          setStatus({ sent: true, msg: "Details saved successfully." })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}.` })
        }
      }}
    >
      {({
        values,
        status,
        handleSubmit,
        touched,
        errors,
        handleChange,
        handleBlur,
        setFieldValue,
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
            {
              status && status.msg && (
                <CustomSnackbar
                  variant={status.sent ? "success" : "error"}
                  message={status.msg}
                />
              )
            }
            {
              isSubmitting && (<CustomCircularProgress open={true} />)
            }
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="property_id"
                  label="Property"
                  id="property_id"
                  onChange={(event) => {
                    setFieldValue('property_id', event.target.value);
                    setFieldValue('unit_id', '');
                  }}
                  value={values.property_id}
                  error={errors.property_id && touched.property_id}
                  helperText={touched.property_id && errors.property_id}

                >
                  {properties.map((property, index) => (
                    <MenuItem key={index} value={property.id}>
                      {property.ref}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="unit_id"
                  label="Unit"
                  id="unit_id"
                  onChange={handleChange}
                  value={values.unit_id}
                  error={errors.unit_id && touched.unit_id}
                  helperText={touched.unit_id && errors.unit_id}
                >
                  {propertyUnits.filter(({ property_id }) => property_id === values.property_id).map((unit_id, index) => (
                    <MenuItem key={index} value={unit_id.id}>
                      {unit_id.ref}
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
                {EXPENSE_CATEGORIES.map((category, index) => (
                  <MenuItem key={index} value={category.id}>
                    {category.displayValue}
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
                rows={2}
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

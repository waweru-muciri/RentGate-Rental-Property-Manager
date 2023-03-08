import React from "react";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CustomSnackbar from '../CustomSnackbar'
import * as Yup from "yup";
import { Formik } from "formik";
import { getPaymentOptions } from "../../assets/commonAssets.js";
import { commonStyles } from "../commonStyles.js";
import { DialogTitle } from "@material-ui/core";

const RENT_CYCLES = getPaymentOptions();
const CHARGE_TYPES = [
    { id: 'one_time_charge', name: 'One Time Charge' },
    { id: 'recurring_charge', name: 'Recurring Charge' },
];

const UnitChargeSchema = Yup.object().shape({
    type: Yup.string().trim().required('Charge Type is Required'),
    due_date: Yup.date().required("Due Date is required"),
    charge_label: Yup.string().trim().required("Charge Name is required"),
    frequency: Yup.string().trim().when('type', { is: 'recurring_charge', then: Yup.string().required('Frequency to make charge is required') }),
    amount: Yup.number().typeError('Amount must be a number').positive("Amount must be a positive number").required('Charge Amount is required'),
});

export default function FormDialog(props) {
    const classes = commonStyles();
    const { open, handleClose, handleItemSubmit, chargeValues } = props

    if (!chargeValues.frequency) {
        chargeValues.frequency = ''
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle>{chargeValues.charge_label ? 'Edit Charge' : 'Add Charge'}</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={chargeValues}
                    validationSchema={UnitChargeSchema}
                    onSubmit={(values, { resetForm, setStatus }) => {
                        try {
                            let unitChargeToSave = {
                                id: values.id,
                                unit_id: values.unit_id,
                                charge_label: values.charge_label,
                                type: values.type,
                                amount: values.amount,
                                due_date: values.due_date,
                                frequency: values.frequency,
                            };
                            handleItemSubmit(unitChargeToSave)
                            resetForm({});
                            setStatus({ sent: true, msg: "Charge added to agreement!" })
                            if (values.id) {
                                handleClose()
                            }
                        } catch (error) {
                            setStatus({ sent: false, msg: `Error! ${error}.` })
                        }
                    }}>
                    {({
                        values,
                        status,
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
                            id="chargeInputForm"
                            onSubmit={handleSubmit}
                        >
                            <Grid
                                container
                                direction="column"
                                spacing={2}
                            >
                                {
                                    status && status.msg && (
                                        <CustomSnackbar
                                            variant={status.sent ? "success" : "error"}
                                            message={status.msg}
                                        />
                                    )
                                }
                                <Grid container item direction="column" spacing={2}>
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            select
                                            name='type'
                                            label="Charge Type"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.type}
                                            error={errors.type && touched.type}
                                            helperText={touched.type && errors.type}
                                        >
                                            {CHARGE_TYPES.map((type, index) => (
                                                <MenuItem key={index} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            label="Charge Name"
                                            variant="outlined"
                                            type="text"
                                            value={values.charge_label}
                                            name='charge_label'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.charge_label && touched.charge_label}
                                            helperText={touched.charge_label && errors.charge_label}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="due_date"
                                            type="date"
                                            name='due_date'
                                            label="Next Due Date"
                                            value={values.due_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={errors.due_date && touched.due_date}
                                            helperText={touched.due_date && errors.due_date}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md>
                                        <TextField
                                            fullWidth
                                            label="Amount"
                                            variant="outlined"
                                            type="text"
                                            value={values.amount}
                                            name='amount'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.amount && touched.amount}
                                            helperText={touched.amount && errors.amount}
                                        />
                                    </Grid>
                                    {
                                        values.type === 'recurring_charge' ?
                                            <Grid item xs={12} md>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    select
                                                    name='frequency'
                                                    label="Frequency"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.frequency}
                                                    error={errors.frequency && touched.frequency}
                                                    helperText={touched.frequency && errors.frequency}
                                                >
                                                    {RENT_CYCLES.map((frequency, index) => (
                                                        <MenuItem key={index} value={frequency}>
                                                            {frequency}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            : null}
                                </Grid>
                                <Grid
                                    item
                                    container
                                    direction="row"
                                    className={classes.buttonBox}
                                >
                                    <Grid item>
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<CancelIcon />}
                                            onClick={() => { handleClose() }}
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
                                            form="chargeInputForm"
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
            </DialogContent>
        </Dialog >
    );
}

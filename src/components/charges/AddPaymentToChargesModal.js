import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CustomSnackbar from '../CustomSnackbar';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import * as Yup from "yup";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles.js";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const AddPaymentToChargesSchema = Yup.object().shape({
    payment_date: Yup.date().required('Payment Date is Required'),
    memo: Yup.string().trim().max(50, "Memo details should be less than 50 characters").default(''),
});

export default function AddPaymentToChargesModal(props) {
    const classes = commonStyles();
    const { chargesToAddPayments, open, handleClose, handleItemSubmit } = props

    const paymentValues = {
        memo: "Charge Payment",
        payment_date: defaultDate,
        send_email_receipts: false,
        send_sms_receipts: false,
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="alert-dialog-title">Set Charges Paid In Full</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={paymentValues}
                    validationSchema={AddPaymentToChargesSchema}
                    onSubmit={async (values, { setStatus }) => {
                        try {
                            //edit the charges here to show that they are payed
                            for (let index = 0; index < chargesToAddPayments.length; index++) {
                                const charge = chargesToAddPayments[index];
                                const chargePayment = {
                                    charge_id: charge.id,
                                    payment_amount: charge.charge_amount,
                                    payment_date: values.payment_date,
                                    tenant_id: charge.tenant_id,
                                    unit_id: charge.unit_id,
                                    property_id: charge.property_id,
                                    payment_label: charge.charge_label,
                                    memo: values.memo,
                                    payment_type: charge.charge_type,
                                };
                                await handleItemSubmit(chargePayment, 'charge-payments')
                                await handleItemSubmit({ id: charge.id, payed: true }, 'transactions-charges')

                            }
                            if (values.send_email_receipts) {
                                
                            }
                            if (values.send_sms_receipts) {
                                
                            }
                            setStatus({ sent: true, msg: "Payments added successfully." })
                            setTimeout(() => handleClose(), 1000);
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
                            id="AddPaymentToChargesForm"
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
                                {
                                    isSubmitting && (<CustomCircularProgress open={true} />)
                                }
                                <Grid container item direction="column" spacing={2}>
                                    <Grid item>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="payment_date"
                                            type="date"
                                            name="payment_date"
                                            label="Payment Date"
                                            value={values.payment_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={errors.payment_date && touched.payment_date}
                                            helperText={touched.payment_date && errors.payment_date}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                            name="memo"
                                            id="memo"
                                            label="Payment Details/Memo"
                                            value={values.memo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.memo && touched.memo}
                                            helperText={"Include details for the payments here (max 50)"}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControl color="secondary" error={errors.send_email_receipts && touched.send_email_receipts}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.send_email_receipts}
                                                        onChange={handleChange}
                                                        name="send_email_receipts"
                                                        color="primary"
                                                    />
                                                }
                                                label="Send Email Receipts"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl color="secondary" error={errors.send_sms_receipts && touched.send_sms_receipts}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.send_sms_receipts}
                                                        onChange={handleChange}
                                                        name="send_sms_receipts"
                                                        color="primary"
                                                    />
                                                }
                                                label="Send SMS Receipts"
                                            />
                                        </FormControl>
                                    </Grid>
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
                                            form="AddPaymentToChargesForm"
                                            disabled={isSubmitting}
                                        >
                                            Add Payments
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
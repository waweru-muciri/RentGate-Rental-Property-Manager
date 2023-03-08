import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";


const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const PaymentSchema = Yup.object().shape({
    tenant_id: Yup.string().trim().required('Tenant is required'),
    credit_issue_date: Yup.date().required('Credit Date is Required'),
    credit_amount: Yup.number().typeError('Amount must be a number')
        .positive("Amount must be a positive number")
        .required("Credit amount is required"),
    memo: Yup.string().trim().max(50, "Memo details should be less than 50 characters").default(''),
});


export default function CreditNoteEditForm({ open, handleClose, creditNoteToEdit, handleItemSubmit }) {
    const classes = commonStyles();
    const paymentValues = {
        id: creditNoteToEdit.id,
        credit_amount: creditNoteToEdit.credit_amount || "",
        memo: creditNoteToEdit.memo || "",
        credit_issue_date: creditNoteToEdit.credit_issue_date || defaultDate,
        tenant_id: creditNoteToEdit.tenant_id,
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="alert-dialog-title">Edit Credit Note</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={paymentValues}
                    enableReinitialize validationSchema={PaymentSchema}
                    onSubmit={async (values, { setStatus }) => {
                        try {
                            const creditNote = {
                                id: values.id,
                                credit_amount: values.credit_amount,
                                memo: values.memo,
                                credit_issue_date: values.credit_issue_date,
                                tenant_id: values.tenant_id,
                            };
                            await handleItemSubmit(creditNote, 'credit-notes')
                            setStatus({ sent: true, msg: "Credit Note saved successfully." })
                            handleClose();
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
                        isSubmitting,
                    }) => (
                        <form
                            className={classes.form}
                            method="post"
                            id="CreditNoteEditForm"
                            onSubmit={handleSubmit}
                        >
                            <Grid container spacing={2} direction="column">
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
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="credit_issue_date"
                                        type="date"
                                        name="credit_issue_date"
                                        label="Credit Issue Date"
                                        value={values.credit_issue_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.credit_issue_date && touched.credit_issue_date}
                                        helperText={touched.credit_issue_date && errors.credit_issue_date}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        variant="outlined"
                                        name="credit_amount"
                                        id="credit_amount"
                                        label="Credit Amount"
                                        value={values.credit_amount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.credit_amount && touched.credit_amount}
                                        helperText={touched.credit_amount && errors.credit_amount}
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
                                        label="Credit Note Details/Memo"
                                        value={values.memo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.memo && touched.memo}
                                        helperText={"Include details for the credit note here (max 50)"}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    container
                                    justify="flex-start"
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
                                            form="CreditNoteEditForm"
                                            disabled={isSubmitting}
                                        >
                                            Save Note
								</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    )
                    }
                </Formik >
            </DialogContent>
        </Dialog >
    );
};

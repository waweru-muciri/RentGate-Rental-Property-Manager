import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import CustomSnackbar from '../components/CustomSnackbar'
import * as Yup from "yup";
import { Formik } from "formik";
import { commonStyles } from "../components/commonStyles.js";


const RentAdjustSchema = Yup.object().shape({
    increase_or_decrease: Yup.string().trim().required('Adjust choice is Required'),
    adjust_method: Yup.string().trim().required("Method is required"),
    fixed_adjust_amount: Yup.number().typeError('Amount must be a number')
        .when('adjust_method', { is: 'fixed_amount', then: Yup.number().min(0).required('Amount is required') }),
    adjust_percentage: Yup.number().typeError('Percentage must be a number')
        .when('adjust_method', {
            is: 'percentage',
            then: Yup.number().min(0).max(100, "Percentage must be less <= 100")
                .required('Percentage is required')
        }),

});

export default function RentAdjustModal(props) {
    const classes = commonStyles();
    const { leasesToAdjustRentAmounts, open, handleClose, handleItemSubmit } = props

    const rentAdjustValues = {
        increase_or_decrease: "increase",
        adjust_method: "fixed_amount",
        adjust_percentage: "",
        fixed_adjust_amount: "",
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="alert-dialog-title"> Adjust Rent Amounts</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={rentAdjustValues}
                    validationSchema={RentAdjustSchema}
                    onSubmit={async (values, { resetForm, setStatus }) => {
                        try {
                            leasesToAdjustRentAmounts.forEach(async leaseToAdjust => {
                                const currentRentAmount = parseFloat(leaseToAdjust.rent_amount) || 0
                                let rentAmountToAdjustBy = 0;
                                if (values.adjust_method === "percentage") {
                                    rentAmountToAdjustBy = (currentRentAmount * values.adjust_percentage) / 100
                                } else {
                                    rentAmountToAdjustBy = parseFloat(values.fixed_adjust_amount)
                                }
                                const newRentAmount = values.increase_or_decrease === "increase" ?
                                    (currentRentAmount + rentAmountToAdjustBy) : (currentRentAmount - rentAmountToAdjustBy)
                                const leaseWithAdjustedRentAmount = Object.assign({}, leaseToAdjust, { rent_amount: newRentAmount })
                                await handleItemSubmit(leaseWithAdjustedRentAmount, 'leases')
                            });
                            resetForm({});
                            setStatus({ sent: true, msg: "Rent Amounts Adjusted Successfully!" })
                            handleClose()
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
                            id="rentAdjustForm"
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
                                    <Grid item>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Increase/Decrease Rent Amount</FormLabel>
                                            <RadioGroup aria-label="Increase or Decrease" name="increase_or_decrease"
                                                value={values.increase_or_decrease} onChange={handleChange}>
                                                <FormControlLabel value="increase" control={<Radio />} label="Increase" />
                                                <FormControlLabel value="decrease" control={<Radio />} label="Decrease" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Adjust Rent Amount By</FormLabel>
                                            <RadioGroup aria-label="Adjust Method" name="adjust_method"
                                                value={values.adjust_method} onChange={handleChange}>
                                                <FormControlLabel value="fixed_amount" control={<Radio />} label="Fixed Amount" />
                                                <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md>
                                        {
                                            values.adjust_method === "fixed_amount" ?
                                                <TextField
                                                    fullWidth
                                                    label="Amount to Adjust Rent"
                                                    variant="outlined"
                                                    type="text"
                                                    value={values.fixed_adjust_amount}
                                                    id='fixed_adjust_amount'
                                                    name='fixed_adjust_amount'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.fixed_adjust_amount && touched.fixed_adjust_amount}
                                                    helperText={touched.fixed_adjust_amount && errors.fixed_adjust_amount}
                                                />
                                                :
                                                <TextField
                                                    fullWidth
                                                    label="Percentage to Adjust Rent"
                                                    variant="outlined"
                                                    type="text"
                                                    value={values.adjust_percentage}
                                                    name='adjust_percentage'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.adjust_percentage && touched.adjust_percentage}
                                                    helperText={touched.adjust_percentage && errors.adjust_percentage}
                                                />
                                        }
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
                                            form="rentAdjustForm"
                                            disabled={isSubmitting}
                                        >
                                            Adjust Rent
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
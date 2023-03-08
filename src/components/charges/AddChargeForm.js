import React from "react";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../PageHeading";
import Layout from "../PrivateLayout";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { connect } from "react-redux";
import { handleItemFormSubmit } from '../../actions/actions'
import { withRouter } from "react-router-dom";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";
import { getChargeOptions } from "../../assets/commonAssets";

const CHARGE_OPTIONS = getChargeOptions();

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const PaymentSchema = Yup.object().shape({
    charge_type: Yup.string().trim().required('Charge type is required'),
    charge_amount: Yup.number().typeError('Amount must be a number').positive("Amount must be a positive number")
        .required("Charge amount is required"),
    charge_date: Yup.date().required('Charge Date is Required'),
    due_date: Yup.date(),
});


let AddChargeForm = ({ history, leaseToAddCharge, handleItemSubmit }) => {
    const classes = commonStyles();
    // Get the action to complete.
    const pageTitle = `Add Charge Details`;

    const paymentValues = {
        charge_amount: 0,
        charge_type: '',
        charge_label: '',
        charge_date: defaultDate,
        due_date: defaultDate,
    };

    return (
        <Layout pageTitle="Charge Details">
            <Grid container justify="center" direction="column">
                <Grid item key={2}>
                    <PageHeading text={pageTitle} />
                </Grid>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    item
                    key={3}
                >
                    <Formik
                        initialValues={paymentValues}
                        enableReinitialize validationSchema={PaymentSchema}
                        onSubmit={async (values, { resetForm, setStatus }) => {
                            //check if it is a legit lease to add charges to
                            if (leaseToAddCharge.tenants) {
                                try {
                                    const charge = {
                                        charge_amount: values.charge_amount,
                                        charge_date: values.charge_date,
                                        charge_type: values.charge_type,
                                        charge_label: CHARGE_OPTIONS.find(({ id }) => id === values.charge_type).displayValue,
                                        payed: false,
                                        due_date: values.due_date,
                                        tenant_id: leaseToAddCharge.tenants[0],
                                        property_id: leaseToAddCharge.property_id,
                                        unit_id: leaseToAddCharge.unit_id,
                                    };
                                    await handleItemSubmit(charge, 'transactions-charges')
                                    resetForm({});
                                    setStatus({ sent: true, msg: "Charge saved successfully." })
                                } catch (error) {
                                    setStatus({ sent: false, msg: `Error! ${error}.` })
                                }
                            } else {
                                setStatus({ sent: false, msg: `Error cannot add charge to invalid agreement.` })
                                history.goBack()
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
                                noValidate
                                id="chargeEditForm"
                                onSubmit={handleSubmit}
                            >
                                <Grid container>
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
                                    <Grid item container spacing={2} direction="column">
                                        <Grid item>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="charge_date"
                                                type="date"
                                                name="charge_date"
                                                label="Charge Date"
                                                value={values.charge_date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                error={errors.charge_date && touched.charge_date}
                                                helperText={touched.charge_date && errors.charge_date}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="due_date"
                                                type="date"
                                                name="due_date"
                                                label="Due Date"
                                                value={values.due_date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                error={errors.due_date && touched.due_date}
                                                helperText={touched.due_date && errors.due_date}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                variant="outlined"
                                                name="charge_amount"
                                                id="charge_amount"
                                                label="Charge Amount"
                                                value={values.charge_amount}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.charge_amount && touched.charge_amount}
                                                helperText={touched.charge_amount && errors.charge_amount}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                id="charge_type"
                                                name="charge_type"
                                                label="Charge Type"
                                                value={values.charge_type}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.charge_type && touched.charge_type}
                                                helperText={touched.charge_type && errors.charge_type}
                                            >
                                                {CHARGE_OPTIONS.map((chargeOption, index) => (
                                                    <MenuItem key={index} value={chargeOption.id}>
                                                        {chargeOption.displayValue}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
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
                                                form="chargeEditForm"
                                                disabled={isSubmitting}
                                            >
                                                Save Charge
												</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        )
                        }
                    </Formik >
                </Grid>
            </Grid>
        </Layout >
    );
};

const mapStateToProps = (state, ownProps) => {
    const leaseToAddCharge = state.leases.find(({ id }) => id === ownProps.match.params.leaseId) || {};
    return {
        leaseToAddCharge: leaseToAddCharge,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

AddChargeForm = connect(mapStateToProps, mapDispatchToProps)(AddChargeForm);

export default withRouter(AddChargeForm);
import React from 'react'
import { TextField, MenuItem, Grid, Typography, Button } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { withFormik } from "formik";
import { handleItemFormSubmit } from '../../actions/actions'
import { commonStyles }  from "../../components/commonStyles";
import { withRouter } from 'react-router-dom';
import { getCurrencyOptions, getPaymentOptions, getTransactionTypes, getLeaseOptions, } from '../../assets/commonAssets.js';


const LEASE_OPTIONS = getLeaseOptions();
const CURRENCY_OPTIONS = getCurrencyOptions();
const TRANSACTION_TYPES = getTransactionTypes()
const PAYMENT_OPTIONS = getPaymentOptions(); 
// this should be retrieved from the server
const TENANTS = ['Brian', "Muciri", 'Hello world'] 
const PROPERTIES = ['Property 1', 'Property 2', 'Property 3'] 
const LANDLORDS = ['Landlord 1', 'Landlord 2', 'Landlord 3', 'Landlord 4', 'Landlord 5', ]
const ASSIGNED_TO = ['Assinged To 1', 'Assigned To 2', 'Assigned To 3']


let InputForm = ({
    values,
	match,
    touched,
    errors,
    handleChange,
    handleBlur,
	setFieldValue,
    handleSubmit,
    isSubmitting, }) => {
	const styles = commonStyles()
    return (
            <form className={ styles.form} method="post" id="transactionInputForm" onSubmit={handleSubmit}>
					<Grid container>
               		 <Grid container spacing={4} justify="center" alignItems='flex-start' direction="row">
               		 <Grid lg={6} justify="center" container item direction="column">
            			<Typography variant="h6"> Transaction Information </Typography>
					<TextField variant="outlined" select name="property" label="Property For Transaction" id="property" onBlur={handleBlur} onChange={handleChange} value={values.property || ''} required error={errors.property && touched.property}
                        helperText={touched.property && errors.property}
                    >
                        {
                            PROPERTIES.map((property, index) => <MenuItem key={index} value={property}>{property}</MenuItem>)
                        }
                    </TextField>

                    						                    <TextField required error={errors.assigned_to && touched.assigned_to} helperText={touched.assigned_to && errors.assigned_to} variant="outlined" type="select" name="assigned_to" id="assigned_to" label="Assigned To"  value={values.assigned_to || ''} onChange={handleChange} onBlur={handleBlur} >
			{/** substitute for users that can be assigned to here **/}
			{
									ASSIGNED_TO.map((assigned_to, index) => <MenuItem key={index} value={assigned_to}>{assigned_to}</MenuItem>)
								}
							</TextField>

                    <TextField variant="outlined" select name="transaction_type" label="Transaction Type" id="transaction_type" onBlur={handleBlur} onChange={handleChange} value={values.transaction_type|| ''} required error={errors.transaction_type && touched.transaction_type}
                        helperText={touched.transaction_type && errors.transaction_type}
                    >
                        {
                            TRANSACTION_TYPES.map((transaction_type, index) => <MenuItem key={index} value={transaction_type}>{transaction_type}</MenuItem>)
                        }
                    </TextField>
					<TextField required error={errors.lease_type && touched.lease_type} helperText={touched.lease_type && errors.lease_type} variant="outlined" select name="lease_type" id="lease_type" label="Lease Type"  value={values.lease_type || ''} onChange={handleChange} onBlur={handleBlur} >
			{
				LEASE_OPTIONS.map((lease_type, index) => <MenuItem key={index} value={lease_type}>{lease_type}</MenuItem>)
                        }
                    </TextField>

							<TextField variant="outlined" id="lease_start" name="lease_start" label="Lease Start" type="date" value={values.lease_start || ''} onChange={handleChange} onBlur={handleBlur} InputLabelProps={{ shrink: true }} />
							<TextField variant="outlined" id="lease_end" label="Lease End" type="date" name="lease_end"	value={values.lease_end || ''} onChange={handleChange} onBlur={handleBlur} InputLabelProps={{ shrink: true }} />
							<TextField variant="outlined" id="lease_renewal" label="Lease Renewal" type="date" name="lease_renewal"	value={values.lease_renewal || ''} onChange={handleChange} onBlur={handleBlur} InputLabelProps={{ shrink: true }} />
							<TextField variant="outlined" id="renewal_reminder" label="Reminder Date" type="date" name="renewal_reminder"	value={values.renewal_reminder || ''} onChange={handleChange} onBlur={handleBlur} InputLabelProps={{ shrink: true }} />
					</Grid>
               		 <Grid lg={6} justify="center" container item direction="column">
            			<Typography variant="h6"> Payment Information </Typography>
					
				<TextField variant="outlined" select name="tenant" label="Tenant" id="tenant" onBlur={handleBlur} onChange={handleChange} value={values.tenant || ''} required error={errors.tenant && touched.tenant}
                        helperText={touched.tenant && errors.tenant}
                    >
                        {
                            TENANTS.map((tenant, index) => <MenuItem key={index} value={tenant}>{tenant}</MenuItem>)
                        }
                    </TextField>
					<TextField variant="outlined" select name="landlord" label="LandLord" id="landlord" onBlur={handleBlur} onChange={handleChange} value={values.landlord || ''} required error={errors.landlord && touched.landlord}
								helperText={touched.landlord && errors.landlord}
							>
								{
									LANDLORDS.map((landlord, index) => <MenuItem key={index} value={landlord}>{landlord}</MenuItem>)
								}
							</TextField>

					<TextField variant="outlined" id="transaction_ref" type="text" name="transaction_ref" label="Transaction Ref" multiline	value={values.transaction_ref || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField label="Currency" variant="outlined" id="currency" type="select" name="currency" error={errors.currency && touched.currency} helperText={touched.currency && errors.currency}
								value={values.currency || ''} onChange={handleChange} onBlur={handleBlur} >
								{
									CURRENCY_OPTIONS.map((currency_option, index) => <MenuItem key={index} value={currency_option}>{currency_option}</MenuItem>)
								}
							</TextField>

							<TextField type="number" variant="outlined" name="transaction_price" id="transaction_price" label="Transaction Price" value={values.transaction_price || ''} onChange={handleChange} onBlur={handleBlur} error={errors.transaction_price && touched.transaction_price}
								helperText={touched.transaction_price && errors.transaction_price}
							/>
							<TextField variant="outlined" id="security_deposit" type="number" label="Security Deposit" name="security_deposit" value={values.security_deposit || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField variant="outlined" select name="payment_term" label="Payment Option" id="payment_term" onBlur={handleBlur} onChange={handleChange} value={values.payment_term || ''} required error={errors.payment_term && touched.payment_term}
								helperText={touched.payment_term && errors.payment_term}
							>
								{
									PAYMENT_OPTIONS.map((payment_term_option, index) => <MenuItem key={index} value={payment_term_option}>{payment_term_option}</MenuItem>)
								}
							</TextField>
							<TextField variant="outlined" id="commission" type="number" label="Commission" name="commission" value={values.commission || ''} onChange={handleChange} onBlur={handleBlur} />
					</Grid>
			{/* end of input fields grid and start of buttons grid */}
					<Grid item container justify="center" alignItems="space-evenly" direction="row" className={styles.buttonBox}>
								<Button color="secondary" variant="contained"
									size='medium' startIcon={<CancelIcon />}
									component={Link} to={`${match.url}`}
									disableElevation>Cancel</Button>
								<Button type="submit" color="primary" variant="contained" size='medium'
									startIcon={<SaveIcon />} form='contactInputForm' onClick={() => handleSubmit()} disabled={isSubmitting}>Save</Button>
					</Grid>
					</Grid>
					</Grid>
					</form>
			);
		}

		let TransactionInputForm = withFormik({
			mapPropsToValues: (props) => {
				let transactionToEditId = props.match.params.transactionId
				let transactionToEdit = props.transactions.find(({ id }) => id === transactionToEditId)
				if (!transactionToEdit) {
					transactionToEdit = {}
				}
				return {
					...transactionToEdit,
					match: props.match,
					error: props.error,
					submitForm: props.submitForm
				}
			},

			validate: values => {
				let errors = {};
				if (!values.lease_type) {
					errors.lease_type = 'Ref Required';
				}
				if (!values.currency) {
					errors.currency = 'currency is Required';
				}
				if (!values.tenant) {
					errors.tenant = 'Beds is Required';
				}
				if (!values.landlord) {
					errors.landlord = 'Baths is Required';
				}
				if (!values.payment_term) {
					errors.payment_term = 'Furnished is Required';
				}
				if (!values.transaction_type) {
					errors.transaction_type = 'Type is Required';
				}
				if (!values.view) {
					errors.view = 'view is Required';
				}
				return errors;
			},

			handleSubmit: (values, { resetForm }) => {
				window.alert('handleSubmitCalled')
				let transaction = {
					id: values.id,
					lease_renewal: values.lease_renewal,
					renewal_reminder: values.renewal_reminder,
					transaction_ref: values.transaction_ref,
					currency: values.currency,
					address_1: values.address_1,
					security_deposit: values.security_deposit,
					transaction_type: values.transaction_type,
					tenant: values.tenant,
					landlord: values.landlord,
            lease_start: values.lease_start,
            lease_end: values.lease_end,
            square_footage: values.square_footage,
			price: values.price,
			payment_term: values.payment_term,
			frequency: values.frequency,
			checks: values.checks,
			commission: values.commission,
			deposit: values.deposit,
			lease_type: values.lease_type,
            view: values.view,
            transaction_price: values.transaction_price
        }
        values.submitForm(transaction);
        resetForm({});
    },
    enableReinitialize: true,
    displayName: 'Transaction Input Form', // helps with React DevTools

})(InputForm);

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions, error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: transaction => {
            dispatch(handleItemFormSubmit(transaction, 'transactions'))
        },
    }
}


TransactionInputForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionInputForm)


export default withRouter(TransactionInputForm);

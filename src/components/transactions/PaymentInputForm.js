import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { connect } from "react-redux";
import { Formik, FieldArray } from "formik";
import {
	handleItemFormSubmit,
	handleDelete,
} from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";


const defaultDate = moment().format("YYYY-MM-DD");
const PropertySchema = Yup.object().shape({
	tenant: Yup.string().trim().required('Tenant is required'),
	memo: Yup.string().trim().max(65, 'Memo must be less than 65 characters').default(''),
	total_amount: Yup.number().typeError('Amount must be a number').required("Payment amount is required"),
	date: Yup.date().required('Payment Date is Required'),
	balances_payments: Yup.array().of(Yup.object().shape({
		account: Yup.string().trim().required("Account is required"),
		balance: Yup.number().typeError('Balance must be a number').required("Balance amount is required"),
		amount: Yup.number().typeError('Amount must be a number').required("Payment amount is required"),
	})).min(0).required('A balance to apply payment is required')
});


let PaymentInputForm = (props) => {
	let [propertyUnitsItems, setPropertyUnitsItems] = useState([]);
	const classes = commonStyles();
	const { currentUser, history, propertyUnits, contacts, propertyAccounts, handleItemSubmit } = props
	let paymentToEdit = typeof props.paymentToEdit !== 'undefined' ? props.paymentToEdit : {};

	const propertyValues = {
		id: paymentToEdit.id,
		total_amount: paymentToEdit.total_amount || "",
		date: paymentToEdit.date || defaultDate,
		memo: paymentToEdit.memo || "",
		tenant: paymentToEdit.tenant || "",
		balances_payments: paymentToEdit.balances_payments || []
	};

	useEffect(() => {
        const mappedPropertyUnits = propertyUnits.map((propertyUnit) => {
            const tenant = contacts.find(
                (contact) => contact.id === propertyUnit.tenants[0]
            );
            const propertyUnitDetails = {};
            propertyUnitDetails.tenant_name =
                typeof tenant !== "undefined"
                    ? tenant.first_name + " " + tenant.last_name
                    : "";
            return Object.assign({}, propertyUnit, propertyUnitDetails);
        });
        setPropertyUnitsItems(mappedPropertyUnits);
    }, [contacts, propertyUnits]);

	const CustomInputComponent = ({ remove, push, form }) => {
		const { errors, values, handleChange, handleBlur } = form
		const balancesPaymentsErrors = errors['balances_payments']
		const layout = values.balances_payments.map((balance_payment, balancePaymentIndex) =>
			<Grid key={`balance_payment-${balancePaymentIndex}`} container item direction="row" alignItems="center" spacing={2}>
				<Grid sm item key={`balances_payments[${balancePaymentIndex}].account`}>
					<TextField
						fullWidth
						label="Account"
						variant="outlined"
						select
						value={balance_payment.account}
						name={`balances_payments.${balancePaymentIndex}.account`}
						error={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && typeof balancesPaymentsErrors[balancePaymentIndex]['account'] !== 'undefined'}
						helperText={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && balancesPaymentsErrors[balancePaymentIndex].account}
						onChange={handleChange}
						onBlur={handleBlur}>
						{propertyAccounts.map((property_account, propertyAccountIndex) => (
							<MenuItem key={propertyAccountIndex} value={property_account}>
								{property_account}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid sm item key={`balances_payments[${balancePaymentIndex}].balance`}>
					<TextField
						fullWidth
						label="Balance (Ksh)"
						variant="outlined"
						type="text"
						value={balance_payment.balance}
						name={`balances_payments.${balancePaymentIndex}.balance`}
						error={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && typeof balancesPaymentsErrors[balancePaymentIndex]['balance'] !== 'undefined'}
						helperText={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && balancesPaymentsErrors[balancePaymentIndex].balance}
						onChange={handleChange}
						onBlur={handleBlur} />

				</Grid>
				<Grid sm item key={`balances_payments[${balancePaymentIndex}].amount`}>
					<TextField
						fullWidth
						label="Amount (Ksh)"
						variant="outlined"
						type="text"
						value={balance_payment.amount}
						name={`balances_payments.${balancePaymentIndex}.amount`}
						error={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && typeof balancesPaymentsErrors[balancePaymentIndex]['amount'] !== 'undefined'}
						helperText={'balances_payments' in errors && typeof balancesPaymentsErrors[balancePaymentIndex] !== 'undefined' && balancesPaymentsErrors[balancePaymentIndex].amount}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Grid>
				<Grid item key={`balances_payments[${balancePaymentIndex}].delete`}>
					<IconButton aria-label="delete"
						onClick={() => { remove(balancePaymentIndex) }}
						size="medium">
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>

		)
		return <Grid>
			{layout}
			<Button
				variant="outlined"
				size="medium"
				startIcon={<AddIcon/>}
				onClick={() => push({ account: '', balance: '', amount: '' })}
				disableElevation>
				Add Payment
			</Button>
		</Grid>
	}


	return (
		<Formik
			initialValues={propertyValues}
			enableReinitialize validationSchema={PropertySchema}
			onSubmit={(values, { resetForm }) => {
				let totalPayment = {
					id: values.id,
					amount: values.amount,
					memo: values.memo,
					date: values.date,
					tenant: values.tenant,
				};
				values.balances_payments.forEach(async (balance_payment) => {
					const balancePaymentToSave = Object.assign({}, balance_payment,
						{ tenant: values.tenant, date: values.date })
					await handleItemSubmit(currentUser, balancePaymentToSave, 'transactions')
				})
				resetForm({});
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
						id="propertyInputForm"
						onSubmit={handleSubmit}
					>
						<Grid container spacing={4} direction="row">
							<Grid sm={12} item>
								<TextField
									fullWidth
									variant="outlined"
									id="date"
									type="date"
									name="date"
									label="Payment Date"
									error={'date' in errors}
									helperText={errors.date}
									value={values.date}
									onChange={handleChange}
									onBlur={handleBlur}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									fullWidth
									type="text"
									error={'total_amount' in errors}
									helperText={errors.total_amount}
									variant="outlined"
									name="total_amount"
									id="total_amount"
									label="Payment Amount"
									value={values.total_amount}
									onChange={handleChange}
									onBlur={handleBlur} />
								<TextField
									fullWidth
									variant="outlined"
									select
									name="tenant"
									label="Received From"
									id="tenant"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.tenant}
									error={'tenant' in errors}
									helperText={
										errors.tenant
									}
								>
									{propertyUnitsItems.map((propertyUnitItem, index) => (
										<MenuItem key={index} value={propertyUnitItem.id}>
											{`${propertyUnitItem.tenant_name} - ${propertyUnitItem.ref}`}
										</MenuItem>
									))}
								</TextField>
								<TextField
									fullWidth
									variant="outlined"
									label="Memo"
									error={'memo' in errors}
									helperText={errors.memo || 'Will show "Payment" if left blank'}
									id="memo"
									type="text"
									name="memo"
									value={values.memo}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<Typography variant="subtitle1" paragraph>Apply Payment to Balances</Typography>
								<Grid item container direction="column">
									<FieldArray
										name="balances_payments"
										component={CustomInputComponent}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								container
								justify="center"
								direction="row"
								className={classes.buttonBox}
							>
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
									form="propertyInputForm"
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

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts,
		propertyUnits: state.propertyUnits,
		properties: state.properties,
		propertyAccounts: state.propertyAccounts,
		error: state.error,
		currentUser: state.currentUser,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (user, item, url) => dispatch(handleItemFormSubmit(user, item, url)),
	};
};

PaymentInputForm = connect(mapStateToProps, mapDispatchToProps)(PaymentInputForm);

export default withRouter(PaymentInputForm);

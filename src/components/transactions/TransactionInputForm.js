import React from "react";
import {
	TextField,
	MenuItem,
	Grid,
	Typography,
	Button,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import {
	getPaymentOptions,
	getTransactionTypes,
	getLeaseOptions,
} from "../../assets/commonAssets.js";
import moment from "moment";

const LEASE_OPTIONS = getLeaseOptions();
const TRANSACTION_TYPES = getTransactionTypes();
const PAYMENT_OPTIONS = getPaymentOptions();

const ASSIGNED_TO = ["Assinged To 1", "Assigned To 2", "Assigned To 3"];

const defaultDate = moment().format("YYYY-MM-DD");

let InputForm = ({
	values,
	touched,
	errors,
	handleChange,
	handleBlur,
	setFieldValue,
	handleSubmit,
	isSubmitting,
}) => {
	const styles = commonStyles();
	return (
		<form
			className={styles.form}
			method="post"
			id="transactionInputForm"
			onSubmit={handleSubmit}
		>
			<Grid container>
				<Grid
					container
					spacing={4}
					justify="center"
					alignItems="flex-start"
					direction="row"
				>
					<Grid
						lg={6}
						justify="center"
						container
						item
						direction="column"
					>
						<Typography variant="h6">
							{" "}
							Transaction Information{" "}
						</Typography>
						<TextField
							variant="outlined"
							select
							name="property"
							label="Property For Transaction"
							id="property"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.property}
							error={errors.property && touched.property}
							helperText={touched.property && errors.property}
						>
							{values.properties.map((property, index) => (
								<MenuItem key={index} value={property.id}>
									{property.ref}
								</MenuItem>
							))}
						</TextField>

						<TextField
							error={errors.assigned_to && touched.assigned_to}
							helperText={
								touched.assigned_to && errors.assigned_to
							}
							variant="outlined"
							type="select"
							name="assigned_to"
							id="assigned_to"
							label="Assigned To"
							value={values.assigned_to}
							onChange={handleChange}
							onBlur={handleBlur}
						>
							{/** substitute for users that can be assigned to here **/}
							{ASSIGNED_TO.map((assigned_to, index) => (
								<MenuItem key={index} value={assigned_to}>
									{assigned_to}
								</MenuItem>
							))}
						</TextField>
						<TextField
							label="Transaction Date"
							variant="outlined"
							id="transaction_date"
							type="date"
							name="transaction_date"
							error={
								errors.transaction_date &&
								touched.transaction_date
							}
							helperText={
								touched.transaction_date &&
								errors.transaction_date
							}
							value={values.transaction_date}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							variant="outlined"
							select
							name="transaction_type"
							label="Transaction Type"
							id="transaction_type"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.transaction_type}
							error={
								errors.transaction_type &&
								touched.transaction_type
							}
							helperText={
								touched.transaction_type &&
								errors.transaction_type
							}
						>
							{TRANSACTION_TYPES.map(
								(transaction_type, index) => (
									<MenuItem
										key={index}
										value={transaction_type}
									>
										{transaction_type}
									</MenuItem>
								)
							)}
						</TextField>
						<TextField
							error={errors.lease_type && touched.lease_type}
							helperText={touched.lease_type && errors.lease_type}
							variant="outlined"
							select
							name="lease_type"
							id="lease_type"
							label="Lease Type"
							value={values.lease_type}
							onChange={handleChange}
							onBlur={handleBlur}
						>
							{LEASE_OPTIONS.map((lease_type, index) => (
								<MenuItem key={index} value={lease_type}>
									{lease_type}
								</MenuItem>
							))}
						</TextField>

						<TextField
							variant="outlined"
							id="lease_start"
							name="lease_start"
							label="Lease Start"
							type="date"
							value={values.lease_start}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							variant="outlined"
							id="lease_end"
							label="Lease End"
							type="date"
							name="lease_end"
							value={values.lease_end}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							variant="outlined"
							id="lease_renewal"
							label="Lease Renewal"
							type="date"
							name="lease_renewal"
							value={values.lease_renewal}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							variant="outlined"
							id="renewal_reminder"
							label="Reminder Date"
							type="date"
							name="renewal_reminder"
							value={values.renewal_reminder}
							onChange={handleChange}
							onBlur={handleBlur}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid
						lg={6}
						justify="center"
						container
						item
						direction="column"
					>
						<Typography variant="h6">
							{" "}
							Payment Information{" "}
						</Typography>

						<TextField
							variant="outlined"
							select
							name="tenant"
							label="Tenant"
							id="tenant"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.tenant}
							error={errors.tenant && touched.tenant}
							helperText={touched.tenant && errors.tenant}
						>
							{values.contacts.map((tenant, index) => (
								<MenuItem key={index} value={tenant.id}>
									{tenant.first_name + tenant.last_name}
								</MenuItem>
							))}
						</TextField>
						<TextField
							variant="outlined"
							select
							name="landlord"
							label="LandLord"
							id="landlord"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.landlord}
							error={errors.landlord && touched.landlord}
							helperText={touched.landlord && errors.landlord}
						>
							{values.contacts.map((landlord, index) => (
								<MenuItem key={index} value={landlord.id}>
									{landlord.first_name + landlord.last_name}
								</MenuItem>
							))}
						</TextField>

						<TextField
							variant="outlined"
							id="transaction_ref"
							type="text"
							name="transaction_ref"
							label="Transaction Ref"
							multiline
							value={values.transaction_ref}
							onChange={handleChange}
							onBlur={handleBlur}
							helperText={"eg Mpesa or Bank transaction code"}
						/>

						<TextField
							type="number"
							variant="outlined"
							name="transaction_price"
							id="transaction_price"
							label="Transaction Price"
							value={values.transaction_price}
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								errors.transaction_price &&
								touched.transaction_price
							}
							helperText={
								touched.transaction_price &&
								errors.transaction_price
							}
						/>
						<TextField
							variant="outlined"
							id="security_deposit"
							type="number"
							label="Security Deposit"
							name="security_deposit"
							value={values.security_deposit}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<TextField
							variant="outlined"
							select
							name="payment_term"
							label="Payment Option"
							id="payment_term"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.payment_term}
							error={errors.payment_term && touched.payment_term}
							helperText={
								touched.payment_term && errors.payment_term
							}
						>
							{PAYMENT_OPTIONS.map(
								(payment_term_option, index) => (
									<MenuItem
										key={index}
										value={payment_term_option}
									>
										{payment_term_option}
									</MenuItem>
								)
							)}
						</TextField>
						<TextField
							variant="outlined"
							id="company_commission"
							type="number"
							label="Company Commission"
							name="company_commission"
							value={values.company_commission}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<TextField
							variant="outlined"
							id="agent_commission"
							type="number"
							label="Agent Commission"
							name="agent_commission"
							value={values.agent_commission}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Grid>
					{/* end of input fields grid and start of buttons grid */}
					<Grid
						item
						container
						justify="center"
						direction="row"
						className={styles.buttonBox}
					>
						<Button
							color="secondary"
							variant="contained"
							size="medium"
							startIcon={<CancelIcon />}
							onClick={() => values.history.goBack()}
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
							form="contactInputForm"
							onClick={() => handleSubmit()}
							disabled={isSubmitting}
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</form>
	);
};

let TransactionInputForm = withFormik({
	mapPropsToValues: (props) => {
		let transactionToEditId = props.match.params.transactionId;
		let transactionToEdit = props.transactions.find(
			({ id }) => id === transactionToEditId
		);
		if (!transactionToEdit) {
			transactionToEdit = {};
		}
		return {
			id: transactionToEdit.id || null,
			property: transactionToEdit.property || "",
			tenant: transactionToEdit.tenant || "",
			lease_renewal: transactionToEdit.lease_renewal || defaultDate,
			renewal_reminder: transactionToEdit.renewal_reminder || defaultDate,
			transaction_ref: transactionToEdit.transaction_ref || "",
			transaction_date: transactionToEdit.transaction_date || defaultDate,
			security_deposit: transactionToEdit.security_deposit || 0,
			transaction_type: transactionToEdit.transaction_type || "",
			landlord: transactionToEdit.landlord || "",
			lease_start: transactionToEdit.lease_start || defaultDate,
			lease_end: transactionToEdit.lease_end || defaultDate,
			payment_term: transactionToEdit.payment_term || "",
			deposit: transactionToEdit.deposit || 0,
			agent_commission: transactionToEdit.agent_commission || 0,
			company_commission: transactionToEdit.company_commission || 0,
			lease_type: transactionToEdit.lease_type || "",
			transaction_price: transactionToEdit.transaction_price || 0,
			properties: props.properties,
			contacts: props.contacts,
			match: props.match,
			history: props.history,
			error: props.error,
			submitForm: props.submitForm,
		};
	},

	validate: (values) => {
		let errors = {};
		if (!values.property) {
			errors.property = "Property for Transaction is Required";
		}
		if (!values.lease_type) {
			errors.lease_type = "Lease Type is Required";
		}
		if (!values.transaction_date) {
			errors.transaction_date = "Transaction Date is Required";
		}
		if (!values.transaction_price) {
			errors.transaction_price = "Transaction Price is Required";
		}
		if (!values.tenant) {
			errors.tenant = "Tenant is Required";
		}
		if (!values.landlord) {
			errors.landlord = "Landlord is Required";
		}
		if (!values.transaction_type) {
			errors.transaction_type = "Transaction Type is Required";
		}
		return errors;
	},

	handleSubmit: (values, { resetForm }) => {
		let transaction = {
			id: values.id,
			property: values.property,
			lease_renewal: values.lease_renewal,
			renewal_reminder: values.renewal_reminder,
			transaction_ref: values.transaction_ref,
			transaction_date: values.transaction_date,
			security_deposit: values.security_deposit,
			transaction_type: values.transaction_type,
			tenant: values.tenant,
			landlord: values.landlord,
			lease_start: values.lease_start,
			lease_end: values.lease_end,
			payment_term: values.payment_term,
			agent_commission: values.agent_commission || 0,
			company_commission: values.company_commission || 0,
			deposit: values.deposit,
			lease_type: values.lease_type,
			transaction_price: values.transaction_price,
		};
		handleItemFormSubmit(transaction, "transactions").then((response) => {
			console.log('Saved transaction successfully => ', response)
		});
		resetForm({});
		if (values.id) {
			values.history.goBack();
		}
	},
	enableReinitialize: true,
	displayName: "Transaction Input Form", // helps with React DevTools
})(InputForm);

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts,
		properties: state.properties,
		transactions: state.transactions,
		error: state.error,
	};
};

TransactionInputForm = connect(mapStateToProps)(TransactionInputForm);

export default withRouter(TransactionInputForm);

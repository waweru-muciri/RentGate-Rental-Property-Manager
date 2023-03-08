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
import { Formik } from "formik";
import { handleItemFormSubmit } from "../../actions/actions";
import { commonStyles } from "../../components/commonStyles";
import { withRouter } from "react-router-dom";
import {
	getPaymentOptions,
	getLeaseOptions,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import moment from "moment";


const LEASE_OPTIONS = getLeaseOptions();
const PAYMENT_OPTIONS = getPaymentOptions();
const defaultDate = moment().format("YYYY-MM-DD");

const TransactionSchema = Yup.object().shape({
	assigned_to: Yup.string().trim().required('Assigned To is Required'),
	payment_term: Yup.string().trim().required("Payment Term is Required"),
	transaction_ref: Yup.string().trim().required("Transaction Ref is Required"),
	landlord: Yup.string().trim().required("Landlord is Required"),
	tenant: Yup.string().trim().required("Tenant is Required"),
	transaction_price: Yup.number().min(0).required("Transaction Price is Required"),
	security_deposit: Yup.number().min(0).default(0),
	agent_commission: Yup.number().min(0).default(0),
	company_commission: Yup.number().min(0).default(0),
	transaction_date: Yup.date().required("Transaction Date is Required").default(defaultDate),
	lease_start: Yup.date().required("Lease Start Date is Required").default(defaultDate),
	lease_end: Yup.date(),
	property: Yup.string().trim().required("Property is Required"),
	lease_type: Yup.string().trim().required("Lease Type is Required"),
});


let TransactionInputForm = (props) => {
	const styles = commonStyles();
	const { users, currentUser, properties, contacts, history, handleItemSubmit } = props
	let transactionToEdit = typeof props.transactionToEdit !== 'undefined' ? props.transactionToEdit : {}
	const transactionValues = {
		id: transactionToEdit.id,
		property: transactionToEdit.property || "",
		tenant: transactionToEdit.tenant || "",
		lease_renewal: transactionToEdit.lease_renewal || defaultDate,
		renewal_reminder: transactionToEdit.renewal_reminder || defaultDate,
		transaction_ref: transactionToEdit.transaction_ref || "",
		transaction_date: transactionToEdit.transaction_date || defaultDate,
		security_deposit: transactionToEdit.security_deposit || 0,
		landlord: transactionToEdit.landlord || "",
		lease_start: transactionToEdit.lease_start || defaultDate,
		lease_end: transactionToEdit.lease_end || defaultDate,
		payment_term: transactionToEdit.payment_term || "",
		agent_commission: transactionToEdit.agent_commission || 0,
		company_commission: transactionToEdit.company_commission || 0,
		lease_type: transactionToEdit.lease_type || "",
		transaction_price: transactionToEdit.transaction_price || 0,
	};
	return (
		<Formik
			initialValues={transactionValues}
			enableReinitialize
			validationSchema={TransactionSchema}
			onSubmit={(values, { resetForm }) => {
				let transaction = {
					id: values.id,
					property: values.property,
					lease_renewal: values.lease_renewal,
					renewal_reminder: values.renewal_reminder,
					transaction_ref: values.transaction_ref,
					transaction_date: values.transaction_date,
					security_deposit: values.security_deposit,
					tenant: values.tenant,
					landlord: values.landlord,
					lease_start: values.lease_start,
					lease_end: values.lease_end,
					payment_term: values.payment_term,
					agent_commission: values.agent_commission || 0,
					company_commission: values.company_commission || 0,
					lease_type: values.lease_type,
					transaction_price: values.transaction_price,
				};
				handleItemSubmit(transaction, "transactions").then((response) => {
					console.log('Saved transaction successfully => ', response)
				});
				resetForm({});
				if (values.id) {
					history.goBack();
				}

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
										Transaction Information
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
										error={'property' in errors}
										helperText={errors.property}
									>
										{properties.map((property, index) => (
											<MenuItem key={index} value={property.id}>
												{property.ref}
											</MenuItem>
										))}
									</TextField>

									<TextField
										error={'assigned_to' in errors}
										helperText={
											errors.assigned_to
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
										{users.map((user, index) => (
											<MenuItem key={index} value={user.id}>
												{user.first_name + " " + user.last_name}
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
											'transaction_date' in errors}
										helperText={
											errors.transaction_date
										}
										value={values.transaction_date}
										onChange={handleChange}
										onBlur={handleBlur}
										InputLabelProps={{ shrink: true }}
									/>
									<TextField
										error={'lease_type' in errors}
										helperText={errors.lease_type}
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
										error={'lease_start' in errors}
										helperText={errors.lease_start}				
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

										Payment Information
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
										error={'tenant' in errors}
										helperText={errors.tenant}
									>
										{contacts.map((tenant, index) => (
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
										error={'landlord' in errors}
										helperText={errors.landlord}
									>
										{users.map((landlord, index) => (
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
										error={'transaction_ref' in errors}
										helperText={"eg Mpesa or Bank transaction code"}
									/>

									<TextField
										variant="outlined"
										name="transaction_price"
										id="transaction_price"
										label="Transaction Price"
										value={values.transaction_price}
										onChange={handleChange}
										onBlur={handleBlur}
										error={
											'transaction_price' in errors
										}
										helperText={
											errors.transaction_price
										}
									/>
									<TextField
										variant="outlined"
										id="security_deposit"
										label="Security Deposit"
										name="security_deposit"
										value={values.security_deposit}
										onChange={handleChange}
										onBlur={handleBlur}										
										error={'security_deposit' in errors}
										helperText={
											errors.security_deposit
										}
	
									/>
									<TextField
										variant="outlined"
										select
										name="payment_term"
										label="Payment Term"
										id="payment_term"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.payment_term}
										error={'payment_term' in errors}
										helperText={
											errors.payment_term
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
										label="Company Commission"
										name="company_commission"
										value={values.company_commission}
										onChange={handleChange}
										onBlur={handleBlur}
										error={
											'company_commission' in errors
										}
										helperText={
											errors.company_commission
										}

									/>
									<TextField
										variant="outlined"
										id="agent_commission"
										label="Agent Commission"
										name="agent_commission"
										value={values.agent_commission}
										onChange={handleChange}
										onBlur={handleBlur}
										error={
											'agent_commission' in errors
										}
										helperText={
											errors.agent_commission
										}
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
										form="transactionInputForm"
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

const mapStateToProps = (state) => {
	return {
		users: state.users,
		currentUser: state.currentUser,
		contacts: state.contacts,
		properties: state.properties,
		transactions: state.transactions,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

TransactionInputForm = connect(mapStateToProps, mapDispatchToProps)(TransactionInputForm);

export default withRouter(TransactionInputForm);

import React from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import AccountSettings from "../components/users/AccountSettingsInputForm";
import { withRouter } from "react-router-dom";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Button from "@material-ui/core/Button";
import TabPanel from "../components/TabPanel";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import CommonTable from "../components/table/commonTable";
import { commonStyles } from "../components/commonStyles";
import { handleItemFormSubmit } from '../actions/actions'
import { Formik } from "formik";
import * as Yup from "yup";


const CompanyInfoSchema = Yup.object().shape({
	company_name: Yup.string().trim(),
	company_address: Yup.string().trim(),
	company_phone_number: Yup.string().trim(),
	company_other_phone_number: Yup.string().trim(),
	company_primary_email: Yup.string().trim().email("Invalid Email"),
	company_other_email: Yup.string().trim().email("Invalid Email"),
});

const BillingInfoSchema = Yup.object().shape({
	billing_company: Yup.string().trim(),
	billing_address: Yup.string().trim(),
	billing_phone_number: Yup.string().trim(),
	billing_email: Yup.string().trim().email("Invalid Email"),
});

const billingTableHeadCells = [
	{ id: "billing_date", numeric: false, disablePadding: true, label: "Billing Date" },
	{ id: "invoice_number", numeric: false, disablePadding: true, label: "Invoice Number" },
	{ id: "amount", numeric: false, disablePadding: true, label: "Billed Amount" },

];


let AccountSettingsPage = ({ userToShow, accountBillings, companyProfile, handleItemSubmit }) => {
	let classes = commonStyles();
	const CompanyInfoInitialValues = {
		id: companyProfile.id,
		company_name: companyProfile.company_name || "",
		company_address: companyProfile.company_address || "",
		company_phone_number: companyProfile.company_phone_number || '',
		company_other_phone_number: companyProfile.company_other_phone_number || '',
		company_primary_email: companyProfile.company_primary_email || '',
		company_other_email: companyProfile.company_other_email || '',
	}

	const BillingInfoInitialValues = {
		id: companyProfile.id,
		billing_address: companyProfile.billing_address || companyProfile.company_address || "",
		billing_company: companyProfile.billing_company || companyProfile.company_name || "",
		billing_phone_number: companyProfile.billing_phone_number || companyProfile.company_phone_number || '',
		billing_email: companyProfile.billing_email || companyProfile.company_primary_email || '',
	}

	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<Layout pageTitle={"Account Details"}>
			<AppBar position="static">
				<Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
					<Tab label="Account Details" />
					<Tab label="Company Details" />
					<Tab label="Billing &amp; Payments" />
				</Tabs>
			</AppBar>
			<TabPanel value={tabValue} index={0}>
				<Grid container justify="center" direction="column">
					<Grid item >
						<Typography variant="h6">Account Details</Typography>
					</Grid>
					<Grid
						container
						direction="column"
						justify="center"
						item
					>
						<AccountSettings userToShow={userToShow} handleItemSubmit={handleItemSubmit} />
					</Grid>
				</Grid>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<Grid container justify="center" direction="column">
					<Grid item>
						<Typography variant="h6">Company Information</Typography>
					</Grid>
					<Grid
						container
						direction="column"
						justify="center"
						item
					>

						<Formik
							initialValues={CompanyInfoInitialValues}
							enableReinitialize
							validationSchema={CompanyInfoSchema}
							onSubmit={async (values, { resetForm }) => {
								const companyInfoValues = {
									id: values.id,
									company_address: values.company_address,
									company_name: values.company_name,
									company_primary_email: values.company_primary_email,
									company_phone_number: values.company_phone_number,
									company_other_phone_number: values.company_other_phone_number,
									company_other_email: values.company_other_email,
								};
								await handleItemSubmit(companyInfoValues, "company_profile")
								resetForm({});
							}}
						>
							{({
								values,
								touched,
								errors,
								handleChange,
								handleBlur,
								handleSubmit,
								isSubmitting,
							}) => (
								<form
									className={classes.form}
									method="post"
									id="companyInfoForm"
									noValidate
									onSubmit={handleSubmit}
								>
									<Grid
										container
										justify="center"
										alignItems="center"
										direction="column"
									>
										<Grid
											justify="center"
											container
											item
											direction="column"
										>
											<Grid item container direction="row" spacing={2}>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_name"
														label="Company Name"
														id="company_name"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_name}
														error={errors.company_name && touched.company_name}
														helperText={touched.company_name && errors.company_name}
													/>
												</Grid>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_address"
														label="Company Address"
														id="company_address"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_address}
														error={errors.company_address && touched.company_address}
														helperText={touched.company_address && errors.company_address}
													/>
												</Grid>
											</Grid>
											<Grid item container direction="row" spacing={2}>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_phone_number"
														label="Company Phone Number"
														id="company_phone_number"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_phone_number}
														error={errors.company_phone_number && touched.company_phone_number}
														helperText={touched.company_phone_number && errors.company_phone_number}
													/>
												</Grid>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_other_phone_number"
														label="Other Phone Number"
														id="company_other_phone_number"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_other_phone_number}
														error={errors.company_other_phone_number && touched.company_other_phone_number}
														helperText={touched.company_other_phone_number && errors.company_other_phone_number}
													/>
												</Grid>
											</Grid>
											<Grid item container direction="row" spacing={2}>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_primary_email"
														label="Company Primary Email"
														id="company_primary_email"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_primary_email}
														error={errors.company_primary_email && touched.company_primary_email}
														helperText={touched.company_primary_email && errors.company_primary_email}
													/>
												</Grid>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="company_other_email"
														label="Company Other Email"
														id="company_other_email"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.company_other_email}
														error={errors.company_other_email && touched.company_other_email}
														helperText={touched.company_other_email && errors.company_other_email}
													/>
												</Grid>
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
													type="submit"
													variant="outlined"
													size="medium"
													startIcon={<SaveIcon />}
													form="companyInfoForm"
													disabled={isSubmitting}
												>
													Update
									    			</Button>
											</Grid>
										</Grid>
									</Grid>
								</form>
							)}
						</Formik>
					</Grid>
				</Grid>
			</TabPanel>
			<TabPanel value={tabValue} index={2}>
				<Grid container justify="center" direction="column" spacing={2}>
					<Grid item>
						<Typography>Billing Info</Typography>
					</Grid>
					<Grid
						container
						direction="column"
						justify="center"
						item
					>

						<Formik
							initialValues={BillingInfoInitialValues}
							enableReinitialize
							validationSchema={BillingInfoSchema}
							onSubmit={async (values, { resetForm }) => {
								const billingInfoValues = {
									id: values.id,
									billing_address: values.billing_address,
									billing_company: values.billing_company,
									billing_email: values.billing_email,
									billing_phone_number: values.billing_phone_number,
								};
								await handleItemSubmit(billingInfoValues, "company_profile")
								resetForm({});
							}}
						>
							{({
								values,
								touched,
								errors,
								handleChange,
								handleBlur,
								handleSubmit,
								isSubmitting,
							}) => (
								<form
									className={classes.form}
									method="post"
									id="billingInfoForm"
									noValidate
									onSubmit={handleSubmit}
								>
									<Grid
										container
										justify="center"
										alignItems="center"
										direction="column"
									>
										<Grid
											justify="center"
											container
											item
											direction="column"
										>
											<Grid item container direction="row" spacing={2}>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="billing_address"
														label="Billing Address"
														id="billing_address"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.billing_address}
														error={errors.billing_address && touched.billing_address}
														helperText={touched.billing_address && errors.billing_address}
													/>
												</Grid>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="billing_company"
														label="Company Name"
														id="billing_company"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.billing_company}
														error={errors.billing_company && touched.billing_company}
														helperText={touched.billing_company && errors.billing_company}
													/>
												</Grid>
											</Grid>
											<Grid item container direction="row" spacing={2}>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="billing_phone_number"
														label="Phone Number"
														id="billing_phone_number"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.billing_phone_number}
														error={errors.billing_phone_number && touched.billing_phone_number}
														helperText={touched.billing_phone_number && errors.billing_phone_number}
													/>
												</Grid>
												<Grid item xs={12} sm>
													<TextField
														fullWidth
														variant="outlined"
														name="billing_email"
														label="Email Address"
														id="billing_email"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.billing_email}
														error={errors.billing_email && touched.billing_email}
														helperText={touched.billing_email && errors.billing_email}
													/>
												</Grid>
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
													type="submit"
													variant="outlined"
													size="medium"
													startIcon={<SaveIcon />}
													form="billingInfoForm"
													disabled={isSubmitting}
												>
													Update
									    			</Button>
											</Grid>
										</Grid>
									</Grid>
								</form>
							)}
						</Formik>
					</Grid>
					<Grid item>
						<Typography>Billing History</Typography>
					</Grid>
					<Grid item xs={12}>
						<CommonTable
							selected={[]}
							setSelected={() => { }}
							rows={accountBillings}
							headCells={billingTableHeadCells}
							noDeleteCol
							noEditCol
						/>
					</Grid>
				</Grid>
			</TabPanel>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		userToShow: state.users.find(({ id }) => id === state.currentUser.id) || { id: state.currentUser.id },
		companyProfile: state.companyProfile[0] || {},
		accountBillings: state.accountBillings,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, itemUrl) => dispatch(handleItemFormSubmit(item, itemUrl)),
	};
};


AccountSettingsPage = connect(mapStateToProps, mapDispatchToProps)(AccountSettingsPage);

export default withRouter(AccountSettingsPage);

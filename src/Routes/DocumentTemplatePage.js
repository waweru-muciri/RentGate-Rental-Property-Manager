import React from "react";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Typography from "@material-ui/core/Typography";
import CustomSnackbar from '../components/CustomSnackbar'
import { Formik } from "formik";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import { commonStyles } from "../components/commonStyles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
	handleItemFormSubmit,
} from "../actions/actions";
import * as Yup from "yup";

const TemplateSchema = Yup.object().shape({
	template_name: Yup.string().trim().required("Template Name is Required"),
	template_contents: Yup.string().trim().required("Template Content is Required"),
});

const quillEditorModules = {
	toolbar: [
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
		[{ size: [] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[{ 'list': 'ordered' }, { 'list': 'bullet' },
		{ 'indent': '-1' }, { 'indent': '+1' }],
		['link', 'image', 'video'],
		['clean']
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	}
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const quillEditorFormats = [
	'header', 'font', 'size',
	'bold', 'italic', 'underline', 'strike', 'blockquote',
	'list', 'bullet', 'indent',
	'link', 'image', 'video'
]

let DocumentTemplatePage = ({ emailTemplateToEdit, history, handleItemSubmit }) => {

	const templateValues = {
		id: emailTemplateToEdit.id,
		template_name: emailTemplateToEdit.template_name || '',
		template_contents: emailTemplateToEdit.template_contents || '',
	}

	let pageTitle = emailTemplateToEdit.id ? "Edit Template" : "New Template";
	let classes = commonStyles();

	return (
		<Layout pageTitle="Template Details">
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
					<Grid item>
						<Formik
							initialValues={templateValues}
							validationSchema={TemplateSchema}
							onSubmit={async (values, { resetForm, setStatus }) => {
								const templateDetails = {
									id: values.id,
									template_name: values.template_name,
									last_edit: new Date().toLocaleString(),
									template_contents: values.template_contents,
								};
								try {
									await handleItemSubmit(templateDetails, "email-templates")
									resetForm({});
									if (values.id) {
										history.goBack();
									}
									setStatus({ sent: true, msg: "Template saved successfully!" })
								} catch (error) {
									setStatus({ sent: false, msg: `Error! ${error}.` })
								}
							}}
						>
							{({
								values,
								status,
								handleSubmit,
								isSubmitting,
								touched,
								setFieldValue,
								errors,
								handleChange,
								handleBlur,
							}) => (
									<form
										className={classes.form}
										method="post"
										id="templateInputForm"
										onSubmit={handleSubmit}
									>
										<Grid
											container
											spacing={2}
											justify="center"
											alignItems="stretch"
											direction="column"
										>
											{
												status && status.msg && (
													<CustomSnackbar
														variant={status.sent ? "success" : "error"}
														message={status.msg}
													/>
												)
											}
											<Grid item container spacing={2} alignItems="stretch" direction="column">
												<Grid item>
													<TextField
														fullWidth
														InputLabelProps={{ shrink: true }}
														variant="outlined"
														id="template_name"
														name="template_name"
														label="Template Name"
														value={values.template_name}
														onChange={handleChange}
														onBlur={handleBlur}
														error={
															errors.template_name && touched.template_name
														}
														helperText={
															touched.template_name && errors.template_name
														}
													/>
												</Grid>
												<Grid item>
													<Typography variant='body1' paragraph>Template Contents</Typography>
													<ReactQuill
														className={classes.quillEditor}
														value={values.template_contents}
														onChange={(content) => {
															setFieldValue('template_contents', content)
														}}
														theme="snow"
														modules={quillEditorModules}
														formats={quillEditorFormats} >
													</ReactQuill>
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
														form="templateInputForm"
														disabled={isSubmitting}
													>
														Save
													</Button>
												</Grid>
											</Grid >
										</Grid>
									</form>
								)}
						</Formik>
					</Grid>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		emailTemplateToEdit: state.emailTemplates.find(({ id }) => id === ownProps.match.params.templateId) || {},
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};


DocumentTemplatePage = connect(mapStateToProps, mapDispatchToProps)(DocumentTemplatePage);

export default withRouter(DocumentTemplatePage);

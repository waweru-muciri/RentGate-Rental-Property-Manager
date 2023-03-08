import React from 'react'
import { Select, Chip, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton, Box, Button, TextField, MenuItem, Grid, Typography, FormGroup, FormControlLabel, Checkbox,} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { connect } from 'react-redux'
import { withFormik } from "formik";
import { handleItemFormSubmit } from '../../actions/actions'
import { commonStyles }  from "../../components/commonStyles";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { getPropertyTypes, getPropertyBeds, getPropertyBaths, getCheckOptions, getFrequencyOptions, getLeaseOptions, getFurnishedOptions, getCurrencyOptions, } from '../../assets/commonAssets.js';

const PROPERTY_TYPES = getPropertyTypes();

const PROPERTY_BEDS = getPropertyBeds();

const PROPERTY_BATHS = getPropertyBaths();

const CHECKS_OPTIONS = getCheckOptions();

const FREQUENCY_OPTIONS = getFrequencyOptions();

const LEASE_OPTIONS = getLeaseOptions();

const FURNISHED_OPTIONS = getFurnishedOptions();

const CURRENCY_OPTIONS = getCurrencyOptions();

//this data will be retrieved from the server
const TENANTS = ['Tenant 1', 'Tenant 2', 'Tenant 3']

const OWNERS = []

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
	const [uploadedPropertyImages, setUploadedPropertyImages] = React.useState([]);
	const classes = commonStyles()
    return (
            <form className={ classes.form} method="post" id="propertyInputForm" onSubmit={handleSubmit}>
               		 <Grid container spacing={4} direction="row">
					 <Grid sm={6} item direction="column">
								<Typography variant="h6">
											Property Address & Details
								</Typography>
							<TextField fullWidth required error={errors.assigned_to && touched.assigned_to} helperText={touched.assigned_to && errors.assigned_to} variant="outlined" type="text" name="assigned_to" id="assigned_to" label="Assigned To"  value={values.assigned_to || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth required error={errors.ref && touched.ref} helperText={touched.ref && errors.ref} variant="outlined" type="text" name="ref" id="ref" label="Ref"  value={values.ref || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" select name="property_type" label="Type" id="property_type" onBlur={handleBlur} onChange={handleChange} value={values.property_type|| ''} required error={errors.property_type && touched.property_type}
										helperText={touched.property_type && errors.property_type}
									>
										{
											PROPERTY_TYPES.map((property_type, index) => <MenuItem key={index} value={property_type}>{property_type}</MenuItem>)
										}
							</TextField>
							<TextField fullWidth variant="outlined" select name="beds" label="Beds" id="beds" onBlur={handleBlur} onChange={handleChange} value={values.beds || ''} required error={errors.beds && touched.beds}
										helperText={touched.beds && errors.beds}
									>
										{
											PROPERTY_BEDS.map((property_bed, index) => <MenuItem key={index} value={property_bed}>{property_bed}</MenuItem>)
										}
							</TextField>
											<TextField fullWidth variant="outlined" select name="baths" label="Baths" id="baths" onBlur={handleBlur} onChange={handleChange} value={values.baths || ''} required error={errors.baths && touched.baths}
												helperText={touched.baths && errors.baths}
											>
												{
													PROPERTY_BATHS.map((property_bath, index) => <MenuItem key={index} value={property_bath}>{property_bath}</MenuItem>)
												}
							</TextField>
							<TextField fullWidth variant="outlined" id="country" name="country" label="Country" 
								value={values.country || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" id="region" label="Region" type="text" name="region"
								value={values.region || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" id="city" type="text" name="city" label="City"
								value={values.city || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth label="Postal Code" variant="outlined" id="Postal Code" type="text" name="Postal Code" error={errors.postal_code && touched.postal_code}
								helperText={touched.postal_code && errors.postal_code}
								value={values.postal_code || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" label="Address 1" id="Address 1" type="text" name="Address 1"
								value={values.address_1 || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" name="address_2" id="address_2" label="Address 2" value={values.address_2 || ''} onChange={handleChange} onBlur={handleBlur} error={errors.address_2 && touched.address_2}
								helperText={touched.address_2 && errors.address_2}
							/>
							<TextField fullWidth variant="outlined" id="floor" type="number" label="Floor" name="floor" value={values.floor || ''} onChange={handleChange} onBlur={handleBlur} />
							<TextField fullWidth variant="outlined" type="number" step="100" name="square_footage" id="square_footage" label="Square Footage" value={values.square_footage || 0} onChange={handleChange} onBlur={handleBlur} error={errors.square_footage && touched.square_footage}
								helperText={touched.square_footage && errors.square_footage}
							/>
							<TextField fullWidth variant="outlined" id="view" type="text" label="View" name="view" required value={values.view || ''} onChange={handleChange} onBlur={handleBlur} error={errors.view && touched.view}
								helperText={touched.view && errors.view}
							/>
							<TextField fullWidth variant="outlined" select name="furnished" label="Furnished" id="furnished" onBlur={handleBlur} onChange={handleChange} value={values.furnished || ''} required error={errors.furnished && touched.furnished}
								helperText={touched.furnished && errors.furnished}
							>
								{
									FURNISHED_OPTIONS.map((furnished_option, index) => <MenuItem key={index} value={furnished_option}>{furnished_option}</MenuItem>)
								}
							</TextField>
							<TextField fullWidth variant="outlined" select name="currency" label="Currency" id="currency" onBlur={handleBlur} onChange={handleChange} value={values.currency || ''} required error={errors.currency && touched.currency}
								helperText={touched.currency && errors.currency}
							>
								{
									CURRENCY_OPTIONS.map((furnished_option, index) => <MenuItem key={index} value={furnished_option}>{furnished_option}</MenuItem>)
								}
							</TextField>
							<TextField fullWidth variant="outlined" id="price" type="number" label="price" name="price" required value={values.price || ''} onChange={handleChange} onBlur={handleBlur} error={errors.price && touched.price}
								helperText={touched.price && errors.price}
							/>
							<TextField fullWidth variant="outlined" id="sqm_price" disabled label="Price/Sqm" name="sqm_price" value={values.sqm_price || ''} onChange={handleChange} onBlur={handleBlur} error={errors.sqm_price && touched.sqm_price } 
								helperText={touched.price && errors.price}
/>
							<TextField fullWidth variant="outlined" select name="frequency" label="Frequency" id="frequency" onBlur={handleBlur} onChange={handleChange} value={values.frequency || ''} required error={errors.frequency && touched.frequency}
								helperText={touched.frequency && errors.frequency}
							>
								{
									FREQUENCY_OPTIONS.map((frequency_option, index) => <MenuItem key={index} value={frequency_option}>{frequency_option}</MenuItem>)
								}
							</TextField>
							<TextField fullWidth variant="outlined" select name="checks" label="Checks" id="checks" onBlur={handleBlur} onChange={handleChange} value={values.checks || ''} required error={errors.checks && touched.checks}
								helperText={touched.checks && errors.checks}
							>
								{
								CHECKS_OPTIONS.map((check_option, index) => <MenuItem key={index} value={check_option}>{check_option}</MenuItem>)
								}
							</TextField>
							<TextField fullWidth variant="outlined" id="commission" type="number" label="Commission" name="commission" required value={values.commission || ''} onChange={handleChange} onBlur={handleBlur} error={errors.commission && touched.commission}
								helperText={touched.commission && errors.commission}
							/>
							<TextField fullWidth variant="outlined" id="deposit" type="number" label="Deposit" name="deposit" required value={values.deposit || ''} onChange={handleChange} onBlur={handleBlur} error={errors.deposit && touched.deposit}
								helperText={touched.deposit && errors.deposit}
							/>
							<TextField fullWidth variant="outlined" select name="lease_type" label="Lease Type" id="lease_type" onBlur={handleBlur} onChange={handleChange} value={values.lease_type || ''} required error={errors.lease_type && touched.lease_type}
								helperText={touched.lease_type && errors.lease_type}
							>
								{
									LEASE_OPTIONS.map((lease_option, index) => <MenuItem key={index} value={lease_option}>{lease_option}</MenuItem>)
								}
							</TextField>
			</Grid>
			{/** start of the adjacent column here */}
            <Grid sm={6} container item spacing={9}  direction="column">
			{/** property media and others */}
				<Grid container item spacing={3}>
					<Grid item>
            			<Typography variant="h6">
							Property Media
            			</Typography>
						  <Typography variant="subtitle1" gutterBottom>
							Photos | Floor Plans | Other Media
            			</Typography>
					</Grid>
					<Grid item>
						<Box>
							<DropzoneAreaBase
							  acceptedFiles={['image/*', 'application/*', 'video/*']}
							  filesLimit = {100}
							  maxFileSize = {100000000}
							  showFileNamesInPreviews ={false}
							  showFileNames={true}
							  showAlerts={false}
			  				  dropzoneText={"Drag and drop an image here or click to upload"}
							  onAdd={(files) =>{
							  	setUploadedPropertyImages([...uploadedPropertyImages, ...files]);
							  } }
							  onDrop={(files) =>{
							  	setUploadedPropertyImages([...uploadedPropertyImages, ...files]);
							  } }
							/>
					</Box>
					</Grid>
					<Grid item>
					<div className={classes.gridListContainer}>
							<GridList cellHeight={300} className={classes.gridList}>
									<GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
									  <ListSubheader component="div">Uploaded Images</ListSubheader>
									</GridListTile>
									 {uploadedPropertyImages.map((propertyImage) => (
												   <GridListTile key={propertyImage.data}>
													 <img src={propertyImage.data} alt={propertyImage.name} />
													 <GridListTileBar
													   title={`${propertyImage.name} file `}
													   subtitle={<span>Name: {propertyImage.type}</span>}
													   actionIcon={
																			   <IconButton aria-label={`${propertyImage.name}`} className={classes.icon}>
																				 <DeleteIcon />
																			   </IconButton>
																			 }
													 />
												   </GridListTile>
												 ))}
							</GridList>
					</div>
				</Grid>
				</Grid>
			{/** Other property features  ***/}
				<Grid item container direction="column" justify="space-evenly" alignItems="flex-start">
					<Grid item> 
            			<Typography variant="h6">
							Other Property Features
            			</Typography>
            			<Typography variant="subtitle1">
							Home Comforts
            			</Typography>
					</Grid>
               		 <Grid item container spacing={4} direction="row">
						<Grid item> 
							 <FormGroup>
			         		 	<FormControlLabel control={<Checkbox checked={values.balcony} onChange={ event => setFieldValue('balcony', !values.balcony)} value='Balcony' />} label="Balcony" />
			         		 	<FormControlLabel control={<Checkbox checked={values.fully_furnished} onChange={ event => setFieldValue('fully_furnished', !values.fully_furnished)} value='fully_furnished' />} label="Fully Furnished" />
			         		 	<FormControlLabel control={<Checkbox checked={values.solid_wood_floor} onChange={ event => setFieldValue('solid_wood_floor', !values.solid_wood_floor)} value='solid_wood_floor' />} label="Solid Wood Floors" />
							</FormGroup>
						</Grid>
						<Grid item> 
							<FormGroup>
			         		 	<FormControlLabel control={<Checkbox checked={values.air_conditioning} onChange={ event => setFieldValue('air_conditioning', !values.air_conditioning)} value='Central Air Conditioning' />} label="Central Air Conditioning" />
			         		 	<FormControlLabel control={<Checkbox checked={values.high_floor} onChange={ event => setFieldValue('high_floor', !values.high_floor)} value='high_floor' />} label="On high floor" />
			         		 	<FormControlLabel control={<Checkbox checked={values.sea_water_view} onChange={ event => setFieldValue('sea_water_view', !values.sea_water_view)} value='sea_water_view' />} label="View of Sea/Water" />
							</FormGroup> 
						</Grid>
					 </Grid>
				 </Grid>
			{/* end of other property features here */}
				<Grid item direction="column">
			{/* Owner and tenant info here */}
            			<Typography variant="h6">
							Owner/Tenant
            			</Typography>
							<TextField fullWidth  select multiple  variant="outlined" id="owner" name="owner" label="Property Owner" value={values.owner || ''} onChange={handleChange} onBlur={handleBlur} helperText="Property Owner">{
									OWNERS.map((owner, index) => <MenuItem key={index} value={owner}>{owner}</MenuItem>)
								}

							</TextField>
							<Select fullWidth select multiple variant="outlined" id="tenant" name="tenant" label="Tenant" value={ values.tenants || [] } onChange={handleChange} onBlur={handleBlur} helperText="Tenant" renderValue={(tenant) => <Chip label={tenant} className={classes.chip} /> }>
							 {
									TENANTS.map((tenant, index) => <MenuItem key={index} value={tenant}>{tenant}</MenuItem>)
								}
							</Select>	
				</Grid>
				</Grid>
			<Grid item container justify="center" alignItems="space-evenly" direction="row" className={classes.buttonBox}>
								<Button color="secondary" variant="contained"
									size='medium' startIcon={<CancelIcon />}
									component={Link} to={`${match.url}`}
									disableElevation>Cancel</Button>
								<Button type="submit" color="primary" variant="contained" size='medium'
									startIcon={<SaveIcon />} form='contactInputForm' onClick={() => handleSubmit()} disabled={isSubmitting}>Save</Button>
					</Grid>
					</Grid>
					</form>
			);
		}

		let PropertyInputForm = withFormik({
			mapPropsToValues: (props) => {
				let propertyToEditId = props.match.params.propertyId
				let propertyToEdit = props.properties.find(({ id }) => id === propertyToEditId)
				if (!propertyToEdit) {
					propertyToEdit = {}
				}
				return {
					...propertyToEdit,
					match: props.match,
					error: props.error,
					submitForm: props.submitForm
				}
			},

			validate: values => {
				let errors = {};
				if (!values.ref) {
					errors.ref = 'Ref Required';
				}
				if (!values.postal_code) {
					errors.postal_code = 'postal_code is Required';
				}
				if (!values.beds) {
					errors.beds = 'Beds is Required';
				}
				if (!values.baths) {
					errors.baths = 'Baths is Required';
				}
				if (!values.furnished) {
					errors.furnished = 'Furnished is Required';
				}
				if (!values.property_type) {
					errors.property_type = 'Type is Required';
				}
				if (!values.view) {
					errors.view = 'view is Required';
				}
				return errors;
			},

			handleSubmit: (values, { resetForm }) => {
				window.alert('handleSubmitCalled')
				let property = {
					id: values.id,
					ref: values.ref,
					region: values.region,
					city: values.city,
					postal_code: values.postal_code,
					address_1: values.address_1,
					floor: values.floor,
					property_type: values.property_type,
					beds: values.beds,
					baths: values.baths,
					country: values.country,
					square_footage: values.square_footage,
					currency: values.currency,
					price: values.price,
					furnished: values.furnished,
					frequency: values.frequency,
					checks: values.checks,
					commission: values.commission,
					deposit: values.deposit,
					lease_type: values.lease_type,
					view: values.view,
					address_2: values.address_2
        }
        values.submitForm(property);
        resetForm({});
    },
    enableReinitialize: true,
    displayName: 'Property Input Form', // helps with React DevTools

})(InputForm);

const mapStateToProps = (state) => {
    return {
        properties: state.properties, error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: property => {
            dispatch(handleItemFormSubmit(property, 'properties'))
        },
    }
}


PropertyInputForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyInputForm)


export default withRouter(PropertyInputForm);
